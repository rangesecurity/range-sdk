import 'dotenv/config';
import { startRunner } from '@range-security/range-sdk';
import { join } from 'path';

const testAlertRules = [
  {
    ruleType: 'large-transfer',
    parameters: { thresholdSOL: 100 },
    triggerMode: 'BLOCK' as const,
  },
  {
    ruleType: 'tx-surge',
    parameters: { surgePercent: 10 },
    triggerMode: 'BLOCK' as const,
  },
];

testAlertRules.forEach((rule: any, i) => {
  rule.id = i;
  rule.network = 'solana';
  rule.createdAt = new Date().toISOString();
});

startRunner({
  processors: join(process.cwd(), 'dist', 'processors', 'processors.js'),
  testAlertRules: testAlertRules as any,
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
