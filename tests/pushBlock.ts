import { Kafka, Partitioners } from 'kafkajs';
import { test_env } from './env';

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
		messages: [{
			value: JSON.stringify({
				blockNumber: "1",
				network: "osmosis-1",
				ruleGroupId: "1",
			})
		}],
	})

	await producer.disconnect()

	console.log("Done")
}
main();