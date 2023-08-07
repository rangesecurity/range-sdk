import { Kafka, Partitioners } from 'kafkajs';
import { test_env } from './env';
import { block } from './testBlock';

async function main() {
	const kafka = new Kafka({
		clientId: "test-pusher",
		brokers: [test_env.KAFKA_BROKER],
	})

	const producer = kafka.producer({
		createPartitioner: Partitioners.LegacyPartitioner
	})
	await producer.connect()

	await producer.send({
		topic: test_env.KAFKA_TOPIC,
		messages: [
			{ value: JSON.stringify(block), key: block.height },
		],
	})

	await producer.disconnect()
}
main();
