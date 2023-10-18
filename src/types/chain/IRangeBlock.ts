import { NetworkEnum } from '../IRangeNetwork';
import { IRangeTransaction } from './IRangeTransaction';
import { OsmosisTrx } from './osmosis-1/IRangeBlockOsmosisTrx';
import { Grand1Trx } from './grand-1/IRangeBlockGrand1Trx';

interface BlockBase {
  hash: string;
  height: number;
  transactions: IRangeTransaction[];
  network: NetworkEnum;
  timestamp: string;
  block_data?: string;
}

interface OsmosisBlock extends BlockBase {
  transactions: OsmosisTrx[];
  network: NetworkEnum.Osmosis1;
}

interface Grand1Block extends BlockBase {
  transactions: Grand1Trx[];
  network: NetworkEnum.Grand1;
}

export type IRangeBlock = OsmosisBlock | Grand1Block;
