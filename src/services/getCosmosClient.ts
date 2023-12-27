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

const networkToClients: Record<Network, CosmosClient> = {
  'osmosis-1': new CosmosClient(OSMOSIS_PUBLIC_RPC),
  'osmo-test-5': new CosmosClient(OSMOSIS_TEST_RPC),
  'mocha-4': new CosmosClient(MOCHA_RPC),
  'cosmoshub-4': new CosmosClient(COSMOS_PUBLIC_RPC),
  celestia: new CosmosClient(CELESTIA_PUBLIC_RPC),
  'stride-1': new CosmosClient(STRIDE_PUBLIC_RPC),
  'noble-1': new CosmosClient(NOBLE_RPC),
  'neutron-1': new CosmosClient(NEUTRON_PUBLIC_RPC),
  'grand-1': new CosmosClient(NOBLE_TESTNET_RPC),
};

export function getCosmosClient(network: IRangeNetwork): CosmosClient {
  return networkToClients[network];
}

export function getCustomCosmosClient(rpc: string): CosmosClient {
  return new CosmosClient(rpc);
}
