import { IRangeTransaction } from '../IRangeTransaction';
import { CelestiaTrxMsg } from './IRangeBlockCelestiaTrxMsg';

export interface CelestiaTrx extends IRangeTransaction {
  messages: CelestiaTrxMsg[];
}
