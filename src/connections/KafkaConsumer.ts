import { Kafka, Consumer, RetryOptions } from 'kafkajs';

export class KafkaConsumerClient {
  private consumer: Consumer;

  constructor(kafka: Kafka, groupId: string, retry?: RetryOptions) {
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

  async gracefulShutdown() {
    await this.consumer.disconnect();
  }
}
