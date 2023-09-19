import { Kafka, Partitioners } from 'kafkajs';
import { test_env } from './env';

async function main() {
  const kafka = new Kafka({
    clientId: 'test-pusher',
    brokers: [test_env.KAFKA_BROKER],
  });

  const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
  });
  await producer.connect();

  const task = {
    block: {
      height: '1',
      network: 'osmosis-1',
    },
    ruleGroupId: '1',
  };

  await producer.send({
    topic: test_env.KAFKA_TOPIC,
    messages: [
      {
        value: JSON.stringify(task),
      },
    ],
  });

  await producer.disconnect();

  console.log('Successfully published task: ', task);
}
main();
