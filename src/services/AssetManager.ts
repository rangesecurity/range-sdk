import * as crypto from 'crypto';
import axios from 'axios';
import { dayjs } from '../utils/dayjs';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

// In-memory asset stats (replaces Redis-backed consumer-metrics)
const assetStats = {
  findAssetInfoCalls: 0,
  unknownDenoms: new Map<string, { count: number; bridges: Set<string> }>(),
};

export function getAndResetAssetStats() {
  const snapshot = {
    findAssetInfoCalls: assetStats.findAssetInfoCalls,
    unknownDenoms: new Map(assetStats.unknownDenoms),
  };
  assetStats.findAssetInfoCalls = 0;
  assetStats.unknownDenoms.clear();
  return snapshot;
}

const COINGECKO_START_DATE = '2023-11-13';

function isTestEnvironment(): boolean {
  return process.env.NODE_ENV === 'test';
}

function findPdDenomSuffix(denom: string) {
  const generalKeyIndex = denom.lastIndexOf('generalkey/');
  if (generalKeyIndex !== -1) {
    return denom.substring(generalKeyIndex);
  }

  const generalIndexIndex = denom.lastIndexOf('generalindex/');
  if (generalIndexIndex !== -1) {
    return denom.substring(generalIndexIndex);
  }

  return '';
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: {
    maxRetries?: number;
    delayInMs?: number;
  }
): Promise<T> {
  const maxRetries = options?.maxRetries || 1;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      retryCount++;

      if (retryCount === maxRetries) {
        throw error;
      }

      const delay =
        Math.pow(2, retryCount - 1) * (options?.delayInMs || 10_000);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error('Max retries reached');
}

export function sha256(input: unknown): string {
  const str = typeof input === 'string' ? input : JSON.stringify(input);
  const hash = crypto.createHash('sha256');
  hash.update(str);
  return hash.digest('hex');
}

function isSolanaAddress(address: string): boolean {
  const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return solanaAddressRegex.test(address);
}

function stripStellarVersion(denom: string): string | null {
  const parts = denom.split('-');
  if (parts.length < 3) return null;
  if (/^G[A-Z2-7]{55}$/i.test(parts[1])) {
    return `${parts[0]}-${parts[1]}`;
  }
  return null;
}

const ASSETS_SERVICE_V2 = 'https://assets.range.org/v2';

export function simplifyDenom(raw_denom: string) {
  if (!raw_denom) return '';
  return raw_denom.replace(/^(transfer\/[^/]+\/)+/g, '');
}

export function getReverseDenom(raw_denom: string) {
  if (!raw_denom) return '';

  const pattern = /^transfer\/.+\//;
  const match = raw_denom.match(pattern);
  if (!match) return raw_denom;

  return raw_denom.slice(match[0].length);
}

function checkIlliquidAtom(str: string) {
  const pattern = /.*cosmosvaloper.*\/\d+$/;
  return pattern.test(str);
}

const fmtNum = (raw_num: number) => {
  if (!isFinite(raw_num)) return '0';
  if (raw_num === 0) return '0';

  const isNegative = raw_num < 0;

  const num = Math.abs(raw_num);

  let res: string;

  if (num < 10 ** -6) {
    res = '~0';
  } else if (Math.abs(num) < 1_000) {
    res = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: num >= 1 ? 2 : 6,
    }).format(num);
  } else if (Math.abs(num) < 1_000_000) {
    res = parseFloat((num / 1000).toFixed(1)) + 'K';
  } else if (Math.abs(num) < 1_000_000_000) {
    res = parseFloat((num / 1_000_000).toFixed(1)) + 'M';
  } else if (Math.abs(num) < 1_000_000_000_000) {
    res = parseFloat((num / 1_000_000_000).toFixed(1)) + 'B';
  } else if (Math.abs(num) < 1_000_000_000_000_000) {
    res = parseFloat((num / 1_000_000_000_000).toFixed(1)) + 'T';
  } else {
    res = Number(num).toExponential(1);
  }

  if (isNegative) {
    res = '-' + res;
  }

  return res;
};

Number.prototype.fmt = function () {
  return fmtNum(this);
};

declare global {
  interface Number {
    fmt(): string;
  }
}

