import { ISubEvent } from '../../types/IEvent';
import { BlockProcessor, IBlockProcessor, Rule } from '../../utils/processor';

@Rule({
  type: 'ThrowError',
  label: 'Throw Error',
  description: 'Throw error rule for benchmarking',
  parameters: [],
  networks: ['solana'],
  tags: ['account'],
  severity: 'low',
})
export class ThrowErrorProcessor extends BlockProcessor {
  async callback({ rule, block }: IBlockProcessor): Promise<ISubEvent[]> {
    throw new Error('Throw error rule');
  }
}
