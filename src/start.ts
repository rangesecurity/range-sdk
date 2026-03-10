import { config } from 'dotenv';
config({
  quiet: true,
});

import { startRunner } from './threadpool/runner';
import { join } from 'path';

async function main() {
  const testAlertRules: any[] = [
    // 10 BLOCK rules (9 healthy + 1 hang)
    {
      ruleType: 'PercBasedBenchmark',
      parameters: { perc: 100 },
      triggerMode: 'BLOCK',
    },
    { ruleType: 'EmptyRule', parameters: {}, triggerMode: 'BLOCK' },
    { ruleType: 'EmptyRule', parameters: {}, triggerMode: 'BLOCK' },
    { ruleType: 'EmptyRule', parameters: {}, triggerMode: 'BLOCK' },
    { ruleType: 'BlockLiveness', parameters: {}, triggerMode: 'BLOCK' },
    { ruleType: 'BlockLiveness', parameters: {}, triggerMode: 'BLOCK' },
    { ruleType: 'EmptyRule', parameters: {}, triggerMode: 'BLOCK' },
    { ruleType: 'EmptyRule', parameters: {}, triggerMode: 'BLOCK' },
    { ruleType: 'EmptyRule', parameters: {}, triggerMode: 'BLOCK' },
    { ruleType: 'Hang', parameters: {}, triggerMode: 'BLOCK' }, // Faulty - will timeout

    // 10 TICK rules (9 healthy + 1 hang)
    { ruleType: 'TickLiveness', parameters: {}, triggerMode: 'TICK' },
    { ruleType: 'EmptyRuleTick', parameters: {}, triggerMode: 'TICK' },
    { ruleType: 'EmptyRuleTick', parameters: {}, triggerMode: 'TICK' },
    { ruleType: 'EmptyRuleTick', parameters: {}, triggerMode: 'TICK' },
    { ruleType: 'EmptyRuleTick', parameters: {}, triggerMode: 'TICK' },
    { ruleType: 'EmptyRuleTick', parameters: {}, triggerMode: 'TICK' },
    { ruleType: 'EmptyRuleTick', parameters: {}, triggerMode: 'TICK' },
    { ruleType: 'EmptyRuleTick', parameters: {}, triggerMode: 'TICK' },
    { ruleType: 'EmptyRuleTick', parameters: {}, triggerMode: 'TICK' },
    { ruleType: 'HangTick', parameters: {}, triggerMode: 'TICK' }, // Faulty - will timeout
  ];

  testAlertRules.forEach((e: any, i) => {
    e.createdAt = new Date().toISOString();
    e.network = 'eth';
    e.id = i;
  });

  await startRunner({
    processors: join(__dirname, 'processors', 'processors.js'),
    testAlertRules,
    config: {
      rangeSdkToken: process.env.RANGE_SDK_TOKEN!,
      port: Number(process.env.PORT) || 3000,
      redisUrl: process.env.BLOCK_REDIS_URL,
      redis: {
        tickUrl: process.env.TICK_REDIS_URL,
        notificationsUrl: process.env.NOTIFICATIONS_REDIS_URL,
      },
      blockStream: {
        name: process.env.BLOCK_REDIS_STREAM_NAME || 'decoded/solana',
        consumerGroup: process.env.BLOCK_REDIS_CONSUMER_GROUP || 'test-group',
        consumerName:
          process.env.BLOCK_REDIS_CONSUMER_NAME || 'test-consumer-0',
      },
      tickStream: {
        name: process.env.TICK_REDIS_STREAM_NAME || 'ticks',
        consumerGroup: process.env.TICK_REDIS_CONSUMER_GROUP || 'test-group',
        consumerName: process.env.TICK_REDIS_CONSUMER_NAME || 'test-consumer-0',
      },
      notificationsStreamName:
        process.env.NOTIFICATIONS_REDIS_STREAM_NAME || 'notifications',
    },
  });
  throw new Error('Should not return');
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