interface IAssetInfo {
  name: string;
  symbol: string;
  denoms: { denom: string; exponent: number }[];
  cg?: string;
  usd: number;
  chain?: string;
}

interface ISolanaAssetInfo {
  id: string;
  symbol: string | null;
  name: string | null;
  decimals: number;
  usd: number;
}

interface IStellarAssetInfo {
  name: string;
  symbol: string;
  network: string;
  denoms: { denom: string; exponent: number }[];
  cg?: string;
  usd: number;
  meta?: Record<string, any>;
}

interface INetworkInfo {
  id: string;
  bech32_prefix: string;
  pretty_name: string;
}

interface NetworkMapping {
  bridge: string;
  from: string;
  to: string;
}

class AssetManager {
  // v2
  cosmos_evm_assets: IAssetInfo[] = [];
  solana_assets: ISolanaAssetInfo[] = [];
  stellar_assets: IStellarAssetInfo[] = [];
  network_mappings: NetworkMapping[] = [];
  word_to_network: Record<string, string> = {};
  networks: INetworkInfo[] = [];

  assetMap = new Map<string, number>();
  solanaAssetMap = new Map<string, number>();
  stellarAssetMap = new Map<string, number>();
  symbolMap = new Map<string, string>();

  lastInitialized;
  lastPriceDate: string | null = null;

  // Unknown token reporting — dedup within process lifetime
  private _reportedDenoms: Set<string> = new Set();

  private reportUnknownToken(
    denom: string,
    network?: string,
    protocol?: string
  ): void {
    const key = `${denom}:${network || ''}:${protocol || ''}`;
    if (this._reportedDenoms.has(key)) return;
    this._reportedDenoms.add(key);

    axios
      .post(
        `${ASSETS_SERVICE_V2}/report-missing-token`,
        {
          token: denom,
          network: network || 'unknown',
          protocol: protocol || 'unknown',
          reported_by: 'interchain-consumer',
        },
        { timeout: 5000 }
      )
      .catch(() => {});
  }

  constructor() {
    if (isTestEnvironment()) {
      if (this.loadFromTestCache()) {
        this.lastInitialized = dayjs();
      }
    } else {
      setInterval(async () => {
        await this.initialize();
      }, 5 * 60_000);
    }
  }

  async initialize() {
    const now = dayjs();

    if (this.lastInitialized && now.diff(this.lastInitialized, 'minutes') < 5) {
      return;
    }

    if (isTestEnvironment()) {
      if (!this.lastInitialized) {
        await this.fetchAndPopulate();
        this.writeTestCache();
      }
      this.lastInitialized = now;
      return;
    }

    await this.fetchAndPopulate();
    this.lastInitialized = now;
  }

  private async fetchAndPopulate() {
    const fetchStart = Date.now();
    const fetches: Promise<boolean>[] = [];

    if (process.env.ASSET_SERVICE_COSMOS_ENABLED === 'true')
      fetches.push(this.fetchCosmosAssets());
    if (process.env.ASSET_SERVICE_NETWORKS_ENABLED === 'true')
      fetches.push(this.fetchNetworks());
    if (process.env.ASSET_SERVICE_NETWORK_MAPPINGS_ENABLED === 'true')
      fetches.push(this.fetchNetworkMappings());
    if (process.env.ASSET_SERVICE_WORD_TO_NETWORK_ENABLED === 'true')
      fetches.push(this.fetchWordToNetwork());
    if (process.env.ASSET_SERVICE_SOLANA_ENABLED === 'true')
      fetches.push(this.fetchSolanaAssets());
    if (process.env.ASSET_SERVICE_STELLAR_ENABLED === 'true')
      fetches.push(this.fetchStellarAssets());

    if (fetches.length === 0) {
      console.log(
        'AssetManager: No asset fetches enabled (set ASSET_SERVICE_*_ENABLED=true)'
      );
      return;
    }

    const results = await Promise.allSettled(fetches);
    const succeeded = results.filter(
      (r) => r.status === 'fulfilled' && r.value === true
    ).length;
    console.log(
      `AssetManager: API fetch completed in ${Date.now() - fetchStart}ms (${succeeded}/${fetches.length} succeeded)`
    );
  }

