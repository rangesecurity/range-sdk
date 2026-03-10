import { INetwork } from './INetwork';

// For solana network, address ~ account and contract ~ program
export type FieldType =
  | 'Address' // single address selector for given network
  | 'AddressList' // multi address selector for given network
  | 'Number' // number input
  | 'Contract' // single contract selector for given network
  | 'ContractList' // multi contract selector for given network
  | 'AddressContract' // addresses + contracts combined
  | 'AddressesContractsList' // addresses + contracts combined
  | 'CosmosAddress' // multi address selector for all networks
  | 'CosmosAddressList' // multi address selector for all networks
  | 'AssetSymbol'
  | 'TimeDuration'
  | 'Text'
  | 'SolanaMint'
  | 'ProgramInstructionOptions'
  | 'CustomDropdownSingle' // todo: options array of format {label, value, icon} will be provided
  | 'CustomDropdownMulti' // todo: options array of format {label, value, icon} will be provided
  | 'Boolean'; // todo: show a checkbox

export const FieldTypeToTSType: Record<FieldType, string> = {
  Address: 'string',
  AddressList: 'string[]',
  Number: 'number',
  Contract: 'string',
  ContractList: 'string[]',
  AddressContract: 'string',
  AddressesContractsList: 'string[]',
  AssetSymbol: 'string',
  TimeDuration: 'number',
  Text: 'string',
  SolanaMint: 'string',
  ProgramInstructionOptions: 'string[]',
  CustomDropdownSingle: 'string',
  CustomDropdownMulti: 'string[]',
  CosmosAddress: 'string',
  CosmosAddressList: 'string[]',
  Boolean: 'boolean',
} as const;

type RuleTag =
  // Blockchain-specific
  | 'evm'
  | 'solana'
  | 'osmosis'
  | 'neutron'
  | 'stride'
  | 'cosmwasm'
  | 'ibc'
  | 'sui'
  | 'aptos'
  | 'sei'
  | 'injective'
  | 'celestia'
  | 'bitcoin'

  // Protocol Specific
  | 'mars'
  | 'astroport'
  | 'red-bank'
  | 'dex'
  | 'money market'
  | 'lending'
  | 'ics'

  // Token
  | 'token'
  | 'cw20'
  | 'balance'
  | 'tokenfactory'

  // NFT / Token operations
  | 'nft'
  | 'mint'
  | 'burn'
  | 'airdrop'

  // Financial operations
  | 'economic'
  | 'distribution'
  | 'incentives'
  | 'liquidation'
  | 'trading'

  // DeFi
  | 'defi'
  | 'swap'
  | 'yield'
  | 'vault'
  | 'amm'
  | 'perpetuals'
  | 'borrowing'
  | 'flashloan'

  // Governance
  | 'governance'
  | 'community'
  | 'community pool'
  | 'spend'
  | 'admin'
  | 'multisig'
  | 'validator'
  | 'evidence'
  | 'upgrade'
  | 'stake'
  | 'delegate'
  | 'events'
  | 'proposal'
  | 'vote'
  | 'emergency'

  // Security and risk management
  | 'security'
  | 'risk'
  | 'halt'
  | 'sanctions'
  | 'blacklist'
  | 'exploit'
  | 'mev'
  | 'reentrancy'

  // EVM / Safe
  | 'gnosis-safe'
  | 'proxy'
  | 'access-control'
  | 'ownership'
  | 'timelock'

  // Cross Chain
  | 'bridges'
  | 'contract'
  | 'relayer'
  | 'oracle'

  // Analytics and monitoring
  | 'analytics'
  | 'aggregation'
  | 'high volume'
  | 'account'
  | 'program'
  | 'unusual'
  | 'spl-token'
  | 'error'
  | 'authority'
  | 'freeze'
  | 'safe'
  | 'squads-multisig'
  | 'squads'
  | 'hydro'
  | 'liquidity-anomaly'
  | 'volume-anomaly'
  | 'price-anomaly'
  | 'latency'
  | 'downtime'
  | 'gas'
  | 'fee'

  // Stablecoin
  | 'stablecoin'
  | 'depeg'
  | 'price-deviation'
  | 'peg-monitor'
  | 'reserve'
  | 'backing'
  | 'redemption'

  // Transfer
  | 'transfer'

  // Treasury / EOA
  | 'eoa'
  | 'treasury'
  | 'treasury-management'
  | 'whale'
  | 'large-transfer'
  | 'outflow'
  | 'inflow'
  | 'dormant-account'
  | 'threshold'

  // Custom tags (allows any string)
  | (string & {});

interface IParam<T> {
  label: string;
  description: string;
  field: T;
  fieldType: FieldType;
  optional?: boolean; // note: by default all params are required
  options?: { label: string; value: string; icon?: string }[];
}

export interface IRule<T = any> {
  tags: RuleTag[];
  type: string;
  networks: INetwork[];
  label: string;
  description: string;
  parameters: IParam<T>[];
  workspaces?: string[];
  severity?: 'high' | 'medium' | 'low' | 'info' | 'critical';
  trigger?: 'BLOCK' | 'TICK';
}
