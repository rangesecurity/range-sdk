import { IRangeTransaction } from '../IRangeTransaction';
import { OsmosisTrxMsg } from './IRangeBlockOsmosisTrxMsg';

export interface OsmosisTrx extends IRangeTransaction {
  messages: OsmosisTrxMsg[];
}