  private static get testCacheDir(): string {
    const path = require('path');
    return path.join(process.cwd(), '.cache', 'asset-service');
  }

  private static readonly CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

  private loadFromTestCache(): boolean {
    const fs = require('fs');
    const path = require('path');
    const cacheDir = AssetManager.testCacheDir;

    try {
      const manifestPath = path.join(cacheDir, 'manifest.json');
      if (!fs.existsSync(manifestPath)) return false;

      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      const age = Date.now() - new Date(manifest.timestamp).getTime();
      if (age > AssetManager.CACHE_MAX_AGE_MS) return false;

      this.cosmos_evm_assets = JSON.parse(
        fs.readFileSync(path.join(cacheDir, 'assets.json'), 'utf8')
      );
      for (let i = 0; i < this.cosmos_evm_assets.length; i++) {
        for (const d of this.cosmos_evm_assets[i].denoms || []) {
          this.assetMap.set(d.denom, i);
        }
      }
      this.symbolMap = new Map(
        this.cosmos_evm_assets.map((a) => [
          String(a.symbol).toLowerCase(),
          a.symbol,
        ])
      );

      this.networks = JSON.parse(
        fs.readFileSync(path.join(cacheDir, 'networks.json'), 'utf8')
      );
      this.network_mappings = JSON.parse(
        fs.readFileSync(path.join(cacheDir, 'network_mappings.json'), 'utf8')
      );
      this.word_to_network = JSON.parse(
        fs.readFileSync(path.join(cacheDir, 'word_to_network.json'), 'utf8')
      );

      this.solana_assets = JSON.parse(
        fs.readFileSync(path.join(cacheDir, 'solana_assets.json'), 'utf8')
      );
      for (let i = 0; i < this.solana_assets.length; i++) {
        this.solanaAssetMap.set(this.solana_assets[i].id, i);
        this.solanaAssetMap.set(this.solana_assets[i].id.toLowerCase(), i);
      }

      this.stellar_assets = JSON.parse(
        fs.readFileSync(path.join(cacheDir, 'stellar_assets.json'), 'utf8')
      );
      for (let i = 0; i < this.stellar_assets.length; i++) {
        for (const d of this.stellar_assets[i].denoms || []) {
          this.stellarAssetMap.set(d.denom, i);
          this.stellarAssetMap.set(d.denom.toLowerCase(), i);
        }
      }

      console.log(
        `AssetManager: Loaded from test cache (age: ${Math.round(age / 60000)}min)`
      );
      return true;
    } catch {
      return false;
    }
  }

  private writeTestCache(): void {
    const fs = require('fs');
    const path = require('path');
    const cacheDir = AssetManager.testCacheDir;

    try {
      fs.mkdirSync(cacheDir, { recursive: true });

      const files: [string, any][] = [
        ['assets.json', this.cosmos_evm_assets],
        ['networks.json', this.networks],
        ['network_mappings.json', this.network_mappings],
        ['word_to_network.json', this.word_to_network],
        ['solana_assets.json', this.solana_assets],
        ['stellar_assets.json', this.stellar_assets],
      ];

      for (const [filename, data] of files) {
        const json = JSON.stringify(data);
        const tmpPath = path.join(cacheDir, `${filename}.tmp`);
        const finalPath = path.join(cacheDir, filename);
        fs.writeFileSync(tmpPath, json);
        fs.renameSync(tmpPath, finalPath);
      }

      const manifestPath = path.join(cacheDir, 'manifest.json');
      fs.writeFileSync(
        manifestPath,
        JSON.stringify({ timestamp: new Date().toISOString() })
      );

      console.log('AssetManager: Wrote test cache');
    } catch (err: any) {
      console.error(`AssetManager: Failed to write test cache: ${err.message}`);
    }
  }

  private async fetchNetworks(): Promise<boolean> {
    try {
      const res = await withRetry(() =>
        axios.get(`${ASSETS_SERVICE_V2}/networks`)
      );
      this.networks = res.data;
      console.log(`AssetManager: downloaded ${this.networks.length} networks`);
      return true;
    } catch (error: any) {
      console.error(
        'AssetManager: Failed to fetch networks (using cached data):',
        error?.message
      );
      return false;
    }
  }

