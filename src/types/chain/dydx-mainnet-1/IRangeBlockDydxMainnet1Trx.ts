import { IRangeTransaction } from '../IRangeTransaction';
import { DydxMainnet1TrxMsg } from './IRangeBlockDydxMainnet1TrxMsg';

export interface DydxMainnet1Trx extends IRangeTransaction {
  messages: DydxMainnet1TrxMsg[];
}
