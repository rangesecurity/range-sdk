jest.mock('../wrappers/solana-block-wrapper', () => ({
  SolanaBlockWrapper: jest.fn(),
  createSolanaBlockFromJson: jest.fn(),
}));

import { extractBlockMeta } from '../processors/taskProcessor';

describe('extractBlockMeta', () => {
  describe('normalized blocks (Solana/Cosmos)', () => {
    it('extracts from block with top-level height/network/timestamp', () => {
      const meta = extractBlockMeta({
        height: 12345,
        network: 'solana',
        timestamp: '2024-01-01T00:00:00Z',
      });
      expect(meta).toEqual({
        height: '12345',
        network: 'solana',
        timestamp: '2024-01-01T00:00:00Z',
      });
    });

    it('coerces numeric height to string', () => {
      const meta = extractBlockMeta({
        height: 999,
        network: 'osmosis-1',
        timestamp: '2024-06-15T12:00:00Z',
      });
      expect(meta.height).toBe('999');
    });

    it('handles missing timestamp gracefully', () => {
      const meta = extractBlockMeta({
        height: 1,
        network: 'eth',
        timestamp: undefined,
      });
      expect(meta.timestamp).toBe('');
    });
  });

  describe('EVM blocks (hex-encoded)', () => {
    it('parses hex height and timestamp from block.block.result', () => {
      const meta = extractBlockMeta({
        block: {
          result: {
            number: '0x1a4', // 420
            timestamp: '0x65b0c800', // 2024-01-24T00:00:00Z (approx)
          },
        },
        chain_id: 1,
      });
      expect(meta.height).toBe('420');
      expect(meta.network).toBe('1');
    });

    it('handles missing timestamp in EVM block', () => {
      const meta = extractBlockMeta({
        block: {
          result: {
            number: '0xa',
          },
        },
      });
      expect(meta.height).toBe('10');
      expect(meta.timestamp).toBe('undefined');
    });

    it('uses chain_id as network string', () => {
      const meta = extractBlockMeta({
        block: {
          result: {
            number: '0x1',
          },
        },
        chain_id: 56,
      });
      expect(meta.network).toBe('56');
    });
  });

  describe('fallback (unknown format)', () => {
    it('falls back to raw values when no recognized format', () => {
      const meta = extractBlockMeta({
        height: 42,
        timestamp: 'some-ts',
      });
      // No network → not the first branch, no block.result → not EVM, falls to default
      expect(meta.height).toBe('42');
      expect(meta.timestamp).toBe('some-ts');
      expect(meta.network).toBe('');
    });

    it('handles completely empty block', () => {
      const meta = extractBlockMeta({});
      expect(meta.height).toBe('0');
      expect(meta.network).toBe('');
    });
  });
});
