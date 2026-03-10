import { env } from '../env';
import { Connection } from '@solana/web3.js';
import { ethers } from 'ethers';
import { axios } from './axios';
import { cosmos, ibc, cosmwasm } from 'osmojs';
import { IEvmNetwork } from '../types/INetwork';

const customRPCs: Record<string, string> = {};

export function getRpc(network: string) {
  if (customRPCs[network]) {
    return customRPCs[network];
  }

  return `${env.RPC_PROXY_HOST}/api/embed-auth/${env.RPC_PROXY_TOKEN}/rpc/${network}`;
}

let _solanaConnection: Connection | null = null;
export function getSolanaConnection(): Connection {
  if (!_solanaConnection) {
    _solanaConnection = new Connection(getRpc('solana'), {
      commitment: 'confirmed',
    });
  }
  return _solanaConnection;
}

const clientMapping: any = {};
export const getEvmProvider = (
  network: IEvmNetwork
): ethers.JsonRpcProvider => {
  if (clientMapping[network]) return clientMapping[network];

  const request = new ethers.FetchRequest(getRpc(network));
  const provider = new ethers.JsonRpcProvider(request);
  clientMapping[network] = provider;
  return provider;
};

const cosmosClients: Record<
  string,
  Awaited<ReturnType<typeof cosmos.ClientFactory.createRPCQueryClient>>
> = {};
const cwClients: Record<
  string,
  Awaited<ReturnType<typeof cosmwasm.ClientFactory.createRPCQueryClient>>
> = {};
const ibcClients: Record<
  string,
  Awaited<ReturnType<typeof ibc.ClientFactory.createRPCQueryClient>>
> = {};

export const getCosmosRpcClient = async (network: string) => {
  if (cosmosClients[network]) return cosmosClients[network];
  cosmosClients[network] = await cosmos.ClientFactory.createRPCQueryClient({
    rpcEndpoint: getRpc(network),
  });
  return cosmosClients[network];
};

export const getCwRpcClient = async (network: string) => {
  if (cwClients[network]) return cwClients[network];
  cwClients[network] = await cosmwasm.ClientFactory.createRPCQueryClient({
    rpcEndpoint: getRpc(network),
  });
  return cwClients[network];
};

export const getIbcRpcClient = async (network: string) => {
  if (ibcClients[network]) return ibcClients[network];
  ibcClients[network] = await ibc.ClientFactory.createRPCQueryClient({
    rpcEndpoint: getRpc(network),
  });
  return ibcClients[network];
};

let validNetworks: null | string[] = null;
let lastFetched: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export async function getValidRpc(network: string) {
  const now = Date.now();

  if (!validNetworks || now - lastFetched > CACHE_DURATION) {
    const res = await axios.get(`${env.RPC_PROXY_HOST}/api/rpc`, {
      headers: {
        Authorization: `Bearer ${env.RPC_PROXY_TOKEN}`,
      },
    });
    validNetworks = res.data;
    lastFetched = now;
  }

  if (validNetworks!.includes(network)) {
    return getRpc(network);
  }

  return null;
}
