import { test_env } from './env';
import { block } from './testBlock';
import { connect as amqpConnect } from 'amqplib'

async function main() {
	const conn = await amqpConnect(test_env.AMQP_HOST)
	const channel = await conn.createChannel()
	await channel.assertQueue(test_env.TASK_QUEUE)

	await channel.sendToQueue(
		test_env.TASK_QUEUE,
		Buffer.from(JSON.stringify({
			block
		}))
	)

	await channel.close();
	console.log("Done");
	process.exit(0)
}
main();
