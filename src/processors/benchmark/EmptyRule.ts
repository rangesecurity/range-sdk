import { ISubEvent } from '../../types/IEvent';
import { BlockProcessor, IBlockProcessor, Rule } from '../../utils/processor';

@Rule({
  type: 'EmptyRule',
  label: 'Empty Rule',
  description: 'Empty rule for benchmarking',
  parameters: [],
  networks: ['solana'],
  tags: ['account'],
  severity: 'low',
})
export class EmptyRuleProcessor extends BlockProcessor {
  async callback({ rule, block }: IBlockProcessor): Promise<ISubEvent[]> {
    return [];
  }
}
