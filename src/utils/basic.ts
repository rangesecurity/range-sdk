export const RANGE_URL = 'https://app.range.org';

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function camelCaseToTitleCase(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export function safeJsonParse(str: string) {
  try {
    return JSON.parse(str);
  } catch (error) {
    return null;
  }
}

import { INetwork } from '../types/INetwork';

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function filterCommonAddresses(
  msgAddresses: string[],
  addresses: string[]
) {
  msgAddresses = [...new Set(msgAddresses)];
  addresses = [...new Set(addresses)];

  const addressSet = new Set(addresses); // Convert the second array to a Set for efficient lookup
  return msgAddresses.filter((a) => addressSet.has(a));
}

export function formatAddresses(addresses: string[]) {
  if (!addresses?.length) return '';

  if (addresses.length <= 3) {
    return addresses.join(', ');
  }

  return (
    addresses.slice(0, 3).join(', ') + ` and ${addresses.length - 3} others`
  );
}

export function findValuesFromAttributes(attributes: any, keys: any) {
  if (!attributes) return null;

  const results: any = {};

  for (const attr of attributes) {
    if (keys.includes(attr.key)) {
      results[attr.key] = attr.value;
    }
  }

  return results;
}

export function getObjectFromAttributes(attributes: any) {
  if (!attributes) return null;

  const results: any = {};

  for (const attr of attributes) {
    results[attr.key] = attr.value;
  }

  return results;
}

export function getSenderFromMessage(msg: any) {
  for (const ev of msg.events) {
    const sender = ev.attributes.find((a: any) => a.key === 'sender')?.value;
    if (sender) return sender;
  }
  return null;
}

export function splitAmountDenom(str: string): {
  amount: number;
  denom: string;
} {
  const match = str.match(/^(\d+)(.+)$/);

  if (!match) {
    throw new Error(`String format is incorrect: ${str}`);
  }

  const [, amount, denom] = match;

  return { amount: Number(amount), denom };
}

export function getWasmPatterns(events: any) {
  const res: { contract: any; sender: any; method: any }[] = [];
  let sender;
  let wasmEvent: any = {};

  for (const ev of events) {
    if (ev.type === 'message') {
      const obj = getObjectFromAttributes(ev.attributes);
      if (obj.sender) {
        sender = obj.sender;
      }
    }
    if (ev.type === 'wasm') {
      const obj = getObjectFromAttributes(ev.attributes);
      wasmEvent.contract = obj._contract_address;
      wasmEvent.method = obj.method || obj.action || 'unknown';
      res.push({ ...wasmEvent, sender });
      wasmEvent = {};
    }
  }

  return res;
}

export function getRunnerNetwork(runnerNetwork: string): INetwork {
  const match = runnerNetwork.match(/-runner-(.+)/);
  if (!match) return runnerNetwork as INetwork;
  return match[1].split('.')[0] as INetwork;
}

export const isTestEnv =
  process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'local';

export function arraySum(arr: any) {
  return arr.reduce((a: any, b: any) => a + b, 0);
}

export function safeJsonStringify(obj: any) {
  try {
    return JSON.stringify(obj, (_, value) => {
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return value;
    });
  } catch (e) {
    return null;
  }
}

export function removeBigintFromObject(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => removeBigintFromObject(item));
  }

  const newObj = { ...obj };
  for (const key in newObj) {
    if (typeof newObj[key] === 'bigint') {
      newObj[key] = newObj[key].toString();
    } else if (typeof newObj[key] === 'object') {
      newObj[key] = removeBigintFromObject(newObj[key]);
    }
  }
  return newObj;
}
