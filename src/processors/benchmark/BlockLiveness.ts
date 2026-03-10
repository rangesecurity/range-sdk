import { ISubEvent } from '../../types/IEvent';
import { BlockProcessor, IBlockProcessor, Rule } from '../../utils/processor';
import { IAlertRule } from '../../types/IAlertRule';

interface IParameters {
  blockInterval: number;
}

@Rule<IParameters>({
  type: 'BlockLiveness',
  label: 'Block Liveness',
  description: 'Triggers an event notification for Solana',
  parameters: [
    {
      label: 'Block Interval',
      description: 'Block Interval',
      field: 'blockInterval',
      fieldType: 'Number',
    },
  ],
  networks: ['solana'],
  tags: ['security'],
  severity: 'low',
})
export class BlockLivenessProcessor extends BlockProcessor {
  async callback({
    rule,
    block,
  }: IBlockProcessor<IParameters>): Promise<ISubEvent[]> {
    const interval = rule.parameters.blockInterval;
    const height = block.height;
    const txCount = block.transactions?.length || 0;

    if (height % interval === 0) {
      return [
        {
          caption: `Triggered event notification for rule ${rule.id} at block ${height}`,
          details: {
            message: `Triggered event notification for rule ${rule.id} at block ${height} with ${txCount} transactions`,
          },
        },
      ];
    }

    return [];
  }
}
