import { IRangeTransaction } from '../IRangeTransaction';
import { Osmosis1TrxMsg } from './IRangeBlockOsmosis1TrxMsg';

export interface Osmosis1Trx extends IRangeTransaction {
  messages: Osmosis1TrxMsg[];
}
