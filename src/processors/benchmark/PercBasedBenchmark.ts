import { sleep } from '../../utils/basic';
import { ISubEvent } from '../../types/IEvent';
import { BlockProcessor, IBlockProcessor, Rule } from '../../utils/processor';

@Rule({
  type: 'PercBasedBenchmark',
  label: 'Percentage Based Benchmark',
  description:
    'This rule is used to test the performance of the system. It will return a random event with a percentage chance of being triggered.',
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
export class PercBasedBenchmarkProcessor extends BlockProcessor {
  async callback({ rule, block }: IBlockProcessor): Promise<ISubEvent[]> {
    const perc = rule.parameters.perc;
    const randomValue = Math.random() * 100;
    await sleep(randomValue / 10);

    if (randomValue < perc) {
      return [
        {
          caption: 'Benchmark Event',
          details: {
            message: `Random event triggered (${perc}% chance)`,
          },
        },
      ];
    }

    return [];
  }
}
