import { IRangeTransaction } from '../IRangeTransaction';
import { CosmosHub4TrxMsg } from './IRangeBlockCosmosHub4TrxMsg';

export interface CosmosHub4Trx extends IRangeTransaction {
  messages: CosmosHub4TrxMsg[];
}
