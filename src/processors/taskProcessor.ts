import { runTask } from '../threadpool/pool';
import { IStat, ITask } from '../types/ITask';
import { IAlertRule } from '../types/IAlertRule';
import {
  createSolanaBlockFromJson,
  SolanaBlockWrapper,
} from '../wrappers/solana-block-wrapper';

/**
 * Size-bucketed buffer pool for improved reuse rate.
 * Uses pre-defined size buckets to avoid O(n) searches and reduce GC pressure.
 */
class BufferPool {
  private pools = new Map<number, SharedArrayBuffer[]>();
  private readonly BUCKET_SIZES = [
    1 * 1024 * 1024, // 1MB
    5 * 1024 * 1024, // 5MB
    10 * 1024 * 1024, // 10MB
    50 * 1024 * 1024, // 50MB
  ];
  private readonly MAX_PER_BUCKET = 20;

  // Stats for monitoring reuse rate
  private hits = 0;
  private misses = 0;

  private getBucketSize(size: number): number {
    for (const bucketSize of this.BUCKET_SIZES) {
      if (size <= bucketSize) return bucketSize;
    }
    // For very large buffers, return exact size (won't be pooled)
    return size;
  }

  getBuffer(size: number): SharedArrayBuffer {
    const bucketSize = this.getBucketSize(size);

    // Get or create pool for this bucket
    if (!this.pools.has(bucketSize)) {
      this.pools.set(bucketSize, []);
    }

    const pool = this.pools.get(bucketSize)!;

    if (pool.length > 0) {
      this.hits++;
      return pool.pop()!;
    }

    this.misses++;
    return new SharedArrayBuffer(bucketSize);
  }

  returnBuffer(buffer: SharedArrayBuffer): void {
    const bucketSize = this.getBucketSize(buffer.byteLength);

    // Don't pool oversized buffers
    if (bucketSize > this.BUCKET_SIZES[this.BUCKET_SIZES.length - 1]) {
      return;
    }

    if (!this.pools.has(bucketSize)) {
      this.pools.set(bucketSize, []);
    }

    const pool = this.pools.get(bucketSize)!;
    if (pool.length < this.MAX_PER_BUCKET) {
      pool.push(buffer);
    }
    // Excess buffers are allowed to be garbage collected
  }

  // Get reuse rate for monitoring
  getReuseRate(): number {
    const total = this.hits + this.misses;
    return total > 0 ? this.hits / total : 0;
  }

  // Get full stats for monitoring
  getStats(): IBufferPoolStats {
    let totalPooled = 0;
    const bucketStats: { size_mb: number; count: number }[] = [];

    for (const [size, pool] of this.pools.entries()) {
      totalPooled += pool.length;
      bucketStats.push({
        size_mb: Math.round(size / 1024 / 1024),
        count: pool.length,
      });
    }

    return {
      hits: this.hits,
      misses: this.misses,
      reuse_rate: Math.round(this.getReuseRate() * 100),
      total_pooled: totalPooled,
      buckets: bucketStats,
    };
  }

  // Clean up pool periodically (trim to half capacity)
  cleanup(): void {
    for (const pool of this.pools.values()) {
      const targetSize = Math.floor(this.MAX_PER_BUCKET / 2);
      if (pool.length > targetSize) {
        pool.splice(0, pool.length - targetSize);
      }
    }
  }
}

export interface IBufferPoolStats {
  hits: number;
  misses: number;
  reuse_rate: number;
  total_pooled: number;
  buckets: { size_mb: number; count: number }[];
}

const bufferPool = new BufferPool();

// Export function to get buffer pool stats
export function getBufferPoolStats(): IBufferPoolStats {
  return bufferPool.getStats();
}

// Cleanup interval to prevent pool growth — started by initBufferPoolCleanup()
let bufferPoolCleanupHandle: ReturnType<typeof setInterval> | null = null;

export function initBufferPoolCleanup() {
  if (!bufferPoolCleanupHandle) {
    bufferPoolCleanupHandle = setInterval(() => {
      bufferPool.cleanup();
    }, 30000);
  }
}

