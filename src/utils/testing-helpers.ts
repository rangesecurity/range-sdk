import { IAlertRule } from '../types/IAlertRule';
import { ISubEvent } from '../types/IEvent';
import { BlockProcessor, TickProcessor } from './processor';
import { randomUUID } from 'crypto';
import { dayjs } from './dayjs';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import * as path from 'path';
import { axios } from '../services/axios';
import { INetwork } from '../types/INetwork';
import { config } from 'dotenv';
config({
  quiet: true,
});

/** Piscina worker config that loads src/worker.ts directly via ts-node (no dist build needed) */
export const testWorkerFilename = path.join(
  __dirname,
  '..',
  'threadpool',
  'worker.ts'
);
export const testWorkerExecArgv = ['--require', 'ts-node/register'];

export const createNewAlertRule = (rule: {
  ruleType: string;
  id?: string;
  ruleGroupId?: string;
  workspaceId?: string;
  createdAt?: Date;
  parameters?: any;
  network?: INetwork;
  severity?: string;
  triggerMode?: string;
}): IAlertRule & { cache?: any } => {
  if (!rule.ruleType) {
    throw new Error(
      'You forget to set ruleType, this will result in unexpected behavior and the rule will be considered as successTransaction!'
    );
  }
  rule.id = rule.id || getNewId();
  rule.ruleGroupId = rule.ruleGroupId || getNewId();
  rule.workspaceId = rule.workspaceId || getNewId();
  rule.createdAt = rule.createdAt || new Date();
  rule.parameters = rule.parameters || {};
  rule.network = rule.network || 'osmosis-1';
  rule.severity = rule.severity || 'debug';
  rule.triggerMode = rule.triggerMode || 'BLOCK';

  return rule as any;
};

export const getNewId = (): string => {
  return `test-alert-rule-id-` + randomUUID();
};

export const getTestTimestamp = (
  hours?: number | null,
  minutes?: number | null,
  seconds?: number | null
) => {
  let t = dayjs();

  if (hours) {
    t = t.add(hours, 'hours');
  }
  if (minutes) {
    t = t.add(minutes, 'minutes');
  }
  if (seconds) {
    t = t.add(seconds, 'seconds');
  }
  return t.toISOString();
};

export async function runTickIterations(
  mockRule: any,
  testRangeSDK: any,
  ITERATION_COUNT = 1
) {
  for (let i = 1; i <= ITERATION_COUNT; i++) {
    const iteration = await testRangeSDK.assertRuleWithTick(
      new Date().toISOString(),
      mockRule
    );
    console.log(`ITERATION ${i}`, iteration.length);
    for (const e of iteration) {
      console.dir(e, { depth: null });
    }
  }
}

const decoderHostMap: Record<
  string,
  {
    host?: string;
    token?: string;
    urlFn: (host: string, height: string) => string;
  }
> = {
  solana: {
    host: process.env.SOL_DECODER_HOST,
    token: process.env.SOL_DECODER_TOKEN,
    urlFn: (host, height) => `${host}/api/block/solana/slot/${height}`,
  },
  eth: {
    host: process.env.ETH_BLOCK_API_HOST,
    token: process.env.EVM_BLOCK_API_TOKEN,
    urlFn: (host, height) => `${host}/api/blocks/${height}`,
  },
  arb1: {
    host: process.env.ARB1_BLOCK_API_HOST,
    token: process.env.EVM_BLOCK_API_TOKEN,
    urlFn: (host, height) => `${host}/api/blocks/${height}`,
  },
  bsc: {
    host: process.env.BSC_BLOCK_API_HOST,
    token: process.env.EVM_BLOCK_API_TOKEN,
    urlFn: (host, height) => `${host}/api/blocks/${height}`,
  },
  base: {
    host: process.env.BASE_BLOCK_API_HOST,
    token: process.env.EVM_BLOCK_API_TOKEN,
    urlFn: (host, height) => `${host}/api/blocks/${height}`,
  },
};

async function downloadBlockFromDecoder(network: string, height: string) {
  const decoder = decoderHostMap[network];

  let url: string;
  let token: string | undefined;

  if (decoder?.host) {
    url = decoder.urlFn(decoder.host, height);
    token = decoder.token ?? process.env.BLOCK_API_TOKEN;
  } else {
    url = `${process.env.BLOCK_API}/block?network=${network}&height=${height}`;
    token = process.env.BLOCK_API_TOKEN;
  }

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    timeout: 30_000,
  });

  // Solana decoder wraps as { slot, block } — store only the block
  const block = response.data?.block ?? response.data;

  const filePath = `src/test_data/${network}/${height}.json`;
  writeFileSync(filePath, JSON.stringify(block));

  return block;
}

/**
 * YAML-style logger for test output. Recursively prints objects with indentation.
 * Uses process.stdout.write to bypass Jest's console interceptor.
 */
export function logYaml(obj: unknown, indent = 0, pick?: string[]): void {
  const pad = ' '.repeat(indent);
  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (typeof item === 'object' && item !== null) {
        const keys = Object.keys(item);
        const filteredKeys = pick ? keys.filter((k) => pick.includes(k)) : keys;
        if (filteredKeys.length > 0) {
          process.stdout.write(
            `${pad}- ${filteredKeys[0]}: ${formatValue(item[filteredKeys[0]])}\n`
          );
          for (const key of filteredKeys.slice(1)) {
            process.stdout.write(`${pad}  ${key}: ${formatValue(item[key])}\n`);
            if (typeof item[key] === 'object' && item[key] !== null) {
              logYaml(item[key], indent + 4, pick);
            }
          }
        }
      } else {
        process.stdout.write(`${pad}- ${item}\n`);
      }
    }
  } else if (typeof obj === 'object' && obj !== null) {
    const entries = Object.entries(obj);
    for (const [key, value] of entries) {
      if (pick && !pick.includes(key)) continue;
      if (typeof value === 'object' && value !== null) {
        process.stdout.write(`${pad}${key}:\n`);
        logYaml(value, indent + 2, pick);
      } else {
        process.stdout.write(`${pad}${key}: ${value}\n`);
      }
    }
  } else {
    process.stdout.write(`${pad}${obj}\n`);
  }
}

function formatValue(v: unknown): string {
  if (typeof v === 'object' && v !== null) return '';
  return String(v);
}

export async function getCachedBlock(network: string, height: string) {
  try {
    const filePath = path.join('src/test_data', network, `${height}.json`);
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch {
    console.log(`${network} ${height} downloading...`);
    const dir = path.join('src/test_data', network);
    mkdirSync(dir, { recursive: true });
    const block = await downloadBlockFromDecoder(network, height);
    console.log(`${network} ${height} downloaded`);
    return block;
  }
}

/**
 * Lightweight processor test harness. Runs a processor's callback
 * directly without Redis, thread pool, or block stream.
 */
export async function testProcessor<T = any>(opts: {
  processorClass: new () => BlockProcessor | TickProcessor;
  rule: Partial<IAlertRule<T>> & { ruleType: string };
  block?: any;
  timestamp?: string;
}): Promise<ISubEvent[]> {
  const instance = new opts.processorClass();
  const alertRule = createNewAlertRule(opts.rule as any);

  if (instance.taskType === 'BLOCK') {
    return (instance as BlockProcessor).callback({
      block: opts.block,
      rule: alertRule,
    });
  }

  if (instance.taskType === 'TICK') {
    const ts = opts.timestamp || new Date().toISOString();
    return (instance as TickProcessor).callback({
      timestamp: ts,
      rule: alertRule,
    });
  }

  throw new Error(`Unknown taskType: ${(instance as any).taskType}`);
}
