import { IRangeTransaction } from '../IRangeTransaction';
import { Mocha4TrxMsg } from './IRangeBlockMocha4TrxMsg';

export interface Mocha4Trx extends IRangeTransaction {
  messages: Mocha4TrxMsg[];
}
