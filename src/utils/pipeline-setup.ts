import 'reflect-metadata';
import { join } from 'path';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { initPool, closePool } from '../threadpool/pool';

export interface PipelineContext {
  container: StartedTestContainer;
  redisUrl: string;
}

export interface PipelineOptions {
  maxThreads?: number;
  processorsFile: string;
}

export async function setupPipeline(
  opts: PipelineOptions
): Promise<PipelineContext> {
  const container = await new GenericContainer('redis:7-alpine')
    .withExposedPorts(6379)
    .start();

  const redisUrl = `${container.getHost()}:${container.getMappedPort(6379)}`;
  process.env.BLOCK_REDIS_URL = redisUrl;
  process.env.TICK_REDIS_URL = redisUrl;
  process.env.RUNNER_CACHE_REDIS_URL = redisUrl;
  process.env.NOTIFICATIONS_REDIS_URL = redisUrl;

  await import(opts.processorsFile);

  await initPool({
    filename: join(__dirname, '..', 'threadpool', 'worker.js'),
    maxThreads: opts.maxThreads ?? 2,
  });

  return { container, redisUrl };
}

export async function destroyPipeline(ctx: PipelineContext): Promise<void> {
  await closePool();
  await ctx.container.stop();
  process.exit(0);
}
