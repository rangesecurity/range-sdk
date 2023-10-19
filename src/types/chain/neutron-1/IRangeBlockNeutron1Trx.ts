import { IRangeTransaction } from '../IRangeTransaction';
import { Neutron1TrxMsg } from './IRangeBlockNeutron1TrxMsg';

export interface Neutron1Trx extends IRangeTransaction {
  messages: Neutron1TrxMsg[];
}
