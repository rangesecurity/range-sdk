import {
  Kafka,
  Consumer,
  RetryOptions,
  ConsumerGroupState,
  MemberDescription,
} from 'kafkajs';
import { Logger } from 'pino';
import { getLogger } from '../logger';

export type QueueHealthStats =
  | {
      health: 1;
      groupId: string;
      state: ConsumerGroupState;
      members: MemberDescription[];
      protocol: string;
      protocolType: string;
    }
  | {
      health: 0;
    };

export class KafkaConsumerClient {
  private consumer: Consumer;
  private logger: Logger;

  constructor(kafka: Kafka, groupId: string, retry?: RetryOptions) {
    this.logger = getLogger({ name: `rangeSDK-kafkaGroupID-${groupId}` });
    this.consumer = kafka.consumer({
      groupId,
      retry,
      readUncommitted: false,
      allowAutoTopicCreation: false,
    });
  }

  async subscribeAndConsume(topic: string): Promise<Consumer> {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic,
      fromBeginning: true,
    });

    return this.consumer;
  }

  async health(): Promise<QueueHealthStats> {
    try {
      const stats = await this.consumer.describeGroup();
      return {
        health: ['Unknown', 'Dead', 'Empty'].includes(stats.state) ? 0 : 1,
        ...stats,
      };
    } catch (err) {
      this.logger.error(err, 'error while fetching consumer stats');
      return {
        health: 0,
      };
    }
  }

  async gracefulShutdown() {
    await this.consumer.disconnect();
  }
}
