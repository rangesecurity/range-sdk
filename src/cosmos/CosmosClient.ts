import { cosmos, cosmwasm, ibc, osmosis } from 'osmojs';
import { assert } from 'console';
import { QueryValidatorResponse } from 'osmojs/types/codegen/cosmos/staking/v1beta1/query';
import {
  QueryContractInfoResponse,
  QuerySmartContractStateResponse,
} from 'osmojs/types/codegen/cosmwasm/wasm/v1/query';
import {
  QueryBalanceResponse,
  QuerySupplyOfResponse,
} from 'osmojs/types/codegen/cosmos/bank/v1beta1/query';

export class CosmosClient {
  constructor(readonly rpcEndpoint: string) {
    assert(rpcEndpoint, 'rpcEndpoint cannot be empty');
  }

  async balance(address: string, denom: string): Promise<QueryBalanceResponse> {
    const client = await this.getCosmosRpcClient();
    return await client.cosmos.bank.v1beta1.balance({
      address,
      denom,
    });
  }

  async supply(denom: string): Promise<QuerySupplyOfResponse> {
    const client = await this.getCosmosRpcClient();
    return await client.cosmos.bank.v1beta1.supplyOf({
      denom,
    });
  }

  async validator(validatorAddr: string): Promise<QueryValidatorResponse> {
    const client = await this.getCosmosRpcClient();
    return await client.cosmos.staking.v1beta1.validator({
      validatorAddr,
    });
  }

  async contractInfo(address: string): Promise<QueryContractInfoResponse> {
    const client = await this.getCosmwasmRpcClient();
    return await client.cosmwasm.wasm.v1.contractInfo({
      address,
    });
  }

  async fetchContractQuery(
    address: string,
    queryData: object,
  ): Promise<QuerySmartContractStateResponse> {
    const client = await this.getCosmwasmRpcClient();
    const res = await client.cosmwasm.wasm.v1.smartContractState({
      address,
      queryData: Buffer.from(JSON.stringify(queryData)),
    });

    return JSON.parse(Buffer.from(res.data).toString('utf8'));
  }

  async getCosmosRpcClient() {
    return await cosmos.ClientFactory.createRPCQueryClient({
      rpcEndpoint: this.rpcEndpoint,
    });
  }

  async getOsmosisRpcClient() {
    return await osmosis.ClientFactory.createRPCQueryClient({
      rpcEndpoint: this.rpcEndpoint,
    });
  }

  async getIbcRpcClient() {
    return await ibc.ClientFactory.createRPCQueryClient({
      rpcEndpoint: this.rpcEndpoint,
    });
  }

  async getCosmwasmRpcClient() {
    return await cosmwasm.ClientFactory.createRPCQueryClient({
      rpcEndpoint: this.rpcEndpoint,
    });
  }
}
