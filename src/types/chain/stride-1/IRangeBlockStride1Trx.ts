import { IRangeTransaction } from '../IRangeTransaction';
import { Stride1TrxMsg } from './IRangeBlockStride1TrxMsg';

export interface Stride1Trx extends IRangeTransaction {
  messages: Stride1TrxMsg[];
}
