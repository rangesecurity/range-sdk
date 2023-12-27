import { NetworkEnum } from '../IRangeNetwork';
import { IRangeTransaction } from './IRangeTransaction';
import { Osmosis1Trx } from './osmosis-1/IRangeBlockOsmosis1Trx';
import { Grand1Trx } from './grand-1/IRangeBlockGrand1Trx';
import { CosmosHub4Trx } from './cosmoshub-4/IRangeBlockCosmosHub4Trx';
import { Mocha4Trx } from './mocha-4/IRangeBlockMocha4Trx';
import { Neutron1Trx } from './neutron-1/IRangeBlockNeutron1Trx';
import { Noble1Trx } from './noble-1/IRangeBlockNoble1Trx';
import { Stride1Trx } from './stride-1/IRangeBlockStride1Trx';
import { OsmoTest5Trx } from './osmo-test-5/IRangeBlockOsmoTest5Trx';
import { CelestiaTrx } from './celestia/IRangeBlockCelestiaTrx';
import { DydxMainnet1Trx } from './dydx-mainnet-1/IRangeBlockDydxMainnet1Trx';

interface BlockBase {
  hash: string;
  height: string;
  transactions: IRangeTransaction[];
  network: NetworkEnum;
  timestamp: string;
  block_data?: Record<string | number | symbol, unknown>;
  block_events?: BlockEvents;
}

export interface BlockEvent {
  type: string;
  attributes: { key: string; value: string }[];
}

export interface BlockEvents {
  end_block: BlockEvent[];
  begin_block: BlockEvent[];
}

export interface Osmosis1Block extends BlockBase {
  transactions: Osmosis1Trx[];
  network: NetworkEnum.Osmosis1;
}

export interface Grand1Block extends BlockBase {
  transactions: Grand1Trx[];
  network: NetworkEnum.Grand1;
}

export interface CosmosHub4Block extends BlockBase {
  transactions: CosmosHub4Trx[];
  network: NetworkEnum.CosmosHub4;
}

export interface Mocha4Block extends BlockBase {
  transactions: Mocha4Trx[];
  network: NetworkEnum.Mocha4;
}

export interface Neutron1Block extends BlockBase {
  transactions: Neutron1Trx[];
  network: NetworkEnum.Neutron1;
}

export interface Noble1Block extends BlockBase {
  transactions: Noble1Trx[];
  network: NetworkEnum.Noble1;
}

export interface Stride1Block extends BlockBase {
  transactions: Stride1Trx[];
  network: NetworkEnum.Stride1;
}

export interface OsmoTest5Block extends BlockBase {
  transactions: OsmoTest5Trx[];
  network: NetworkEnum.OsmoTest5;
}

export interface CelestiaBlock extends BlockBase {
  transactions: CelestiaTrx[];
  network: NetworkEnum.Celestia;
}

export interface DydxMainnet1Block extends BlockBase {
  transactions: DydxMainnet1Trx[];
  network: NetworkEnum.DydxMainnet1;
}

export type IRangeBlock =
  | Osmosis1Block
  | Grand1Block
  | CosmosHub4Block
  | Mocha4Block
  | Neutron1Block
  | Noble1Block
  | Stride1Block
  | OsmoTest5Block
  | CelestiaBlock
  | DydxMainnet1Block;
