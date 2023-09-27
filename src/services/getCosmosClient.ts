import { CosmosClient } from '../cosmos/CosmosClient';
import { Network } from '../network';
import { IRangeNetwork } from '../types/IRangeNetwork';

const OSMOSIS_PUBLIC_RPC = 'https://rpc.osmosis.zone/';
const OSMOSIS_TEST_RPC = 'https://rpc.osmotest5.osmosis.zone';
const MOCHA_RPC = 'https://rpc-2.celestia-mocha.com/';
const COSMOS_PUBLIC_RPC = 'https://cosmoshub.validator.network/';

const networkToClients: Record<Network, CosmosClient> = {
  'osmosis-1': new CosmosClient(OSMOSIS_PUBLIC_RPC),
  'osmo-test-5': new CosmosClient(OSMOSIS_TEST_RPC),
  'mocha-3': new CosmosClient(MOCHA_RPC),
  'cosmoshub-4': new CosmosClient(COSMOS_PUBLIC_RPC),
};

export function getCosmosClient(network: IRangeNetwork): CosmosClient {
  return networkToClients[network];
}

export function getCustomCosmosClient(rpc: string): CosmosClient {
  return new CosmosClient(rpc);
}
