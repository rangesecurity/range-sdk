import * as amqp from 'amqplib';
import { env } from './env';

async function consumer() {
	try {
		const connection = await amqp.connect(env.AMQP_HOST);
		const channel = await connection.createChannel();

		await channel.assertQueue(env.EVENT_QUEUE);

		// Consume messages from the queue
		channel.consume(env.EVENT_QUEUE, (msg) => {
			if (msg) {
				const message = msg.content.toString();
				console.log('Received:', message);
				channel.ack(msg);
			}
		});

		console.log('Waiting for RPC requests...');
	} catch (error) {
		console.error('Error:', error);
	}
}

consumer();
