import { ISubEvent } from '../../types/IEvent';
import { TickProcessor, ITickProcessor, Rule } from '../../utils/processor';

@Rule({
  type: 'EmptyRuleTick',
  label: 'Empty Rule Tick',
  description: 'Empty tick rule for benchmarking',
  parameters: [],
  networks: ['solana'],
  tags: ['account'],
  severity: 'low',
})
export class EmptyRuleTickProcessor extends TickProcessor {
  async callback({ rule, timestamp }: ITickProcessor): Promise<ISubEvent[]> {
    return [];
  }
}
