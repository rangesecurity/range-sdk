import * as crypto from 'crypto';
import { dayjs } from './dayjs';
import { isTestEnv } from './basic';

export function skipTick({
  timestamp,
  ticker = 30,
  threshold = 60,
  salt,
}: {
  ticker: number;
  timestamp: string;
  threshold?: number;
  salt: string;
}) {
  if (isTestEnv) return false;

  const timestampAge = dayjs().diff(dayjs(timestamp), 'minute');

  if (timestampAge >= threshold) {
    return true;
  }

  let offset = 0;

  if (salt) {
    // a constant offset for each alert rule based on hash of created_at
    offset = sha256HashToSmallNumber(sha256(salt)) % ticker;
  }

  const unixMinute = Math.floor(dayjs(timestamp).unix() / 60);
  const remainder = (unixMinute + offset) % ticker;
  return remainder !== 0;
}

function sha256(input: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(input);
  return hash.digest('hex');
}

// Function to convert SHA-256 hash to a number smaller than 10^9
function sha256HashToSmallNumber(hash: string): number {
  // Take the first 16 characters of the hash and parse it as a hexadecimal number
  const hex = hash.slice(0, 16);
  // Convert hexadecimal to decimal and take modulo 10^9
  const number = BigInt('0x' + hex) % BigInt(10 ** 9);
  // Convert BigInt to regular number
  return Number(number);
}
