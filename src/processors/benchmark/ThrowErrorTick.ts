import { ISubEvent } from '../../types/IEvent';
import { TickProcessor, ITickProcessor, Rule } from '../../utils/processor';

@Rule({
  type: 'ThrowErrorTick',
  label: 'Throw Error Tick',
  description: 'Throw error tick rule for benchmarking',
  parameters: [],
  networks: ['solana'],
  tags: ['account'],
  severity: 'low',
})
export class ThrowErrorTickProcessor extends TickProcessor {
  async callback({ rule, timestamp }: ITickProcessor): Promise<ISubEvent[]> {
    throw new Error('Throw error tick rule');
  }
}
