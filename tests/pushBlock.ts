import amqplib from "amqplib";
import { env } from "./env";

async function main() {
	const payload = {
		id: "sample-block",
		network: "osmo-test-5",
		block: {
			hash: "7DBAC837D89155ABFC734E62A65D26AA47CDEB39A5822D829EC8AEF7AEC2BE4E",
			height: "1740038",
			network: "osmo-test-5",
			timestamp: "2023-07-18T18:38:24.244Z",
			transactions: [
				{
					hash: "CB2DAD664569B9D48BD592C11722032273FB6D3EDDBF0B319D67B805B03ED2FD",
					logs: [],
					height: "1740038",
					success: true,
					messages: [
						{
							hash: "CB2DAD664569B9D48BD592C11722032273FB6D3EDDBF0B319D67B805B03ED2FD",
							type: "cosmwasm.wasm.v1.MsgExecuteContract",
							value: {
								msg: {
									send: {
										msg: "eyJvcGVuX3Bvc2l0aW9uIjp7InNsaXBwYWdlX2Fzc2VydCI6bnVsbCwibGV2ZXJhZ2UiOiI1IiwiZGlyZWN0aW9uIjoic2hvcnQiLCJtYXhfZ2FpbnMiOiIyIiwic3RvcF9sb3NzX292ZXJyaWRlIjpudWxsLCJ0YWtlX3Byb2ZpdF9vdmVycmlkZSI6bnVsbH19",
										amount: "140000000",
										contract:
											"osmo1vhg6h7mp04dwm0wxeemyarg0g9nktcgpg9xrcmca8y5ulwd00dzsvvy4r5",
									},
								},
								funds: [],
								sender: "osmo1s6jghp8g388v78dwz0k6nt09yftggwpxlzwfrj",
								contract:
									"osmo1g68w56vq9q0vr2mdlzp2l80j0lelnffkn7y3zhek5pavtxzznuks8wkv6k",
							},
							height: "1740038",
							addresses: ["osmo1s6jghp8g388v78dwz0k6nt09yftggwpxlzwfrj"],
						},
					],
				}, {
					hash: "CB2DAD664569B9D48BD592C11722032273FB6D3EDDBF0B319D67B805B03ED2FD",
					logs: [],
					height: "1740038",
					success: true,
					messages: [
						{
							hash: "CB2DAD664569B9D48BD592C11722032273FB6D3EDDBF0B319D67B805B03ED2FD",
							type: "cosmwasm.wasm.v1.MsgExecuteContract",
							value: {
								msg: {
									send: {
										msg: "eyJvcGVuX3Bvc2l0aW9uIjp7InNsaXBwYWdlX2Fzc2VydCI6bnVsbCwibGV2ZXJhZ2UiOiI1IiwiZGlyZWN0aW9uIjoic2hvcnQiLCJtYXhfZ2FpbnMiOiIyIiwic3RvcF9sb3NzX292ZXJyaWRlIjpudWxsLCJ0YWtlX3Byb2ZpdF9vdmVycmlkZSI6bnVsbH19",
										amount: "140000000",
										contract:
											"osmo1vhg6h7mp04dwm0wxeemyarg0g9nktcgpg9xrcmca8y5ulwd00dzsvvy4r5",
									},
								},
								funds: [],
								sender: "osmo1s6jghp8g388v78dwz0k6nt09yftggwpxlzwfrj",
								contract:
									"osmo1g68w56vq9q0vr2mdlzp2l80j0lelnffkn7y3zhek5pavtxzznuks8wkv6k",
							},
							height: "1740038",
							addresses: ["osmo1s6jghp8g388v78dwz0k6nt09yftggwpxlzwfrj"],
						},
					],
				},
			],
		},
	};

	const conn = await amqplib.connect(env.AMQP_HOST);
	const channel = await conn.createChannel();
	const result = channel.sendToQueue(env.BLOCK_QUEUE, Buffer.from(JSON.stringify(payload)), {
		correlationId: payload.id,
		replyTo: env.EVENT_QUEUE
	});
	console.log(result);

	return;
}

main();
