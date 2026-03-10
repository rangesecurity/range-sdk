import { sleep } from '../../utils/basic';
import { ISubEvent } from '../../types/IEvent';
import {
  IBlockProcessor,
  ITickProcessor,
  Rule,
  TickProcessor,
} from '../../utils/processor';

@Rule({
  type: 'TickLiveness',
  label: 'Tick Liveness',
  description: 'Tick liveness rule for testing',
  parameters: [
    {
      field: 'perc',
      label: 'Percentage',
      fieldType: 'Number',
      description: 'Percentage chance of triggering an event',
    },
  ],
  networks: ['solana', 'osmosis-1'],
  tags: ['account'],
  severity: 'low',
})
export class TickLivenessProcessor extends TickProcessor {
  async callback({ rule, timestamp }: ITickProcessor): Promise<ISubEvent[]> {
    const perc = rule.parameters.perc;
    const randomValue = Math.random() * 100;
    await sleep(randomValue);

    if (randomValue < perc) {
      throw new Error('catch me if you can: 1902');
    }

    await sleep(randomValue / 10);
    return [
      {
        caption: `Tick Event`,
        details: {
          message: 'Hello',
        },
      },
    ];
  }
}
