import {
  BlockProcessor,
  IBlockProcessor,
  Rule,
  ISubEvent,
  ISolanaBlock,
} from '@range-security/range-sdk';

interface IParameters {
  surgePercent: number;
}

const recentTxCounts: number[] = [];
const WINDOW_SIZE = 10;

@Rule<IParameters>({
  type: 'tx-surge',
  label: 'Transaction Surge',
  description:
    'Alerts when transaction count exceeds the rolling average by a percentage',
  networks: ['solana'],
  parameters: [
    {
      field: 'surgePercent',
      label: 'Surge Threshold (%)',
      fieldType: 'Number',
      description: 'Trigger if tx count exceeds avg by this percentage',
    },
  ],
  tags: ['security', 'unusual'],
  severity: 'medium',
})
export class TxSurgeProcessor extends BlockProcessor {
  async callback({
    rule,
    block,
  }: IBlockProcessor<IParameters, ISolanaBlock>): Promise<ISubEvent[]> {
    const txCount = block.transactions.length;
    const surgePercent = rule.parameters.surgePercent;

    if (recentTxCounts.length >= WINDOW_SIZE) {
      const avg =
        recentTxCounts.reduce((sum, c) => sum + c, 0) / recentTxCounts.length;
      const threshold = avg * (1 + surgePercent / 100);

      if (txCount > threshold) {
        recentTxCounts.push(txCount);
        if (recentTxCounts.length > WINDOW_SIZE) recentTxCounts.shift();

        return [
          {
            caption: `Tx surge: ${txCount} txs (avg ${avg.toFixed(0)})`,
            details: {
              message: `Block ${block.height} has ${txCount} transactions, ${((txCount / avg - 1) * 100).toFixed(1)}% above the ${WINDOW_SIZE}-block average of ${avg.toFixed(0)}`,
            },
          },
        ];
      }
    }

    recentTxCounts.push(txCount);
    if (recentTxCounts.length > WINDOW_SIZE) recentTxCounts.shift();

    return [];
  }
}
