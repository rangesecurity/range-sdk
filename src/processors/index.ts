import 'reflect-metadata';
import { ITask } from '../types/ITask';
import { IEvent, ISubEvent } from '../types/IEvent';
import { ProcessorRegistry } from '../utils/processor';
import { createHash } from 'crypto';
import { initAssetService } from '../services/AssetManager';
import { SolanaBlockWrapper } from '../wrappers/solana-block-wrapper';

function createUniqueUuidFromEvent(event: any) {
  const hash = createHash('md5').update(JSON.stringify(event)).digest('hex');
  const uuid = `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`;
  return uuid;
}

function mapToEvent(subEvent: ISubEvent, task: ITask): IEvent {
  const rule = task.alertRule;
  const event = {
    ...subEvent,
    workspaceId: rule.workspaceId || null,
    alertRuleId: rule.id,
    time: (task.blockInfo?.time || task.tickInfo?.time)!,
    blockNumber: String(task.blockInfo?.height || 0),
    network: rule.network,
    txHash: subEvent.txHash || '',
    addressesInvolved: subEvent.addressesInvolved || [],
    severity: subEvent.severity || rule.severity || 'medium',
    resolved: false,
  };
  return {
    id: createUniqueUuidFromEvent(event),
    ...event,
  };
}

export async function processTask(task: ITask): Promise<IEvent[]> {
  await initAssetService();
  const rule = task.alertRule;
  const processorInfo = ProcessorRegistry.get(rule.ruleType);

  if (!processorInfo) {
    throw new Error(`Unknown rule type: ${rule.ruleType}`);
  }

  if (task.blockInfo) {
    const sharedArray = new Uint8Array(
      task.sharedBuffer!,
      0,
      task.sharedBufferLength
    );
    const block = task.flatBuffer
      ? new SolanaBlockWrapper(sharedArray)
      : JSON.parse(new TextDecoder().decode(sharedArray));
    const subEvents = await processorInfo.instance.callback({
      rule,
      block,
      timestamp: null as any,
    });
    return subEvents.map((subEvent) => mapToEvent(subEvent, task));
  }

  if (task.tickInfo) {
    const subEvents = await processorInfo.instance.callback({
      rule,
      timestamp: task.tickInfo.time,
      block: null,
    });
    return subEvents.map((subEvent) => mapToEvent(subEvent, task));
  }

  throw new Error('Invalid task type');
}