  private async fetchCosmosAssets(): Promise<boolean> {
    try {
      const res = await withRetry(() =>
        axios.get(`${ASSETS_SERVICE_V2}/cosmos-evm-assets`)
      );
      this.cosmos_evm_assets = res.data;
      for (let i = 0; i < this.cosmos_evm_assets.length; i++) {
        for (const d of this.cosmos_evm_assets[i].denoms || []) {
          this.assetMap.set(d.denom, i);
        }
      }
      this.symbolMap = new Map(
        this.cosmos_evm_assets.map((a) => [
          String(a.symbol).toLowerCase(),
          a.symbol,
        ])
      );
      console.log(
        `AssetManager: downloaded ${this.cosmos_evm_assets.length} cosmos-evm tokens`
      );
      return true;
    } catch (error: any) {
      console.error(
        'AssetManager: Failed to fetch cosmos assets (using cached data):',
        error?.message
      );
      return false;
    }
  }

  private async fetchSolanaAssets(): Promise<boolean> {
    try {
      const res = await withRetry(() =>
        axios.get(`${ASSETS_SERVICE_V2}/solana/popular`)
      );
      console.log(`AssetManager: downloaded ${res.data.length} solana tokens`);
      this.solana_assets = res.data;
      for (let i = 0; i < this.solana_assets.length; i++) {
        this.solanaAssetMap.set(this.solana_assets[i].id, i);
        this.solanaAssetMap.set(this.solana_assets[i].id.toLowerCase(), i);
      }
      return true;
    } catch (error: any) {
      console.error(
        'AssetManager: Failed to fetch solana assets (using cached data):',
        error?.message
      );
      return false;
    }
  }

  private async fetchStellarAssets(): Promise<boolean> {
    try {
      const res = await withRetry(() =>
        axios.get(`${ASSETS_SERVICE_V2}/stellar/verified`)
      );
      console.log(`AssetManager: downloaded ${res.data.length} stellar tokens`);
      this.stellar_assets = res.data;
      this.stellarAssetMap.clear();
      for (let i = 0; i < this.stellar_assets.length; i++) {
        for (const d of this.stellar_assets[i].denoms || []) {
          this.stellarAssetMap.set(d.denom, i);
          this.stellarAssetMap.set(d.denom.toLowerCase(), i);
        }
      }
      return true;
    } catch (error: any) {
      console.error(
        'AssetManager: Failed to fetch stellar assets (using cached data):',
        error?.message
      );
      return false;
    }
  }

  private async fetchNetworkMappings(): Promise<boolean> {
    try {
      const res = await withRetry(() =>
        axios.get(`${ASSETS_SERVICE_V2}/network-mappings`)
      );
      this.network_mappings = res.data;
      console.log(
        `AssetManager: downloaded ${this.network_mappings.length} network mappings`
      );
      return true;
    } catch (error: any) {
      console.error(
        'AssetManager: Failed to fetch network mappings (using cached data):',
        error?.message
      );
      return false;
    }
  }

  private async fetchWordToNetwork(): Promise<boolean> {
    try {
      const res = await withRetry(() =>
        axios.get(
          `${ASSETS_SERVICE_V2}/network-mappings/word-to-network-full-list`
        )
      );
      this.word_to_network = res.data;
      console.log(
        `AssetManager: downloaded ${Object.keys(this.word_to_network).length} word-to-network mappings`
      );
      return true;
    } catch (error: any) {
      console.error(
        'AssetManager: Failed to fetch word-to-network mappings (using cached data):',
        error?.message
      );
      return false;
    }
  }

