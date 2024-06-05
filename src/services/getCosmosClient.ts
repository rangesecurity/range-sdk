import { CosmosClient } from '../cosmos/CosmosClient';
import { Network } from '../network';
import { IRangeNetwork } from '../types/IRangeNetwork';

const COSMOS_PUBLIC_RPC = 'https://cosmoshub.validator.network/';
const STRIDE_PUBLIC_RPC = 'https://stride-rpc.publicnode.com:443/';
const OSMOSIS_PUBLIC_RPC = 'https://rpc.osmosis.zone/';
const OSMOSIS_TEST_RPC = 'https://rpc.osmotest5.osmosis.zone';
const MOCHA_RPC = 'https://rpc-2.celestia-mocha.com/';
const CELESTIA_PUBLIC_RPC = 'https://celestia-rpc.mesa.newmetric.xyz/';
const NOBLE_RPC = 'https://noble-rpc.polkachu.com/';
const NEUTRON_PUBLIC_RPC = 'https://neutron-rpc.publicnode.com/';
const NOBLE_TESTNET_RPC = 'https://rpc.testnet.noble.strange.love/';
const DYMENSION_RPC = 'https://dymension-rpc.publicnode.com:443';
const DYDX_RPC = 'https://dydx-rpc.publicnode.com:443';

const OSMOSIS_LCD = 'https://lcd.osmosis.zone';
const COSMOS_LCD = 'https://cosmos-lcd.quickapi.com';
const DYMENSION_LCD = 'https://dymension-rest.publicnode.com';
const STRIDE_LCD = 'https://stride-rest.publicnode.com';
const CELESTIA_LCD = 'https://celestia-rest.publicnode.com';
const NOBLE_LCD = 'https://noble-api.polkachu.com';
const NEUTRON_LCD = 'https://lcd-neutron.whispernode.com';
const DYDX_LCD = 'https://dydx-dao-api.polkachu.com';

const networkToClients: Record<Network, CosmosClient> = {
  'osmosis-1': new CosmosClient(OSMOSIS_PUBLIC_RPC, OSMOSIS_LCD),
  'cosmoshub-4': new CosmosClient(COSMOS_PUBLIC_RPC, COSMOS_LCD),
  celestia: new CosmosClient(CELESTIA_PUBLIC_RPC, CELESTIA_LCD),
  'stride-1': new CosmosClient(STRIDE_PUBLIC_RPC, STRIDE_LCD),
  'noble-1': new CosmosClient(NOBLE_RPC, NOBLE_LCD),
  'neutron-1': new CosmosClient(NEUTRON_PUBLIC_RPC, NEUTRON_LCD),
  'dydx-mainnet-1': new CosmosClient(DYDX_RPC, DYDX_LCD),
  'dymension_1100-1': new CosmosClient(DYMENSION_RPC, DYMENSION_LCD),

  'grand-1': new CosmosClient(NOBLE_TESTNET_RPC),
  'mocha-4': new CosmosClient(MOCHA_RPC),
  'osmo-test-5': new CosmosClient(OSMOSIS_TEST_RPC),
};

export function getCosmosClient(network: IRangeNetwork): CosmosClient {
  return networkToClients[network];
}

export function getCustomCosmosClient(rpc: string): CosmosClient {
  return new CosmosClient(rpc);
}
