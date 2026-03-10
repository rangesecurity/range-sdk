import {
  BlockProcessor,
  IBlockProcessor,
  Rule,
  ISubEvent,
  ISolanaBlock,
} from '@range-security/range-sdk';

interface IParameters {
  thresholdSOL: number;
}

@Rule<IParameters>({
  type: 'large-transfer',
  label: 'Large SOL Transfer',
  description: 'Alerts when a SOL transfer exceeds a threshold',
  networks: ['solana'],
  parameters: [
    {
      field: 'thresholdSOL',
      label: 'Threshold (SOL)',
      fieldType: 'Number',
      description: 'Minimum SOL amount to trigger an alert',
    },
  ],
  tags: ['security', 'transfer'],
  severity: 'high',
})
export class LargeTransferProcessor extends BlockProcessor {
  async callback({
    rule,
    block,
  }: IBlockProcessor<IParameters, ISolanaBlock>): Promise<ISubEvent[]> {
    const thresholdLamports = rule.parameters.thresholdSOL * 1e9;
    const events: ISubEvent[] = [];

    for (const tx of block.transactions) {
      if (tx.meta.err) continue;

      const { preBalances, postBalances } = tx.meta;
      const accountKeys = tx.transaction.message.accountKeys;

      for (let i = 0; i < preBalances.length; i++) {
        const diff = preBalances[i] - postBalances[i];

        if (diff > thresholdLamports) {
          const sender = accountKeys[i]?.pubkey || 'unknown';
          const solAmount = diff / 1e9;

          events.push({
            caption: `Large transfer: ${solAmount.toFixed(2)} SOL from ${sender.slice(0, 8)}...`,
            details: {
              message: `${sender} sent ${solAmount.toFixed(4)} SOL in block ${block.height}`,
            },
            txHash: tx.transaction.signatures[0],
            addressesInvolved: [sender],
          });
        }
      }
    }

    return events;
  }
}