  findAssetInfo(
    raw_denom: string,
    chains?: string[],
    options?: {
      skipScaling?: boolean;
      sourceChannel?: string;
      destinationChannel?: string;
      protocol?: string;
    }
  ): (IAssetInfo & { preferredExponent: number }) | null {
    // return null for falsy denoms
    if (!raw_denom) return null;

    assetStats.findAssetInfoCalls++;
    const originalDenom = String(raw_denom);
    raw_denom = originalDenom.toLowerCase();

    // solves native token issues for evm chains
    if (raw_denom === ZERO_ADDRESS) {
      const asset = this.findNativeEvmAsset(chains?.[0] || '');
      if (asset !== null) {
        asset.usd = findAssetInfo(asset.symbol)?.usd || 0;
      }
      return asset;
    }

    // pd general index case
    if (
      raw_denom.includes('generalindex') ||
      raw_denom.includes('generalkey')
    ) {
      const generalDenom = findPdDenomSuffix(raw_denom);
      const asset = this.cosmos_evm_assets.find((a) =>
        a.denoms.some((d) => {
          return d.denom.endsWith(generalDenom);
        })
      );
      if (asset) {
        return {
          ...asset,
          preferredExponent:
            asset.denoms.find((d) => {
              return d.denom.endsWith(generalDenom);
            })?.exponent || 0,
        };
      }
    }

    // adds 0x before sui denoms
    if (raw_denom.includes('::') && !raw_denom.startsWith('0x')) {
      raw_denom = '0x' + raw_denom;
    }

    const simpleDenom = simplifyDenom(raw_denom);

    if (simpleDenom === 'uluna') {
      if (chains?.includes('columbus-5')) {
        const asset = this.cosmos_evm_assets.find((a) => a.symbol === 'LUNC');
        if (asset) {
          return {
            ...asset,
            preferredExponent: 6,
          };
        }
        return null;
      }
      if (chains?.includes('phoenix-1')) {
        const asset = this.cosmos_evm_assets.find((a) => a.symbol === 'LUNA');
        if (asset) {
          return {
            ...asset,
            preferredExponent: 6,
          };
        }
        return null;
      }
    }

    // Direct check for existing IBC denoms
    if (raw_denom.toLowerCase().startsWith('ibc/')) {
      const index = this.assetMap.get(raw_denom.toLowerCase());
      if (index !== undefined) {
        return {
          ...this.cosmos_evm_assets[index],
          preferredExponent:
            this.cosmos_evm_assets[index].denoms.find(
              (d) => d.denom === raw_denom.toLowerCase()
            )?.exponent || 0,
        };
      }
    }

    const denomVariants = [
      {
        denom: simpleDenom,
      },
      {
        denom: raw_denom,
      },
    ];
    // Handle IBC channel routing in order: source -> reverse -> simple
    if (options?.sourceChannel && options?.destinationChannel) {
      denomVariants.push(
        ...[
          {
            denom: `ibc/${sha256(`transfer/${options.sourceChannel}/${raw_denom}`)}`,
          },
          {
            // ! This is wrong, but Axelar USDT is following pattern, research later
            denom: `ibc/${sha256(`transfer/${options.destinationChannel}/${raw_denom}`)}`,
          },
          {
            denom: `ibc/${sha256(raw_denom)}`,
          },
          {
            denom: `ibc/${sha256(getReverseDenom(raw_denom))}`,
          },
        ]
      );
    }

    for (const { denom } of denomVariants) {
      const index = this.assetMap.get(denom.toLowerCase());
      if (index !== undefined) {
        return {
          ...this.cosmos_evm_assets[index],
          preferredExponent:
            this.cosmos_evm_assets[index].denoms.find(
              (d) => d.denom === denom.toLowerCase()
            )?.exponent || 0,
        };
      }
    }

    // handle if denom is a potential solana mint (after assetMap lookup so Tron/Stellar addresses aren't misrouted)
    if (isSolanaAddress(originalDenom) || isSolanaAddress(raw_denom)) {
      const assetIndex =
        this.solanaAssetMap.get(originalDenom) ??
        this.solanaAssetMap.get(raw_denom);
      if (assetIndex !== undefined) {
        const asset = this.solana_assets[assetIndex];
        return {
          ...asset,
          name: asset.name || '',
          symbol: asset.symbol || '',
          denoms: [{ denom: asset.id, exponent: asset.decimals || 0 }],
          preferredExponent: asset.decimals || 0,
        };
      }
    }

    // Stellar asset lookup — check both original and lowered case
    const stellarIndex =
      this.stellarAssetMap.get(originalDenom) ??
      this.stellarAssetMap.get(raw_denom);
    if (stellarIndex !== undefined) {
      const asset = this.stellar_assets[stellarIndex];
      const matchingDenom = asset.denoms.find(
        (d) => d.denom === originalDenom || d.denom.toLowerCase() === raw_denom
      );
      return {
        name: asset.name,
        symbol: asset.symbol,
        denoms: asset.denoms,
        cg: asset.cg,
        usd: asset.usd,
        preferredExponent: matchingDenom?.exponent || 0,
      };
    }

    // Stellar version-stripping fallback: CODE-ISSUER-VERSION -> CODE-ISSUER
    const strippedDenom = stripStellarVersion(originalDenom);
    if (strippedDenom) {
      const strippedIndex =
        this.stellarAssetMap.get(strippedDenom) ??
        this.stellarAssetMap.get(strippedDenom.toLowerCase());
      if (strippedIndex !== undefined) {
        const asset = this.stellar_assets[strippedIndex];
        const matchingDenom = asset.denoms.find(
          (d) =>
            d.denom === strippedDenom ||
            d.denom.toLowerCase() === strippedDenom.toLowerCase()
        );
        return {
          name: asset.name,
          symbol: asset.symbol,
          denoms: asset.denoms,
          cg: asset.cg,
          usd: asset.usd,
          preferredExponent: matchingDenom?.exponent || 0,
        };
      }
    }

    // Handle illiquid atom
    if (checkIlliquidAtom(raw_denom)) {
      const atom = findAssetInfo('atom');
      return {
        name: 'IATOM',
        symbol: 'IATOM',
        denoms: [{ denom: 'iatom', exponent: 6 }],
        usd: atom?.usd || 0,
        preferredExponent: 6,
      };
    }

    // Symbol-based lookup as fallback
    for (let i = 0; i < this.cosmos_evm_assets.length; i++) {
      const asset = this.cosmos_evm_assets[i];
      if (asset.symbol.toLowerCase() === simpleDenom.toLowerCase()) {
        return {
          ...asset,
          preferredExponent: 0,
        };
      }
    }

    const existing = assetStats.unknownDenoms.get(raw_denom);
    if (existing) {
      existing.count++;
      if (options?.protocol) existing.bridges.add(options.protocol);
    } else {
      const bridges = new Set<string>();
      if (options?.protocol) bridges.add(options.protocol);
      assetStats.unknownDenoms.set(raw_denom, { count: 1, bridges });
    }
    this.reportUnknownToken(raw_denom, chains?.[0], options?.protocol);
    return null;
  }

