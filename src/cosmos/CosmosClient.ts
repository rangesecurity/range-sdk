import { cosmos, cosmwasm, ibc, osmosis } from 'osmojs';
import { assert } from 'console';
import { QueryValidatorResponse } from 'osmojs/types/codegen/cosmos/staking/v1beta1/query';
import { QueryContractInfoResponse } from 'osmojs/types/codegen/cosmwasm/wasm/v1/query';
import {
  QueryBalanceResponse,
  QuerySupplyOfResponse,
} from 'osmojs/types/codegen/cosmos/bank/v1beta1/query';
import axios from 'axios';

export class CosmosClient {
  constructor(readonly rpcEndpoint: string) {
    if (!rpcEndpoint) {
      throw new Error('rpcEndpoint cannot be empty');
    }
  }

  async balance(address: string, denom: string): Promise<QueryBalanceResponse> {
    const client = await this.getCosmosRpcClient();
    return client.cosmos.bank.v1beta1.balance({
      address,
      denom,
    });
  }

  async supply(denom: string): Promise<QuerySupplyOfResponse> {
    const client = await this.getCosmosRpcClient();
    return client.cosmos.bank.v1beta1.supplyOf({
      denom,
    });
  }

  async validator(validatorAddr: string): Promise<QueryValidatorResponse> {
    const client = await this.getCosmosRpcClient();
    return client.cosmos.staking.v1beta1.validator({
      validatorAddr,
    });
  }

  async contractInfo(address: string): Promise<QueryContractInfoResponse> {
    const client = await this.getCosmwasmRpcClient();
    return client.cosmwasm.wasm.v1.contractInfo({
      address,
    });
  }

  async fetchContractQuery(address: string, queryData: object) {
    const client = await this.getCosmwasmRpcClient();
    const res = await client.cosmwasm.wasm.v1.smartContractState({
      address,
      queryData: Buffer.from(JSON.stringify(queryData)),
    });

    return JSON.parse(Buffer.from(res.data).toString('utf8'));
  }

  async fetchLatestHeight() {
    const res = await axios.get(`${this.rpcEndpoint}/status`);
    return res.data?.result.sync_info.latest_block_height;
  }

  getCosmosRpcClient() {
    return cosmos.ClientFactory.createRPCQueryClient({
      rpcEndpoint: this.rpcEndpoint,
    });
  }

  getOsmosisRpcClient() {
    return osmosis.ClientFactory.createRPCQueryClient({
      rpcEndpoint: this.rpcEndpoint,
    });
  }

  getIbcRpcClient() {
    return ibc.ClientFactory.createRPCQueryClient({
      rpcEndpoint: this.rpcEndpoint,
    });
  }

  getCosmwasmRpcClient() {
    return cosmwasm.ClientFactory.createRPCQueryClient({
      rpcEndpoint: this.rpcEndpoint,
    });
  }
}
