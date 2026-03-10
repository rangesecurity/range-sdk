import { commandOptions } from 'redis';
import * as r from 'redis';
import { z } from 'zod';
import { env } from '../env';
import { logger } from '../utils/logger';
import { safeJsonParse } from '../utils/basic';

const PayloadValidator = z.object({
  id: z.string().min(1),
  message: z.object({
    message: z.string().optional(),
    data: z.string().optional(),
    buffer: z.string().optional(),
  }),
});

// Store active Redis clients for graceful shutdown
const activeClients = new Map<ReturnType<typeof r.createClient>, boolean>();

// Global flag to signal shutdown
let isShuttingDown = false;

// Setup graceful shutdown handlers
let shutdownHandlersSetup = false;

function setupGracefulShutdown() {
  if (shutdownHandlersSetup) return;
  shutdownHandlersSetup = true;

  const gracefulShutdown = async (signal: string) => {
    if (isShuttingDown) return; // Prevent multiple shutdown attempts
    isShuttingDown = true;

    logger.info(
      `Received ${signal}, gracefully shutting down Redis connections...`
    );

    // Disconnect Redis clients
    const disconnectPromises = Array.from(activeClients.entries()).map(
      async ([client, isConnected]) => {
        if (!isConnected) return; // Skip already disconnected clients

        try {
          await client.disconnect();
          activeClients.set(client, false); // Mark as disconnected
          logger.info('Redis client disconnected successfully');
        } catch (error) {
          logger.error('Error disconnecting Redis client:', error);
        }
      }
    );

    await Promise.all(disconnectPromises);
    activeClients.clear();
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
}

export async function createRedisClient(url = env.BLOCK_REDIS_URL) {
  const client = r.createClient({
    url: `redis://${url}`,
  });
  await client.connect();

  // Store URL on client for diagnostic logging
  (client as any).__redisUrl = url;

  // Register client for graceful shutdown
  activeClients.set(client, true); // Mark as connected
  setupGracefulShutdown();

  return client;
}

export async function consumeRedisStream({
  client,
  streamName,
  consumerGroup,
  consumerName,
  callback,
  count = 10,
}: {
  client: ReturnType<typeof r.createClient>;
  streamName: string;
  consumerGroup: string;
  consumerName: string;
  callback: (payload: any, messageId: string) => Promise<void>;
  count?: number;
}) {
  const redisUrl = (client as any).__redisUrl || 'unknown';
  const streamId = `${redisUrl}/${streamName}`;

  if (!streamName || !consumerGroup || !consumerName) {
    throw new Error(
      `Invalid stream config: stream=${streamName}, group=${consumerGroup}, consumer=${consumerName}, host=${redisUrl}`
    );
  }

  // Ensure stream exists and consumer group is set up
  try {
    const groups = await client.xInfoGroups(streamName);
    const groupExists = groups.some((g) => g.name === consumerGroup);
    if (!groupExists) {
      await client.xGroupCreate(streamName, consumerGroup, '$');
      logger.info(
        `Created consumer group ${consumerGroup} for stream ${streamId}`
      );
    }
  } catch (error: any) {
    if (error.message?.includes('no such key')) {
      throw new Error(
        `Stream ${streamId} does not exist. The stream must be created by the producer before the consumer can connect.`,
        { cause: error }
      );
    } else {
      throw new Error(
        `Failed to setup consumer group on ${streamId}: ${error.message}`,
        { cause: error }
      );
    }
  }

  // Check if consumer exists in group
  const consumers = await client.xInfoConsumers(streamName, consumerGroup);
  const consumerExists = consumers.some((c) => c.name === consumerName);
  if (!consumerExists) {
    // Create consumer in group
    await client.xGroupCreateConsumer(streamName, consumerGroup, consumerName);
  }

  while (!isShuttingDown) {
    try {
      const response = await client.xReadGroup(
        commandOptions({
          isolated: true,
        }),
        consumerGroup,
        consumerName,
        [
          {
            key: streamName,
            id: '>', // Using '>' to read new messages that haven't been delivered to any consumer yet
          },
        ],
        {
          COUNT: count,
          BLOCK: 5000,
        }
      );

      if (response !== null) {
        const messages = response[0].messages;

        // Process messages sequentially to reduce memory spikes
        for (const row of messages) {
          if (isShuttingDown) break; // Stop processing if shutdown initiated

          const msg = PayloadValidator.safeParse(row);
          if (!msg.success) {
            logger.warn(
              `${streamId}: validation failed for ${row.id}: ${msg.error.message}`
            );
            logger.warn(
              `${streamId}: raw keys: ${JSON.stringify(Object.keys(row.message || {}))}`
            );
          }

          // Binary path: base64-encoded FlatBuffer in `buffer` field
          const bufferField = msg.data?.message?.buffer;
          if (msg.success && bufferField) {
            try {
              const binary = Buffer.from(bufferField, 'base64');
              const payload = {
                _binaryBlock: new Uint8Array(
                  binary.buffer,
                  binary.byteOffset,
                  binary.byteLength
                ),
              };
              await callback(payload, msg.data.id);
            } catch (callbackError) {
              logger.error(
                `Callback error for binary message ${row.id}: ${callbackError}`
              );
            }

            try {
              await client.xAck(streamName, consumerGroup, row.id);
            } catch (ackError) {
              logger.error(
                `Failed to acknowledge message ${row.id}:`,
                ackError
              );
            }
            continue;
          }

          // JSON path: parse `data` or `message` field
          const payload = safeJsonParse(
            (msg.data?.message?.data || msg.data?.message?.message) ?? ''
          );

          if (!payload && msg.success) {
            logger.warn(
              `${streamId}: JSON parse failed for ${row.id}, raw: ${JSON.stringify(msg.data?.message).slice(0, 200)}`
            );
          }

          if (msg.success && payload) {
            try {
              await callback(payload, msg.data.id);
            } catch (callbackError) {
              logger.error(
                `Callback error for message ${row.id}: ${callbackError}`
              );
              // Continue processing other messages even if one fails
            }
          }

          // Acknowledge message after successful processing
          try {
            await client.xAck(streamName, consumerGroup, row.id);
          } catch (ackError) {
            logger.error(`Failed to acknowledge message ${row.id}:`, ackError);
          }
        }
      }
    } catch (error: any) {
      if (isShuttingDown) {
        logger.info('Consumer loop stopped due to shutdown');
        break;
      }

      logger.error(
        `Redis stream error on ${streamId} (group=${consumerGroup}): ${error.message}`
      );

      // Exponential backoff on errors to prevent tight error loops
      const backoffDelay = 1000;
      await new Promise((resolve) => setTimeout(resolve, backoffDelay));

      // Don't exit immediately on error during shutdown
      if (!isShuttingDown) {
        process.exit(1);
      }
    }
  }

  logger.info('Redis stream consumer stopped gracefully');
}

export async function publishToStream({
  client,
  streamName,
  payload,
}: {
  client: ReturnType<typeof r.createClient>;
  streamName: string;
  payload: any;
}) {
  if (!streamName) {
    throw new Error(`Invalid stream name: ${streamName}`);
  }

  // Create stream if it doesn't exist
  try {
    await client.xGroupCreate(streamName, streamName, '0', { MKSTREAM: true });
    logger.info(`Created stream ${streamName}`);
  } catch (err: any) {
    // Ignore if group already exists
    if (!err.message.includes('BUSYGROUP')) {
      throw err;
    }
  }

  await client.xAdd(
    streamName,
    '*', // Let Redis generate the message ID
    {
      message: JSON.stringify(payload),
    }
  );

  // Trim stream to keep only the latest 100 elements
  // await client.xTrim(streamName, 'MAXLEN', 100000);

  logger.debug(`Published payload to stream ${streamName}`);
}

export async function publishBinaryToStream({
  client,
  streamName,
  payload,
}: {
  client: ReturnType<typeof r.createClient>;
  streamName: string;
  payload: Uint8Array;
}) {
  if (!streamName) {
    throw new Error(`Invalid stream name: ${streamName}`);
  }

  // Create stream if it doesn't exist
  try {
    await client.xGroupCreate(streamName, streamName, '0', { MKSTREAM: true });
  } catch (err: any) {
    if (!err.message.includes('BUSYGROUP')) {
      throw err;
    }
  }

  await client.xAdd(streamName, '*', {
    buffer: Buffer.from(payload).toString('base64'),
  });

  logger.debug(`Published binary payload to stream ${streamName}`);
}

export type IRedisClient = Awaited<ReturnType<typeof createRedisClient>>;