  formatAmount(am: {
    amount: number | string | null | undefined;
    denom?: string;
    token?: string;
    mint?: string;
    skipScaling?: boolean;
    options?: any;
    chains?: string[];
  }) {
    const denom = am.denom || am.token || am.mint || '';
    am.amount = Number(am.amount);
    const assetInfo = this.findAssetInfo(denom, am.chains, am.options);

    if (!assetInfo) {
      // Solana fallback — formatSolanaAmount has its own lookup
      if (isSolanaAddress(denom)) {
        return this.formatSolanaAmount({
          amount: am.amount,
          mint: denom,
          skipScaling: am.skipScaling,
        });
      }
      const symbol = simplifyDenom(denom);
      const tokenUsdString = `${am.amount.fmt()} ${symbol}`;
      return {
        tokenAmount: am.amount,
        symbol,
        tokenUsdString,
        usd: 0,
      };
    }

    let tokenAmount = am.amount;
    const exponent = assetInfo.preferredExponent || 0;

    if (!am.skipScaling) {
      tokenAmount = am.amount / 10 ** exponent;
    }

    const symbol = assetInfo.symbol;
    const usd = tokenAmount * (assetInfo.usd || 0);
    let tokenUsdString = `${tokenAmount.fmt()} ${symbol}`;
    if (usd) tokenUsdString += ` ($${usd.fmt()})`;

    return { tokenAmount, symbol, tokenUsdString, usd };
  }

  findSolanaAssetInfo(mint: string) {
    const p = this.solana_assets.find((e) => e.id === mint);
    return p || null;
  }

