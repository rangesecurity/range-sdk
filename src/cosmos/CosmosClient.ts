import { cosmos, cosmwasm, ibc, osmosis } from 'osmojs';
import axios from 'axios';
import {
  QueryBalanceResponse,
  QuerySupplyOfResponse,
} from 'osmojs/cosmos/bank/v1beta1/query';
import { QueryValidatorResponse } from 'osmojs/cosmos/staking/v1beta1/query';
import { QueryContractInfoResponse } from 'osmojs/cosmwasm/wasm/v1/query';

export class CosmosClient {
  constructor(
    readonly rpcEndpoint: string,
    readonly lcd?: string,
  ) {
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

  async fetchAllContractStates(address: string) {
    let key: any = [];

    const client = await this.getCosmwasmRpcClient();

    let models: any = [];
    let parsedModels: any = [];

    let iterationCount = 0;
    while (iterationCount < 20) {
      iterationCount++;
      try {
        const res = await client.cosmwasm.wasm.v1.allContractState({
          address,
          pagination: {
            countTotal: false,
            key,
            limit: 100n,
            offset: 0n,
            reverse: false,
          },
        });
        models = [...models, ...res.models];
        parsedModels = [
          ...parsedModels,
          ...res.models.map(({ key, value }) => {
            return {
              key: Buffer.from(key).toString('utf8'),
              value: JSON.parse(Buffer.from(value).toString('utf8')),
            };
          }),
        ];

        key = res.pagination?.nextKey;
      } catch (error) {
        break;
      }
    }

    return parsedModels;
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

  async getValidators(): Promise<
    | {
        address: string;
        start_height: string;
        index_offset: string;
        jailed_until: string;
        tombstoned: boolean;
        missed_blocks_counter: string;
      }[]
    | null
  > {
    if (!this.lcd) return Promise.resolve(null);
    const res = await axios.get(
      `${this.lcd}/cosmos/slashing/v1beta1/signing_infos?pagination.limit=1000000`,
    );
    return res.data.info;
  }
}
