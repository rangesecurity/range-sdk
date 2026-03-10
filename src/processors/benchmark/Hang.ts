import { sleep } from '../../utils/basic';
import { ISubEvent } from '../../types/IEvent';
import { BlockProcessor, IBlockProcessor, Rule } from '../../utils/processor';

@Rule({
  type: 'Hang',
  label: 'Hang',
  description: 'Hang rule for benchmarking',
  parameters: [],
  networks: ['solana', 'osmosis-1'],
  tags: ['account'],
  severity: 'low',
})
export class HangProcessor extends BlockProcessor {
  async callback({ rule, block }: IBlockProcessor): Promise<ISubEvent[]> {
    await sleep(999999999);
    return [];
  }
}