  findStellarAssetInfo(denom: string) {
    const index =
      this.stellarAssetMap.get(denom) ??
      this.stellarAssetMap.get(denom.toLowerCase());
    if (index !== undefined) {
      return this.stellar_assets[index];
    }
    return null;
  }

  formatSolanaAmount({
    amount,
    mint,
    skipScaling = false,
  }: {
    amount: number | string;
    mint: string;
    skipScaling?: boolean;
  }) {
    amount = Number(amount);
    const info = this.findSolanaAssetInfo(mint);

    if (!info) {
      return {
        tokenAmount: amount,
        symbol: mint,
        usd: 0,
        tokenUsdString: `${amount.fmt()} ${mint}`,
      };
    }

    let tokenAmount = amount;
    if (!skipScaling) {
      tokenAmount /= 10 ** info.decimals;
    }

    const usd = tokenAmount * info.usd;
    const symbol = info.symbol || mint;

    return {
      tokenAmount,
      symbol,
      usd,
      tokenUsdString: `${tokenAmount.fmt()} ${symbol} ($${usd.fmt()})`,
    };
  }

  async setPastCoingeckoPrices(timestamp: string) {
    const date = dayjs(timestamp).format('YYYY-MM-DD');
    if (this.lastPriceDate === date) return;

    const res = await withRetry(() =>
      axios.get(`${ASSETS_SERVICE_V2}/prices/coingecko-historic?date=${date}`)
    );
    const data: any[] = res.data;

    const priceMap = new Map<string, number>();
    for (const entry of data) {
      priceMap.set(entry.id, Number(entry.usd));
    }

    // Merge prices with assets
    this.cosmos_evm_assets.forEach((asset) => {
      if (asset.cg && priceMap.has(asset.cg)) {
        asset.usd = priceMap.get(asset.cg)!;
      }
    });

    this.lastPriceDate = date;
    console.info(
      `AssetManager: fetched ${priceMap.size} coingecko historic prices for ${date}`
    );
  }

  getChainIdFromAddress(addr: string) {
    if (!addr) return '';
    const prefix = addr.split('1')[0];
    const chain = this.networks.find((c) => c.bech32_prefix === prefix);
    return chain?.id || '';
  }

  findNetworkInfo(id: string) {
    if (!id) return null;
    return this.networks.find((c) => c.id === id) || null;
  }

  isRangeNetwork(id: string) {
    return this.networks.some((c) => c.id === id);
  }

  mapNetwork({ bridge, from }: { bridge?: string; from: string }) {
    if (from == null || from === '') return '';
    const fromLower = String(from).toLowerCase();

    if (bridge) {
      const bridgeMapping = this.network_mappings.find(
        (e) => String(e.from).toLowerCase() === fromLower && e.bridge === bridge
      );
      if (bridgeMapping) return bridgeMapping.to;
    }

    const generalMapping = this.network_mappings.find(
      (e) => String(e.from).toLowerCase() === fromLower && !e.bridge
    );
    if (generalMapping) return generalMapping.to;

    const wordMapping = this.word_to_network[fromLower];
    if (wordMapping) return wordMapping;

    return fromLower;
  }

  findNativeEvmAsset(network: string) {
    const ETH_NETWORKS = new Set([
      'eth',
      'base',
      'arb1',
      'oeth',
      'unichain',
      'soneium',
      'linea',
      'hemi',
      'scr',
    ]);

    if (ETH_NETWORKS.has(network)) {
      return {
        symbol: 'ETH',
        denoms: [{ denom: 'ETH', exponent: 18 }],
        name: 'Ethereum',
        usd: 0,
        preferredExponent: 18,
      };
    }

    switch (network) {
      case 'avax':
        return {
          symbol: 'AVAX',
          denoms: [{ denom: 'AVAX', exponent: 18 }],
          name: 'Avalanche',
          usd: 0,
          preferredExponent: 18,
        };
      case 'bnb':
        return {
          symbol: 'BNB',
          denoms: [{ denom: 'BNB', exponent: 18 }],
          name: 'BNB Chain',
          usd: 0,
          preferredExponent: 18,
        };
      case 'pol':
        return {
          symbol: 'POL',
          denoms: [{ denom: 'POL', exponent: 18 }],
          name: 'Polygon',
          usd: 0,
          preferredExponent: 18,
        };
      case 'solana':
        return {
          symbol: 'SOL',
          denoms: [{ denom: 'SOL', exponent: 9 }],
          name: 'Solana',
          usd: 0,
          preferredExponent: 9,
        };
      default:
        return null;
    }
  }

