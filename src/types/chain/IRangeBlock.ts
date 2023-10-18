import { IRangeNetwork } from '../IRangeNetwork';
import { NetworkEnum } from '../../network';
import { IRangeTransaction } from './IRangeTransaction';
import { OsmosisTrx } from './osmosis-1/IRangeBlockOsmosisTrx';

interface BlockBase {
  hash: string;
  height: number;
  transactions: IRangeTransaction[];
  network: IRangeNetwork;
  timestamp: string;
  block_data?: string;
}

interface OsmosisBlock extends BlockBase {
  transactions: OsmosisTrx[];
  network: NetworkEnum.Osmosis1;
}

export type IRangeBlock = OsmosisBlock;
