/**
 * ETH test processor for e2e pipeline test.
 * Validates that the EVM block JSON survives the SharedArrayBuffer round-trip
 * and the worker receives a fully parsed object with all fields intact.
 */
import 'reflect-metadata';
import { Rule, BlockProcessor, IBlockProcessor } from '../utils/processor';
import { ISubEvent } from '../types/IEvent';

@Rule({
  type: 'e2e-eth-block',
  label: 'E2E ETH Block',
  description: 'Validates EVM block JSON integrity through worker pipeline',
  parameters: [],
  tags: ['evm'],
  networks: ['eth'],
})
class E2EEthBlock extends BlockProcessor {
  async callback({ block }: IBlockProcessor): Promise<ISubEvent[]> {
    const errors: string[] = [];

    // Verify the block is a real parsed object (not a string)
    if (typeof block !== 'object' || block === null) {
      errors.push(`block is ${typeof block}, expected object`);
    }

    // Check top-level fields exist (set by normalizeBlock or pre-normalized)
    if (block.height === undefined) errors.push('missing block.height');
    if (block.network === undefined) errors.push('missing block.network');

    // Check the nested RPC result structure survived JSON round-trip
    const result = block.result;
    if (!result) {
      errors.push('missing block.result');
    } else {
      if (!result.number) errors.push('missing result.number');
      if (!result.hash) errors.push('missing result.hash');
      if (!result.miner) errors.push('missing result.miner');
      if (!result.gasUsed) errors.push('missing result.gasUsed');
      if (!Array.isArray(result.transactions)) {
        errors.push('result.transactions is not an array');
      } else if (result.transactions.length > 0) {
        const tx = result.transactions[0];
        if (!tx.hash) errors.push('missing tx.hash');
        if (!tx.from) errors.push('missing tx.from');
      }
    }

    if (errors.length > 0) {
      return [
        {
          caption: 'e2e-eth-block',
          details: {
            message: `FAIL: ${errors.join('; ')}`,
            valid: false,
            errorCount: errors.length,
          },
        },
      ];
    }

    return [
      {
        caption: 'e2e-eth-block',
        details: {
          message: `OK: height=${block.height}, txs=${result.transactions.length}, hash=${result.hash?.slice(0, 10)}...`,
          valid: true,
          txCount: result.transactions.length,
          height: block.height,
        },
      },
    ];
  }
}

export const E2E_ETH_PROCESSORS = [E2EEthBlock];
