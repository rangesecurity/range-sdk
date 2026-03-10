import { IEvent } from '../types/IEvent';
import * as r from 'redis';
import { env } from '../env';
import { logger } from '../utils/logger';

let redisClient: ReturnType<typeof r.createClient>;

export async function initNotificationsRedis() {
  redisClient = r.createClient({
    url: `redis://${env.NOTIFICATIONS_REDIS_URL}`,
  });

  await redisClient.connect();
}

export async function disconnectNotificationsRedis() {
  if (redisClient) {
    await redisClient.disconnect();
  }
}

// Ensure stream exists (called once at init or on first publish)
let streamInitialized = false;

async function ensureStreamExists() {
  if (streamInitialized) return;

  const streamName = env.NOTIFICATIONS_REDIS_STREAM_NAME;
  try {
    await redisClient.xGroupCreate(streamName, streamName, '0', {
      MKSTREAM: true,
    });
    logger.info(`Created stream ${streamName}`);
  } catch (err: any) {
    // Ignore if group already exists
    if (!err.message.includes('BUSYGROUP')) {
      throw err;
    }
  }
  streamInitialized = true;
}

export async function publishEvents(events: IEvent[]) {
  if (!events.length) return;

  await ensureStreamExists();

  const streamName = env.NOTIFICATIONS_REDIS_STREAM_NAME;

  // Use pipeline for batch writes - single round-trip for all events
  const pipeline = redisClient.multi();

  for (const event of events) {
    pipeline.xAdd(streamName, '*', {
      message: JSON.stringify(event),
    });
  }

  await pipeline.exec();

  // Trim once after batch (not per-event)
  // await redisClient.xTrim(streamName, 'MAXLEN', 100);
}
