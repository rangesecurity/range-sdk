import {
	createProtobufRpcClient,
	ProtobufRpcClient,
	QueryClient,
} from '@cosmjs/stargate'
import { Tendermint34Client } from '@cosmjs/tendermint-rpc'
import { assert } from 'console'
import { cosmos, cosmwasm } from 'osmojs'
import {
	QueryBalanceResponse,
	QuerySupplyOfResponse,
} from 'osmojs/types/codegen/cosmos/bank/v1beta1/query'
import { QueryValidatorResponse } from 'osmojs/types/codegen/cosmos/staking/v1beta1/query'

class CosmosClient {
	constructor(readonly rpcEndpoint: string) {
		assert(rpcEndpoint, 'rpcEndpoint cannot be empty')
	}

	async balance(address: string, denom: string): Promise<QueryBalanceResponse> {
		const rpc = await this.getRpcClient()
		const BankQueryClientImpl = cosmos.bank.v1beta1.QueryClientImpl
		const queryServiceBank = new BankQueryClientImpl(rpc)
		const res = await queryServiceBank.balance({ address, denom })
		return res
	}

	async supply(denom: string): Promise<QuerySupplyOfResponse> {
		const rpc = await this.getRpcClient()
		const BankQueryClientImpl = cosmos.bank.v1beta1.QueryClientImpl
		const queryServiceBank = new BankQueryClientImpl(rpc)
		const res = await queryServiceBank.supplyOf({ denom })
		return res
	}

	async validator(validatorAddr: string): Promise<QueryValidatorResponse> {
		const rpc = await this.getRpcClient()
		const BankQueryClientImpl = cosmos.staking.v1beta1.QueryClientImpl
		const queryServiceBank = new BankQueryClientImpl(rpc)
		const res = await queryServiceBank.validator({ validatorAddr })
		return res
	}

	private async getRpcClient(): Promise<ProtobufRpcClient> {
		const tmClient = await Tendermint34Client.connect(this.rpcEndpoint)
		const client = new QueryClient(tmClient)
		return createProtobufRpcClient(client)
	}

	async fetchQuery(address: string, queryData: object) {
		const rpc = await this.getRpcClient()
		const ContractQueryImpl = cosmwasm.wasm.v1.QueryClientImpl
		const contractQuery = new ContractQueryImpl(rpc)
		const res = await contractQuery.smartContractState({
			address,
			queryData: Buffer.from(JSON.stringify(queryData)),
		})
		return res
	}
}
