import { dayjs } from './dayjs';
import type { DurationUnitType } from 'dayjs/plugin/duration';
import { findAssetInfo, formatAmountToUsd } from '../services/AssetManager';

const formatNumber = (raw_num: number) => {
  if (raw_num === 0) {
    return '0';
  }

  const isNegetive = raw_num < 0;

  const num = Math.abs(raw_num);

  let res: string;

  if (num < 10 ** -6) {
    res = '~0';
  } else if (Math.abs(num) < 1_000) {
    res = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: num >= 1 ? 2 : 6,
    }).format(num);
  } else if (Math.abs(num) < 1_000_000) {
    res = parseFloat((num / 1000).toFixed(1)) + 'K'; // convert to K for number from > 1000 < 1 million
  } else if (Math.abs(num) < 1_000_000_000) {
    res = parseFloat((num / 1_000_000).toFixed(1)) + 'M'; // convert to M for number from > 1 million
  } else if (Math.abs(num) < 1_000_000_000_000) {
    res = parseFloat((num / 1_000_000_000).toFixed(1)) + 'B'; // convert to M for number from > 1 billion
  } else if (Math.abs(num) < 1_000_000_000_000_000) {
    res = parseFloat((num / 1_000_000_000_000).toFixed(1)) + 'T'; // convert to M for number from > 1 trillion
  } else {
    res = Number(num).toExponential(1);
  }

  if (isNegetive) {
    res = '-' + res;
  }

  return res;
};

export const secToHumanReadable = (sec: number, t: DurationUnitType) => {
  const timeUnit = t;
  const d = dayjs.duration(sec, timeUnit);

  const years = d.years();
  const months = d.months();
  const days = d.days();
  const hours = d.hours();
  const minutes = d.minutes();
  const seconds = d.seconds();

  let result = '';

  if (years) result += `${years} year${years > 1 ? 's' : ''} `;
  if (months) result += `${months} month${months > 1 ? 's' : ''} `;
  if (days) result += `${days} day${days > 1 ? 's' : ''} `;
  if (hours) result += `${hours} hour${hours > 1 ? 's' : ''} `;
  if (minutes) result += `${minutes} minute${minutes > 1 ? 's' : ''} `;
  if (seconds) result += `${seconds} second${seconds > 1 ? 's' : ''}`;

  return result.trim();
};

export function fmtMsgType(msgType: string) {
  const splitRes = msgType.split('.');
  return `${splitRes[splitRes.length - 1]}(${splitRes[0]})`;
}

function fmtObjectAmount(obj: any) {
  if (
    typeof obj === 'object' &&
    obj &&
    'amount' in obj &&
    'denom' in obj &&
    Object.keys(obj).length === 2
  ) {
    return formatAmountToUsd(obj).tokenUsdString;
  }

  return null;
}

export function fmtObject(obj: any, size = 100) {
  let str = '';

  const amtFmt = fmtObjectAmount(obj);
  if (amtFmt) return amtFmt;

  for (const [key, value] of Object.entries(obj)) {
    let value_f = value;

    if (value && typeof value === 'object') {
      const amtFmt_1 = fmtObjectAmount(value);
      value_f = amtFmt_1 || '(' + fmtObject(value, size) + ')';
    }

    if (value && Array.isArray(value)) {
      value_f = '[' + value.map((v) => fmtObject(v, size)).join(', ') + ']';
    }

    if (typeof value === 'string') {
      const info = findAssetInfo(value);
      if (info) {
        value_f = value_f + '(' + info.symbol + ')';
      }
    }

    str += `${key}: ${value_f}, `;
  }

  str = str.slice(0, -2);

  if (str.length > size) {
    str = str.slice(0, size) + '...';
  }

  return str;
}

export function fmtSec(sec: number) {
  return secToHumanReadable(sec, 'second');
}

export function fmtMin(sec: number) {
  return secToHumanReadable(sec, 'minute');
}

/**
 * A universal formatter for numbers and objects
 */
export function format(input: any, size?: number): string {
  if (typeof input === 'number') {
    return formatNumber(input);
  }

  if (typeof input === 'object' && input !== null) {
    return fmtObject(input, size);
  }

  return String(input);
}