export function stopBufferPoolCleanup() {
  if (bufferPoolCleanupHandle) {
    clearInterval(bufferPoolCleanupHandle);
    bufferPoolCleanupHandle = null;
  }
}

/**
 * Extract block metadata (height, timestamp, network) from any block format.
 * Solana blocks have top-level height/timestamp.
 * EVM blocks store them as hex inside block.block.result.
 * Cosmos blocks have top-level height/timestamp.
 */
export function extractBlockMeta(blockData: any): {
  height: string;
  timestamp: string;
  network: string;
} {
  // Normalized blocks (Solana, Cosmos, or pre-normalized EVM)
  if (blockData.height !== undefined && blockData.network !== undefined) {
    return {
      height: String(blockData.height),
      timestamp: String(blockData.timestamp || ''),
      network: String(blockData.network),
    };
  }

  // Fallback: un-normalized EVM (outside runner context, e.g. tests/benchmarks)
  if (blockData.block?.result?.number) {
    const result = blockData.block.result;
    return {
      height: String(parseInt(result.number, 16)),
      timestamp: result.timestamp
        ? new Date(parseInt(result.timestamp, 16) * 1000).toISOString()
        : 'undefined',
      network: String(blockData.network || blockData.chain_id || ''),
    };
  }

  return {
    height: String(blockData.height || 0),
    timestamp: String(blockData.timestamp),
    network: String(blockData.network || ''),
  };
}

export async function processPayload(
  taskData:
    | {
        blockData: any;
        ruleList: IAlertRule[];
        processorsFile?: string;
      }
    | {
        time: string;
        ruleList: IAlertRule[];
        processorsFile?: string;
      }
): Promise<IStat[]> {
  const tasks: ITask[] = [];

  if ('blockData' in taskData) {
    // Process block
    const { blockData, ruleList } = taskData;
    if (!taskData.processorsFile) {
      throw new Error(
        'processorsFile is required — pass the path to your processors barrel file via startRunner({ processors: "..." })'
      );
    }
    const resolvedProcessorsFile = taskData.processorsFile;

    // Pre-encoded binary: use directly (already FlatBuffer bytes)
    const isPreEncoded = blockData instanceof Uint8Array;
    const meta = isPreEncoded
      ? (() => {
          const w = new SolanaBlockWrapper(blockData);
          return {
            height: String(w.height),
            network: w.network,
            timestamp: String(w.timestamp),
          };
        })()
      : extractBlockMeta(blockData);

    // Solana: encode as FlatBuffer for zero-copy worker reads
    // Others: fall back to JSON encoding until migrated
    const isSolana = isPreEncoded || meta.network === 'solana';
    const encoded = isPreEncoded
      ? blockData
      : isSolana
        ? createSolanaBlockFromJson(blockData)
        : new TextEncoder().encode(JSON.stringify(blockData));

    const sharedBuffer = bufferPool.getBuffer(encoded.length);
    new Uint8Array(sharedBuffer, 0, encoded.length).set(encoded);

    tasks.push(
      ...ruleList.map((rule) => ({
        alertRule: rule,
        blockInfo: {
          height: meta.height,
          network: meta.network,
          time: meta.timestamp,
        },
        sharedBuffer,
        sharedBufferLength: encoded.length,
        flatBuffer: isSolana,
        processorsFile: resolvedProcessorsFile,
      }))
    );
  } else {
    // Process tick
    const { time, ruleList } = taskData;
    if (!taskData.processorsFile) {
      throw new Error(
        'processorsFile is required — pass the path to your processors barrel file via startRunner({ processors: "..." })'
      );
    }
    const resolvedProcessorsFile = taskData.processorsFile;

    tasks.push(
      ...ruleList.map((rule) => ({
        alertRule: rule,
        tickInfo: {
          time,
        },
        processorsFile: resolvedProcessorsFile,
      }))
    );
  }

  const results = await Promise.allSettled(tasks.map((task) => runTask(task)));

  // Return buffer to pool after processing (only for block processing)
  if ('blockData' in taskData && tasks.length > 0 && tasks[0].sharedBuffer) {
    bufferPool.returnBuffer(tasks[0].sharedBuffer);
  }

  return results
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value);
}
