import { sleep } from '../../utils/basic';
import { ISubEvent } from '../../types/IEvent';
import { BlockProcessor, IBlockProcessor, Rule } from '../../utils/processor';

@Rule({
  type: 'AsyncCall',
  label: 'Async Call',
  description: 'Benchmark processor for async calls',
  parameters: [],
  networks: ['solana', 'osmosis-1'],
  tags: ['account'],
  severity: 'low',
})
export class AsyncCallProcessor extends BlockProcessor {
  async callback({ rule, block }: IBlockProcessor): Promise<ISubEvent[]> {
    await sleep(1000);
    return [];
  }
}
