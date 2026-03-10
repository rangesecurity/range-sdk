import { Command } from 'commander';
import { env } from '../env';
import { createRedisClient, publishToStream } from '../services/consumer-redis';
import { getCachedBlock } from '../utils/testing-helpers';
import { sleep } from '../utils/basic';

async function main() {
  const program = new Command();

  program
    .option('-n, --network <network>', 'Network name', 'eth')
    .option('-h, --height <height>', 'Block height', parseInt, 23539020)
    .parse(process.argv);

  const options = program.opts();
  const network = options.network;
  const startHeight = options.height;

  const block = await getCachedBlock(network, startHeight);
  // Add network field to block data
  block.network = network;

  const redis = await createRedisClient();

  for (let i = 0; i < 1000; i++) {
    await publishToStream({
      client: redis,
      streamName: env.BLOCK_REDIS_STREAM_NAME,
      payload: block,
    });
    console.log(`Published ${network}:${startHeight}`);

    await publishToStream({
      client: redis,
      streamName: env.TICK_REDIS_STREAM_NAME,
      payload: {
        time: new Date().toISOString(),
      },
    });
    console.log(`Published tick: ${new Date().toISOString()}`);
    await sleep(100);
  }
}

main();
