import 'reflect-metadata';
import {
  ProcessorRegistry,
  BlockProcessor,
  TickProcessor,
  IBlockProcessor,
  ITickProcessor,
} from '../utils/processor';
import { ISubEvent } from '../types/IEvent';
import { ITask } from '../types/ITask';

// Mock heavy dependencies to avoid pulling in flatbuffers/redis/etc
jest.mock('../services/AssetManager', () => ({
  initAssetService: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../wrappers/solana-block-wrapper', () => ({
  SolanaBlockWrapper: jest.fn(),
}));
jest.mock('./../../src/processors/processors', () => ({}));

// Import after mocks are set up
import { processTask } from '../processors/index';

beforeEach(() => {
  (ProcessorRegistry as any).processorMap = new Map();
});

class MockBlockProcessor extends BlockProcessor {
  async callback({ rule, block }: IBlockProcessor): Promise<ISubEvent[]> {
    return [
      {
        caption: `Block ${block.height}`,
        details: { message: `Processed block ${block.height}` },
        txHash: 'tx123',
        addressesInvolved: ['addr1'],
      },
    ];
  }
}

class MockTickProcessor extends TickProcessor {
  async callback({ rule, timestamp }: ITickProcessor): Promise<ISubEvent[]> {
    return [
      {
        caption: 'Tick event',
        details: { message: `Tick at ${timestamp}` },
      },
    ];
  }
}

function makeBlockTask(ruleType: string, blockData: object): ITask {
  const json = JSON.stringify(blockData);
  const encoded = new TextEncoder().encode(json);
  const sab = new SharedArrayBuffer(encoded.length);
  new Uint8Array(sab).set(encoded);

  return {
    alertRule: {
      id: 'rule-1',
      ruleType,
      network: 'eth',
      parameters: {},
      createdAt: new Date().toISOString(),
      triggerMode: 'BLOCK',
    },
    blockInfo: { network: 'eth', height: '100', time: '2024-01-01T00:00:00Z' },
    sharedBuffer: sab,
    sharedBufferLength: encoded.length,
    flatBuffer: false,
    processorsFile: 'unused',
  };
}

function makeTickTask(ruleType: string): ITask {
  return {
    alertRule: {
      id: 'rule-2',
      ruleType,
      network: 'osmosis-1',
      parameters: {},
      createdAt: new Date().toISOString(),
      triggerMode: 'TICK',
    },
    tickInfo: { time: '2024-01-01T00:00:00Z' },
    processorsFile: 'unused',
  };
}

describe('processTask', () => {
  it('throws for unknown rule type', async () => {
    const task = makeBlockTask('nonexistent', { height: 1 });
    await expect(processTask(task)).rejects.toThrow(
      'Unknown rule type: nonexistent'
    );
  });

  it('processes a block task', async () => {
    ProcessorRegistry.register(
      {
        type: 'mock-block',
        label: 'Mock',
        description: '',
        parameters: [],
        networks: ['eth'],
        tags: ['security'],
      },
      MockBlockProcessor
    );

    const task = makeBlockTask('mock-block', { height: 100, transactions: [] });
    const events = await processTask(task);

    expect(events).toHaveLength(1);
    expect(events[0].caption).toBe('Block 100');
    expect(events[0].alertRuleId).toBe('rule-1');
    expect(events[0].network).toBe('eth');
    expect(events[0].blockNumber).toBe('100');
    expect(events[0].txHash).toBe('tx123');
    expect(events[0].addressesInvolved).toEqual(['addr1']);
    expect(events[0].id).toBeDefined(); // UUID generated
  });

  it('processes a tick task', async () => {
    ProcessorRegistry.register(
      {
        type: 'mock-tick',
        label: 'Mock',
        description: '',
        parameters: [],
        networks: ['eth'],
        tags: ['security'],
      },
      MockTickProcessor
    );

    const task = makeTickTask('mock-tick');
    const events = await processTask(task);

    expect(events).toHaveLength(1);
    expect(events[0].caption).toBe('Tick event');
    expect(events[0].alertRuleId).toBe('rule-2');
    expect(events[0].time).toBe('2024-01-01T00:00:00Z');
  });

  it('throws for task with neither blockInfo nor tickInfo', async () => {
    ProcessorRegistry.register(
      {
        type: 'mock',
        label: 'Mock',
        description: '',
        parameters: [],
        networks: ['eth'],
        tags: ['security'],
      },
      MockBlockProcessor
    );

    const task: ITask = {
      alertRule: {
        id: 'rule-3',
        ruleType: 'mock',
        network: 'eth',
        parameters: {},
        createdAt: new Date().toISOString(),
        triggerMode: 'BLOCK',
      },
      processorsFile: 'unused',
    };

    await expect(processTask(task)).rejects.toThrow('Invalid task type');
  });

  it('generates deterministic event IDs', async () => {
    ProcessorRegistry.register(
      {
        type: 'det-test',
        label: 'Det',
        description: '',
        parameters: [],
        networks: ['eth'],
        tags: ['security'],
      },
      MockBlockProcessor
    );

    const task1 = makeBlockTask('det-test', { height: 100 });
    const task2 = makeBlockTask('det-test', { height: 100 });

    const events1 = await processTask(task1);
    const events2 = await processTask(task2);

    // Same input = same UUID (deterministic via MD5)
    expect(events1[0].id).toBe(events2[0].id);
  });
});
