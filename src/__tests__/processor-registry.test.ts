import 'reflect-metadata';
import {
  BlockProcessor,
  TickProcessor,
  ProcessorRegistry,
  IBlockProcessor,
  ITickProcessor,
} from '../utils/processor';
import { ISubEvent } from '../types/IEvent';

// Reset registry between tests
beforeEach(() => {
  (ProcessorRegistry as any).processorMap = new Map();
});

class TestBlockProcessor extends BlockProcessor {
  async callback({ rule, block }: IBlockProcessor): Promise<ISubEvent[]> {
    return [];
  }
}

class TestTickProcessor extends TickProcessor {
  async callback({ rule, timestamp }: ITickProcessor): Promise<ISubEvent[]> {
    return [{ caption: 'tick', details: { message: 'tick fired' } }];
  }
}

describe('ProcessorRegistry', () => {
  describe('register + get', () => {
    it('registers and retrieves a block processor', () => {
      ProcessorRegistry.register(
        {
          type: 'test-block',
          label: 'Test',
          description: '',
          parameters: [],
          tags: ['security'],
          networks: ['eth'],
        },
        TestBlockProcessor
      );
      const info = ProcessorRegistry.get('test-block');
      expect(info).toBeDefined();
      expect(info!.rule.type).toBe('test-block');
      expect(info!.instance.taskType).toBe('BLOCK');
    });

    it('registers and retrieves a tick processor', () => {
      ProcessorRegistry.register(
        {
          type: 'test-tick',
          label: 'Test',
          description: '',
          parameters: [],
          tags: ['security'],
          networks: ['eth'],
        },
        TestTickProcessor
      );
      const info = ProcessorRegistry.get('test-tick');
      expect(info).toBeDefined();
      expect(info!.instance.taskType).toBe('TICK');
    });

    it('returns undefined for unknown rule type', () => {
      expect(ProcessorRegistry.get('nonexistent')).toBeUndefined();
    });

    it('throws on duplicate rule type', () => {
      ProcessorRegistry.register(
        {
          type: 'dup',
          label: 'First',
          description: '',
          parameters: [],
          tags: ['security'],
          networks: ['eth'],
        },
        TestBlockProcessor
      );
      expect(() =>
        ProcessorRegistry.register(
          {
            type: 'dup',
            label: 'Second',
            description: '',
            parameters: [],
            tags: ['security'],
            networks: ['eth'],
          },
          TestTickProcessor
        )
      ).toThrow('duplicate rule type "dup"');
    });

    it('throws when networks is missing or empty', () => {
      expect(() =>
        ProcessorRegistry.register(
          {
            type: 'no-networks',
            label: 'No Networks',
            description: '',
            parameters: [],
            tags: ['security'],
            networks: [],
          },
          TestBlockProcessor
        )
      ).toThrow('must specify at least one network');

      expect(() =>
        ProcessorRegistry.register(
          {
            type: 'no-networks-2',
            label: 'No Networks',
            description: '',
            parameters: [],
            tags: ['security'],
          } as any,
          TestBlockProcessor
        )
      ).toThrow('must specify at least one network');
    });
  });

  describe('getAlertTemplates', () => {
    beforeEach(() => {
      ProcessorRegistry.register(
        {
          type: 'solana-rule',
          label: 'Solana Rule',
          description: '',
          parameters: [],
          tags: ['solana'],
          networks: ['solana'],
        },
        TestBlockProcessor
      );
      ProcessorRegistry.register(
        {
          type: 'eth-rule',
          label: 'ETH Rule',
          description: '',
          parameters: [],
          tags: ['security'],
          networks: ['eth'],
        },
        TestBlockProcessor
      );
      ProcessorRegistry.register(
        {
          type: 'multi-rule',
          label: 'Multi Network',
          description: '',
          parameters: [],
          tags: ['security'],
          networks: ['eth', 'solana'],
        },
        TestTickProcessor
      );
    });

    it('returns all templates when no network filter', () => {
      const templates = ProcessorRegistry.getAlertTemplates();
      expect(templates.size).toBe(3);
    });

    it('filters by network', () => {
      const templates = ProcessorRegistry.getAlertTemplates('solana');
      expect(templates.size).toBe(2); // solana-rule + multi-rule
      expect(templates.has('solana-rule')).toBe(true);
      expect(templates.has('multi-rule')).toBe(true);
      expect(templates.has('eth-rule')).toBe(false);
    });

    it('sets default severity to info', () => {
      const templates = ProcessorRegistry.getAlertTemplates();
      const rule = templates.get('solana-rule');
      expect(rule!.severity).toBe('info');
    });

    it('sets trigger from instance taskType', () => {
      const templates = ProcessorRegistry.getAlertTemplates();
      expect(templates.get('solana-rule')!.trigger).toBe('BLOCK');
      expect(templates.get('multi-rule')!.trigger).toBe('TICK');
    });
  });
});