  mapAssetSymbol(symbol: string) {
    return this.symbolMap.get(String(symbol).toLowerCase()) || symbol;
  }

  async warmPastCoingeckoPrices() {
    const start = dayjs(COINGECKO_START_DATE);
    const end = dayjs();
    const totalDays = end.diff(start, 'day') + 1;

    for (
      let d = start;
      d.isBefore(end) || d.isSame(end, 'day');
      d = d.add(1, 'day')
    ) {
      const ts = d.format('YYYY-MM-DDT00:00:00Z');
      await this.setPastCoingeckoPrices(ts);
    }

    console.info(`AssetManager: warmed coingecko prices for ${totalDays} days`);
  }
}

const manager = new AssetManager();

// Setup methods
export const assetManagerInitialization = manager.initialize.bind(manager);
export const setPastCoingeckoPrices =
  manager.setPastCoingeckoPrices.bind(manager);
export const warmPastCoingeckoPrices =
  manager.warmPastCoingeckoPrices.bind(manager);

export const getChainIdFromAddress =
  manager.getChainIdFromAddress.bind(manager);
export const findNetworkInfo = manager.findNetworkInfo.bind(manager);
export const isRangeNetwork = manager.isRangeNetwork.bind(manager);

export const findAssetInfo = manager.findAssetInfo.bind(manager);

export const mapNetwork = manager.mapNetwork.bind(manager);
export const mapAssetSymbol = manager.mapAssetSymbol.bind(manager);

/**
 * Primary amount formatting function for cosmos, evm, solana, etc.
 */
interface FormattedAmount {
  tokenAmount: number;
  symbol: string;
  tokenUsdString: string;
  usd: number;
}

export const formatAmountToUsd: (am: {
  amount: number | string | null | undefined;
  denom?: string;
  token?: string;
  mint?: string;
  skipScaling?: boolean;
  options?: any;
  chains?: string[];
}) => FormattedAmount = manager.formatAmount.bind(manager);

// --- Backwards-compatible exports ---

/** @deprecated Use `assetManagerInitialization` instead. */
export const initAssetService = assetManagerInitialization;

/** @deprecated Use `findAssetInfo(denom)?.symbol || denom` instead. */
export function findAssetSymbol(denom: string): string {
  return findAssetInfo(denom)?.symbol || denom;
}

/** @deprecated Use `formatAmountToUsd` per-item instead. */
export function formatAmountMulti(
  amList: {
    amount: number | string;
    denom?: string;
    token?: string;
    mint?: string;
    skipScaling?: boolean;
    options?: any;
    chains?: string[];
  }[],
  numAssetCount = 2
): { tokenUsdString: string; usd: number; token: FormattedAmount[] } {
  if (!amList || amList.length === 0)
    return { tokenUsdString: '', usd: 0, token: [] };

  const formatted = amList.map((am) => formatAmountToUsd(am));
  formatted.sort((a, b) => Math.abs(b.usd) - Math.abs(a.usd));

  const shown = formatted.slice(0, numAssetCount);
  const remaining = formatted.length - numAssetCount;

  const parts = shown.map((f) => f.tokenUsdString);
  if (remaining > 0) {
    parts.push(`and ${remaining} more`);
  }

  const totalUsd = formatted.reduce((sum, f) => sum + f.usd, 0);

  return {
    tokenUsdString: parts.join(', '),
    usd: totalUsd,
    token: formatted,
  };
}

/** @deprecated No-op. Solana assets are now fetched during initialization. */
export function fetchSolanaAssets(_ids: string[]): void {
  return;
}

/** @deprecated Liquidity pools are no longer tracked. Returns null. */
export function getOsmosisPool(
  _poolId: string | number
): { usd: number } | null {
  return null;
}

/** @deprecated Liquidity pools are no longer tracked. Returns empty object. */
export function getAllOsmosisPools(): Record<string, never> {
  return {};
}
