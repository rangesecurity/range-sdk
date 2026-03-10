import * as r from 'redis';
import { commandOptions } from 'redis';
import { z } from 'zod';
import { safeJsonParse } from './basic';
import { logger } from './logger';

const PayloadValidator = z.object({
  id: z.string().min(1),
  message: z.object({
    message: z.string(),
  }),
});

let lastLoggedTime: Date | null = null;
const LOG_THROTTLE_MINUTES = 10;

export async function consumeRedisStream({
  client,
  streamName,
  consumerGroup,
  consumerName,
  callback,
}: {
  client: ReturnType<typeof r.createClient>;
  streamName: string;
  consumerGroup: string;
  consumerName: string;
  callback: (payload: any, messageId: string) => Promise<void>;
}) {
  if (!streamName || !consumerGroup || !consumerName) {
    console.error(
      `Invalid stream name, consumer group, or consumer name: ${streamName}, ${consumerGroup}, ${consumerName}`
    );
    throw new Error(
      `Invalid stream name, consumer group, or consumer name: ${streamName}, ${consumerGroup}, ${consumerName}`
    );
  }

  // Check if consumer group exists
  const groups = await client.xInfoGroups(streamName);
  const groupExists = groups.some((g) => g.name === consumerGroup);
  if (!groupExists) {
    // Create consumer group starting from latest message
    await client.xGroupCreate(streamName, consumerGroup, '$');
    logger.info(
      `Created consumer group ${consumerGroup} for stream ${streamName}`
    );
  }

  // Check if consumer exists in group
  const consumers = await client.xInfoConsumers(streamName, consumerGroup);
  const consumerExists = consumers.some((c) => c.name === consumerName);
  if (!consumerExists) {
    // Create consumer in group
    await client.xGroupCreateConsumer(streamName, consumerGroup, consumerName);
    logger.info(`Created consumer ${consumerName} in group ${consumerGroup}`);
  }

  while (true) {
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
        COUNT: 10,
        BLOCK: 5000,
      }
    );

    if (response !== null) {
      for (const row of response[0].messages) {
        const msg = PayloadValidator.safeParse(row);
        if (msg.success) {
          const payload = safeJsonParse(msg.data.message.message);
          if (payload) {
            await callback(payload, msg.data.id);
            // console.log('Callback executed successfully');
          }
        }

        await client.xAck(streamName, consumerGroup, row.id);
        // console.log('Acknowledging message:', row.id);
      }
    } else {
      logIfThresholdExceeded(
        `No new messages in stream ${streamName} for consumer ${consumerName}`
      );
    }
  }
}

function logIfThresholdExceeded(message: string) {
  const now = new Date();

  if (
    !lastLoggedTime ||
    now.getTime() - lastLoggedTime.getTime() > LOG_THROTTLE_MINUTES * 60 * 1000
  ) {
    logger.info(message);
    lastLoggedTime = now;
  }
}

export async function createRedisClient(url: string) {
  const client = r.createClient({
    url: `redis://${url}`,
  });
  await client.connect();
  return client;
}

export async function consumeById({
  client,
  streamName,
  messageId,
  callback,
}: {
  client: ReturnType<typeof r.createClient>;
  streamName: string;
  messageId: string;
  callback?: (payload: any, messageId: string) => Promise<void>;
}) {
  if (!streamName) {
    throw new Error(`Invalid stream name: ${streamName}`);
  }

  // Read message by ID using xRange to get a single message
  const response = await client.xRange(streamName, messageId, messageId);

  if (response && response.length > 0) {
    const message = response[0];

    if (callback) {
      const msg = PayloadValidator.safeParse(message);
      if (msg.success) {
        const payload = safeJsonParse(msg.data.message.message);
        if (payload) {
          await callback(payload, msg.data.id);
        }
      }
    }

    return message;
  }

  logger.info('Message not found');
  return null;
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
    await client.xGroupCreate(streamName, streamName, '$', { MKSTREAM: true });
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
  logger.debug(`Published payload to stream ${streamName}`);
}
