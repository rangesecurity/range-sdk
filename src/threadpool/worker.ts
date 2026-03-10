import { threadId } from 'worker_threads';

// Track seen threads
const seenThreads = new Set();

import { ITask, ITaskResult } from '../types/ITask';
import { processTask } from '../processors';
import { initAssetService } from '../services/AssetManager';
import { sleep } from '../utils/basic';
import { logger } from '../utils/logger';

async function warmUpThread() {
  await sleep(1000);
  return null;
}

let threadInitialized = false;
async function initThread() {
  await initAssetService();
}

export default async function (task: ITask): Promise<ITaskResult> {
  if (task?.processorsFile) {
    await import(task.processorsFile);
  }

  if (!seenThreads.has(threadId)) {
    seenThreads.add(threadId);
    logger.info(`New thread ${threadId} initialized`);
  } else {
    // console.log(`Reusing old thread: ${threadId}`);
  }

  if (!task) {
    return (await warmUpThread()) as unknown as ITaskResult;
  }

  if (!threadInitialized) {
    await initThread();
    threadInitialized = true;
  }

  const threadBegin = Date.now();

  const timingArr = new Float64Array(task.timingBuffer!);
  timingArr[0] = threadBegin;

  const start = Date.now();
  try {
    const events = await processTask(task);
    const end = Date.now();
    return {
      status: 'success',
      events,
      threadTimeSpent: end - start,
    };
  } catch (error) {
    // console.log(error);
    const end = Date.now();
    return {
      status: 'failure',
      error:
        error instanceof Error ? error.stack || error.message : String(error),
      events: [],
      threadTimeSpent: end - start,
    };
  }
}
