import { IRangeTransaction } from '../IRangeTransaction';
import { OsmoTest5TrxMsg } from './IRangeBlockOsmoTest5TrxMsg';

export interface OsmoTest5Trx extends IRangeTransaction {
  messages: OsmoTest5TrxMsg[];
}
