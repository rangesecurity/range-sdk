import { sleep } from '../../utils/basic';
import { ISubEvent } from '../../types/IEvent';
import { TickProcessor, ITickProcessor, Rule } from '../../utils/processor';

@Rule({
  type: 'HangTick',
  label: 'Hang Tick',
  description: 'Hang tick rule for benchmarking - will timeout',
  parameters: [],
  networks: ['solana'],
  tags: ['account'],
  severity: 'low',
})
export class HangTickProcessor extends TickProcessor {
  async callback({ rule, timestamp }: ITickProcessor): Promise<ISubEvent[]> {
    await sleep(999999999);
    return [];
  }
}
