import { CosmosClient } from '../cosmos/CosmosClient';
import { Network } from '../network';
import { IRangeNetwork } from '../types/IRangeNetwork';

const urlConfig = {
  'osmosis-1': {
    rpc: process.env.OSMOSIS_RPC || 'https://rpc.osmosis.zone/',
  },
  'cosmoshub-4': {
    rpc: process.env.COSMOS_RPC || 'https://cosmoshub.validator.network/',
  },
  'grand-1': {
    rpc:
      process.env.NOBLE_TESTNET_RPC ||
      'https://rpc.testnet.noble.strange.love/',
  },
  'mocha-4': {
    rpc: process.env.MOCHA_RPC || 'https://rpc-2.celestia-mocha.com/',
  },
  'osmo-test-5': {
    rpc: process.env.OSMOSIS_TEST_RPC || 'https://rpc.osmotest5.osmosis.zone',
  },
  celestia: {
    rpc: process.env.CELESTIA_RPC || 'https://rpc.lavenderfive.com/celestia',
  },
  'noble-1': {
    rpc: process.env.NOBLE_RPC || 'https://noble-rpc.polkachu.com/',
  },
  'neutron-1': {
    rpc: process.env.NEUTRON_RPC || 'https://neutron-rpc.publicnode.com/',
  },
  'dydx-mainnet-1': {
    rpc: process.env.DYDX_RPC || 'https://dydx-rpc.publicnode.com:443',
  },
  'dymension_1100-1': {
    rpc:
      process.env.DYMENSION_RPC || 'https://dymension-rpc.publicnode.com:443',
  },
  'stride-1': {
    rpc: process.env.STRIDE_RPC || 'https://stride-rpc.publicnode.com:443/',
  },
};

const networkToClients: Record<Network, CosmosClient> = {
  'osmosis-1': new CosmosClient(urlConfig['osmosis-1'].rpc),
  'cosmoshub-4': new CosmosClient(urlConfig['cosmoshub-4'].rpc),
  celestia: new CosmosClient(urlConfig.celestia.rpc),
  'stride-1': new CosmosClient(urlConfig['stride-1'].rpc),
  'noble-1': new CosmosClient(urlConfig['noble-1'].rpc),
  'neutron-1': new CosmosClient(urlConfig['neutron-1'].rpc),
  'dydx-mainnet-1': new CosmosClient(urlConfig['dydx-mainnet-1'].rpc),
  'dymension_1100-1': new CosmosClient(urlConfig['dymension_1100-1'].rpc),
  'grand-1': new CosmosClient(urlConfig['grand-1'].rpc),
  'mocha-4': new CosmosClient(urlConfig['mocha-4'].rpc),
  'osmo-test-5': new CosmosClient(urlConfig['osmo-test-5'].rpc),
};

export function getCosmosClient(network: IRangeNetwork): CosmosClient {
  return networkToClients[network];
}

export function getCustomCosmosClient(rpc: string, lcd?: string): CosmosClient {
  return new CosmosClient(rpc, lcd);
}
