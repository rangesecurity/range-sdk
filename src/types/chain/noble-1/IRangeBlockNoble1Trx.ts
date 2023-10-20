import { IRangeTransaction } from '../IRangeTransaction';
import { Noble1TrxMsg } from './IRangeBlockNoble1TrxMsg';

export interface Noble1Trx extends IRangeTransaction {
  messages: Noble1TrxMsg[];
}
