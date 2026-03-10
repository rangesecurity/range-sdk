/**
 * 5 block + 5 tick test processors for e2e pipeline test.
 * Each processor emits exactly 1 event so we can verify 50 total
 * (5 blocks × 5 block rules + 5 ticks × 5 tick rules).
 */
import 'reflect-metadata';
import {
  Rule,
  BlockProcessor,
  TickProcessor,
  IBlockProcessor,
  ITickProcessor,
} from '../utils/processor';
import { ISubEvent } from '../types/IEvent';

// ── Block Processors (5) ────────────────────────────────────────

@Rule({
  type: 'e2e-block-1',
  label: 'E2E Block 1',
  description: 'Test',
  parameters: [],
  tags: ['security'],
  networks: ['solana'],
})
class E2EBlock1 extends BlockProcessor {
  async callback({ block }: IBlockProcessor): Promise<ISubEvent[]> {
    return [
      { caption: 'e2e-block-1', details: { message: `block ${block.height}` } },
    ];
  }
}

@Rule({
  type: 'e2e-block-2',
  label: 'E2E Block 2',
  description: 'Test',
  parameters: [],
  tags: ['security'],
  networks: ['solana'],
})
class E2EBlock2 extends BlockProcessor {
  async callback({ block }: IBlockProcessor): Promise<ISubEvent[]> {
    return [
      { caption: 'e2e-block-2', details: { message: `block ${block.height}` } },
    ];
  }
}

@Rule({
  type: 'e2e-block-3',
  label: 'E2E Block 3',
  description: 'Test',
  parameters: [],
  tags: ['security'],
  networks: ['solana'],
})
class E2EBlock3 extends BlockProcessor {
  async callback({ block }: IBlockProcessor): Promise<ISubEvent[]> {
    return [
      { caption: 'e2e-block-3', details: { message: `block ${block.height}` } },
    ];
  }
}

@Rule({
  type: 'e2e-block-4',
  label: 'E2E Block 4',
  description: 'Test',
  parameters: [],
  tags: ['security'],
  networks: ['solana'],
})
class E2EBlock4 extends BlockProcessor {
  async callback({ block }: IBlockProcessor): Promise<ISubEvent[]> {
    return [
      { caption: 'e2e-block-4', details: { message: `block ${block.height}` } },
    ];
  }
}

@Rule({
  type: 'e2e-block-5',
  label: 'E2E Block 5',
  description: 'Test',
  parameters: [],
  tags: ['security'],
  networks: ['solana'],
})
class E2EBlock5 extends BlockProcessor {
  async callback({ block }: IBlockProcessor): Promise<ISubEvent[]> {
    return [
      { caption: 'e2e-block-5', details: { message: `block ${block.height}` } },
    ];
  }
}

// ── Tick Processors (5) ─────────────────────────────────────────

@Rule({
  type: 'e2e-tick-1',
  label: 'E2E Tick 1',
  description: 'Test',
  parameters: [],
  tags: ['security'],
  networks: ['solana'],
})
class E2ETick1 extends TickProcessor {
  async callback({ timestamp }: ITickProcessor): Promise<ISubEvent[]> {
    return [
      { caption: 'e2e-tick-1', details: { message: `tick ${timestamp}` } },
    ];
  }
}

@Rule({
  type: 'e2e-tick-2',
  label: 'E2E Tick 2',
  description: 'Test',
  parameters: [],
  tags: ['security'],
  networks: ['solana'],
})
class E2ETick2 extends TickProcessor {
  async callback({ timestamp }: ITickProcessor): Promise<ISubEvent[]> {
    return [
      { caption: 'e2e-tick-2', details: { message: `tick ${timestamp}` } },
    ];
  }
}

@Rule({
  type: 'e2e-tick-3',
  label: 'E2E Tick 3',
  description: 'Test',
  parameters: [],
  tags: ['security'],
  networks: ['solana'],
})
class E2ETick3 extends TickProcessor {
  async callback({ timestamp }: ITickProcessor): Promise<ISubEvent[]> {
    return [
      { caption: 'e2e-tick-3', details: { message: `tick ${timestamp}` } },
    ];
  }
}

@Rule({
  type: 'e2e-tick-4',
  label: 'E2E Tick 4',
  description: 'Test',
  parameters: [],
  tags: ['security'],
  networks: ['solana'],
})
class E2ETick4 extends TickProcessor {
  async callback({ timestamp }: ITickProcessor): Promise<ISubEvent[]> {
    return [
      { caption: 'e2e-tick-4', details: { message: `tick ${timestamp}` } },
    ];
  }
}

@Rule({
  type: 'e2e-tick-5',
  label: 'E2E Tick 5',
  description: 'Test',
  parameters: [],
  tags: ['security'],
  networks: ['solana'],
})
class E2ETick5 extends TickProcessor {
  async callback({ timestamp }: ITickProcessor): Promise<ISubEvent[]> {
    return [
      { caption: 'e2e-tick-5', details: { message: `tick ${timestamp}` } },
    ];
  }
}

export const E2E_PROCESSORS = [
  E2EBlock1,
  E2EBlock2,
  E2EBlock3,
  E2EBlock4,
  E2EBlock5,
  E2ETick1,
  E2ETick2,
  E2ETick3,
  E2ETick4,
  E2ETick5,
];
