import { IRangeTransaction } from '../IRangeTransaction';
import { Grand1TrxMsg } from './IRangeBlockGrand1TrxMsg';

export interface Grand1Trx extends IRangeTransaction {
  messages: Grand1TrxMsg[];
}
