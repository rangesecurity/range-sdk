import { Piscina, version } from 'piscina';
import { IStat, ITaskResult, ITask, ITaskStatus } from '../types/ITask';
import { randomUUID } from 'crypto';
import { logger } from '../utils/logger';
import { dayjs } from '../utils/dayjs';

const taskMap = new Map<
  string,
  {
    controller: AbortController;
    timingArr: Float64Array;
  }
>();

// how to cancel threads related to failed tasks
export let pool: Piscina<ITask, ITaskResult>;

export async function initPool(
  options: ConstructorParameters<typeof Piscina>[0]
) {
  // Filter out V8 flags from parent process that are invalid for worker threads
  const parentArgv = options?.execArgv || [];
  const safeArgv = parentArgv.filter(
    (arg) => !arg.startsWith('--max-old-space-size')
  );

  const optimizedOptions: ConstructorParameters<typeof Piscina>[0] = {
    ...options,
    execArgv: ['--trace-warnings', '--trace-uncaught', ...safeArgv],
  };

  pool = new Piscina<ITask, ITaskResult>(optimizedOptions);
  logger.info(
    `Piscina Pool version ${version} Initialized with ${optimizedOptions.maxThreads} threads.`
  );

  // Warm up pool with fewer concurrent initializations to reduce memory spike
  const warmupBatchSize = optimizedOptions.maxThreads || 10;

  const batch = Array(warmupBatchSize)
    .fill(0)
    .map(() => pool.run(null as any)); // types override here since its a warm up task
  await Promise.all(batch);

  logger.info('Piscina Pool warmed up.');
}

// Reduced timeout for faster failure detection
const ABORT_THRESHOLD = 12_000;
const ABORT_MESSAGE = 'Aborting due to timeout';

let threadMonitorInterval: ReturnType<typeof setInterval> | null = null;

export function initThreadMonitor() {
  if (!threadMonitorInterval) {
    threadMonitorInterval = setInterval(() => {
      for (const [taskId, { controller, timingArr }] of taskMap.entries()) {
        const threadBegin = timingArr![0];
        const threadProcessingTime = Date.now() - threadBegin;

        if (threadBegin && threadProcessingTime > ABORT_THRESHOLD) {
          controller.abort(ABORT_MESSAGE);
          taskMap.delete(taskId);
        }
      }
    }, 100);
  }
}

export function stopThreadMonitor() {
  if (threadMonitorInterval) {
    clearInterval(threadMonitorInterval);
    threadMonitorInterval = null;
  }
}

export function trackTask(
  taskId: string,
  controller: AbortController,
  timingArr: Float64Array
) {
  taskMap.set(taskId, { controller, timingArr });
}

export function untrackTask(taskId: string) {
  taskMap.delete(taskId);
}

export async function closePool() {
  stopThreadMonitor();

  // Clean up remaining tasks
  for (const [taskId, { controller }] of taskMap.entries()) {
    controller.abort('Pool shutdown');
  }
  taskMap.clear();

  logger.info('Piscina Pool destroyed.');
  if (pool) {
    await pool.destroy();
  }
}

/**
 * Get current thread pool statistics for monitoring
 */
export interface IPoolStats {
  threads: number;
  active_threads: number;
  idle_threads: number;
  queue_size: number;
  completed_tasks: number;
  utilization: number;
  pending_aborts: number;
}

export function getPoolStats(): IPoolStats {
  if (!pool) {
    return {
      threads: 0,
      active_threads: 0,
      idle_threads: 0,
      queue_size: 0,
      completed_tasks: 0,
      utilization: 0,
      pending_aborts: 0,
    };
  }

  const threads = pool.threads.length;
  const utilization = pool.utilization;
  const activeThreads = Math.round(threads * utilization);

  return {
    threads,
    active_threads: activeThreads,
    idle_threads: threads - activeThreads,
    queue_size: pool.queueSize,
    completed_tasks: pool.completed,
    utilization: Math.round(utilization * 100),
    pending_aborts: taskMap.size,
  };
}

export async function runTask(task: ITask): Promise<IStat> {
  const taskId = randomUUID();
  const controller = new AbortController();
  const parentBegin = Date.now();

  // Create timing communication buffer - using smaller buffer
  const timingBuffer = new SharedArrayBuffer(8);
  const timingArr = new Float64Array(timingBuffer);
  timingArr[0] = 0;

  const enhancedTask = { ...task, timingBuffer };

  trackTask(taskId, controller, timingArr);

  try {
    const result = await pool.run(enhancedTask, { signal: controller.signal });
    const parentEnd = Date.now();

    const totalTime = parentEnd - parentBegin;
    const processingTime = result.threadTimeSpent;
    const waitTime = totalTime - processingTime;

    untrackTask(taskId);

    return {
      threadTimeSpent: processingTime,
      waitTimeSpent: waitTime,
      status: result.status,
      alertRuleId: task.alertRule.id,
      blockInfo: 'blockInfo' in task ? task.blockInfo : undefined,
      tickInfo: 'tickInfo' in task ? task.tickInfo : undefined,
      events: result.events,
      eventCount: result.events.length,
      error: result.error,
      startedAt: dayjs(parentBegin).toISOString(),
    };
  } catch (error) {
    let status: ITaskStatus = 'failure';

    const parentEnd = Date.now();
    const totalTime = parentEnd - parentBegin;
    const threadBegin = 0;
    const threadEnd = 0;
    let processingTime = threadEnd - threadBegin;
    let waitTime = totalTime - processingTime;

    untrackTask(taskId);

    if (error.cause === ABORT_MESSAGE) {
      status = 'timeout';
      processingTime = ABORT_THRESHOLD;
      waitTime = totalTime - ABORT_THRESHOLD;
    }

    return {
      events: [],
      threadTimeSpent: processingTime,
      waitTimeSpent: waitTime,
      status,
      alertRuleId: task.alertRule.id,
      ...('blockInfo' in task && { blockInfo: task.blockInfo }),
      ...('tickInfo' in task && { tickInfo: task.tickInfo }),
      eventCount: 0,
      error:
        error instanceof Error ? error.stack || error.message : String(error),
      startedAt: dayjs(parentBegin).toISOString(),
    };
  }
}
