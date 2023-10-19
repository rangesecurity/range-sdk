import { NetworkEnum } from '../IRangeNetwork';
import { IRangeTransaction } from './IRangeTransaction';
import { Osmosis1Trx } from './osmosis-1/IRangeBlockOsmosis1Trx';
import { Grand1Trx } from './grand-1/IRangeBlockGrand1Trx';
import { CosmosHub4Trx } from './cosmoshub-4/IRangeBlockCosmosHub4Trx';
import { Mocha4Trx } from './mocha-4/IRangeBlockMocha4Trx';
import { Neutron1Trx } from './neutron-1/IRangeBlockNeutron1Trx';
import { Noble1Trx } from './noble-1/IRangeBlockNoble1Trx';

interface BlockBase {
  hash: string;
  height: number;
  transactions: IRangeTransaction[];
  network: NetworkEnum;
  timestamp: string;
  block_data?: string;
}

interface Osmosis1Block extends BlockBase {
  transactions: Osmosis1Trx[];
  network: NetworkEnum.Osmosis1;
}

interface Grand1Block extends BlockBase {
  transactions: Grand1Trx[];
  network: NetworkEnum.Grand1;
}

interface CosmosHub4Block extends BlockBase {
  transactions: CosmosHub4Trx[];
  network: NetworkEnum.CosmosHub4;
}

interface Mocha4Block extends BlockBase {
  transactions: Mocha4Trx[];
  network: NetworkEnum.Mocha4;
}

interface Neutron1Block extends BlockBase {
  transactions: Neutron1Trx[];
  network: NetworkEnum.Neutron1;
}

interface Noble1Block extends BlockBase {
  transactions: Noble1Trx[];
  network: NetworkEnum.Noble1;
}

export type IRangeBlock =
  | Osmosis1Block
  | Grand1Block
  | CosmosHub4Block
  | Mocha4Block
  | Neutron1Block
  | Noble1Block;
