export type KnownEvmNetwork = 'eth' | 'arb1' | 'bnb' | 'pol';

export type KnownNetwork =
  | 'cosmoshub-4'
  | 'solana'
  | 'neutron-1'
  | 'noble-1'
  | 'osmosis-1'
  | 'stride-1'
  | 'celestia'
  | 'dydx-mainnet-1'
  | 'dymension_1100-1'
  | 'agoric-3'
  | 'pio-mainnet-1'
  | 'mantra-1'
  | KnownEvmNetwork;

export const ETHEREUM = 'eth' as const;
export const ARBITRUM = 'arb1' as const;
export const BINANCE_SMART_CHAIN = 'bnb' as const;
export const POLYGON = 'pol' as const;

export const EVM_NETWORKS: KnownEvmNetwork[] = [
  ETHEREUM,
  ARBITRUM,
  BINANCE_SMART_CHAIN,
  POLYGON,
];

export type IEvmNetwork = KnownEvmNetwork | (string & {});
export type INetwork = KnownNetwork | (string & {});
