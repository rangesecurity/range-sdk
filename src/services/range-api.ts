import { env } from '../env';
import { redisGet, redisSet } from './alerting-redis';
import { axios } from './axios';

interface IAddressInfo {
  address: string;
  name_tag: string;
}

const CACHE_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days
const RISK_SCORE_CACHE_TTL_SECONDS = 24 * 60 * 60; // 1 day

export async function fetchAddressInfoBatch({
  addresses,
  network,
}: {
  addresses: string[];
  network: string;
}): Promise<Record<string, IAddressInfo>> {
  const nameMap: Record<string, IAddressInfo> = {};
  const unknownAddresses: string[] = [];

  // Check cache for each address
  for (const address of addresses) {
    const cacheKey = `address-global-info-${address}`;
    const cachedInfo = await redisGet(cacheKey);

    if (cachedInfo !== undefined && cachedInfo !== null) {
      // Cache hit with a valid value
      nameMap[address] = JSON.parse(cachedInfo);
    } else if (cachedInfo === undefined) {
      // Cache miss
      unknownAddresses.push(address);
    }
  }

  // If all addresses were cached, return early
  if (unknownAddresses.length === 0) {
    return nameMap;
  }

  // Fetch unknown addresses from API
  const params = new URLSearchParams();
  params.set('networks', network);

  unknownAddresses.forEach((a) => params.append('addresses', a));
  params.set('includeNft', 'false');
  params.set('validateSearch', 'true');

  const url = `${env.RANGE_API_HOST}/v1/address/labels/search?${params.toString()}`;
  const res = await axios.get<IAddressInfo[]>(url, {
    headers: {
      accept: 'application/json',
      'X-API-KEY': env.RANGE_API_KEY,
    },
    timeout: 10000,
  });

  // Create a set of addresses that were found in the API response
  const foundAddresses = new Set<string>();

  // Cache and map the results
  for (const e of res.data) {
    nameMap[e.address] = e;
    foundAddresses.add(e.address);

    // Cache the found value with 7 days TTL
    const cacheKey = `address-global-info-${e.address}`;
    await redisSet(cacheKey, JSON.stringify(e), CACHE_TTL_SECONDS);
  }

  // Cache null values for addresses that weren't found
  for (const address of unknownAddresses) {
    if (!foundAddresses.has(address)) {
      const cacheKey = `address-global-info-${address}`;
      await redisSet(cacheKey, 'null', CACHE_TTL_SECONDS);
    }
  }

  return nameMap;
}

export async function fetchAddressRiskScore(address: string, network: string) {
  const cacheKey = `risk-score-${address}-${network}`;
  const cachedRiskScore = await redisGet(cacheKey);

  if (cachedRiskScore !== undefined && cachedRiskScore !== null) {
    return JSON.parse(cachedRiskScore);
  }

  const url = `${env.RANGE_API_HOST}/v1/risk/address?address=${address}&network=${network}`;

  const res = await axios.get(url, {
    headers: {
      accept: 'application/json',
      'X-API-KEY': env.RANGE_API_KEY,
    },
    timeout: 10000,
  });

  const riskScoreData = res.data;
  await redisSet(
    cacheKey,
    JSON.stringify(riskScoreData),
    RISK_SCORE_CACHE_TTL_SECONDS
  );

  return riskScoreData;
}

export interface ISanctionsResult {
  is_ofac_sanctioned: boolean;
  is_token_blacklisted: boolean;
  ofac_info?: { name_tag: string; category: string };
  attribution?: { name: string; category: string; malicious: boolean };
}

export async function fetchSanctionsCheck(
  address: string,
  network: string
): Promise<ISanctionsResult | null> {
  try {
    const url = `${env.RANGE_API_HOST}/v1/risk/sanctions/${address}?network=${network}`;

    const res = await axios.get<ISanctionsResult>(url, {
      headers: {
        accept: 'application/json',
        'X-API-KEY': env.RANGE_API_KEY,
      },
      timeout: 10000,
    });

    return res.data;
  } catch {
    return null;
  }
}

export async function fetchLabelledAddressTransaction(
  address: string,
  network: string,
  startTime?: string
) {
  const params = new URLSearchParams({
    address,
    network,
    limit: '50',
    offset: '0',
    status: 'success',
  });

  if (startTime) {
    params.append('startTime', startTime);
  }

  const url = `${env.RANGE_API_HOST}/v1/address/transactions?${params.toString()}`;

  const res = await axios.get(url, {
    headers: {
      accept: 'application/json',
      'X-API-KEY': env.RANGE_API_KEY,
    },
    timeout: 10000,
  });

  return res.data.transactions;
}
