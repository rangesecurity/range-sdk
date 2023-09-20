import { Kafka, Consumer } from 'kafkajs';

export class KafkaConsumerClient {
  private consumer: Consumer;

  constructor(kafka: Kafka, runnerID: string) {
    this.consumer = kafka.consumer({ groupId: `rangeSDK-runner-${runnerID}` });
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
