import { INetwork } from '../types/INetwork';

export const TICKER_PARAM = {
  label: 'Ticker',
  description:
    'Choose the interval at which the rule will execute. For example, selecting 1 hour means the rule will run every hour.',
  field: 'ticker',
  fieldType: 'TimeDuration',
} as const;

export const MIN_PERC_CHANGE = {
  label: 'Minimum Percentage Change',
  description:
    'Set the minimum percentage change required to trigger an alert.',
  field: 'minPercChange',
  fieldType: 'Number',
} as const;

export const ASSET_SYMBOL_PARAM = {
  label: 'Asset Symbol',
  description: 'Enter the symbol of the asset you wish to track.',
  field: 'assetSymbol',
  fieldType: 'AssetSymbol',
} as const;

export const MIN_USD_PARAM = {
  label: 'Minimum USD',
  description: 'Specify the minimum USD amount needed to trigger an alert.',
  field: 'minUsd',
  fieldType: 'Number',
} as const;

export const NOTIFY_INTERVAL_PARAM = {
  label: 'Notify Interval',
  description:
    'The interval in minutes to notify the user. The default is every 6 hours.',
  field: 'notifyInterval',
  fieldType: 'TimeDuration',
  optional: true,
} as const;

export const MESSAGE_TYPE_SUBSTRING_PARAM = {
  label: 'Message Type (Full or Partial)',
  description:
    'Input a full or partial message type for matching, such as cosmos, gamm, or cosmos.gov.v1.MsgVote.',
  field: 'messageType',
  fieldType: 'Text',
  optional: true,
} as const;

export const SENDER_PARAM = {
  label: 'Sender',
  description: 'Monitor one or more sender addresses.',
  field: 'sender',
  fieldType: 'AddressesContractsList',
  optional: true,
} as const;

export const RECEIVER_PARAM = {
  label: 'Receiver',
  description: 'Monitor one or more receiver addresses.',
  field: 'receiver',
  fieldType: 'AddressesContractsList',
  optional: true,
} as const;

export const NUMERIC_CHANGE_PARAM = {
  label: 'Numeric Change Threshold',
  description:
    'The threshold for the absolute liquidity change in USD for which the rule will trigger',
  field: 'numericChange',
  fieldType: 'Number',
  optional: true,
} as const;

export const PERC_CHANGE_PARAM = {
  label: 'Percentage Change Threshold',
  description:
    'The threshold for the percentage liquidity change in USD for which the rule will trigger',
  field: 'percChange',
  fieldType: 'Number',
  optional: true,
} as const;

export const NOTIFY_DIRECTION_PARAM = {
  label: 'Notify Direction',
  description:
    'By default we will notify when the delta is positive or negative.',
  field: 'notifyDirection' as const,
  fieldType: 'CustomDropdownSingle' as const,
  options: [
    {
      label: 'Positive',
      value: 'positive',
    },
    {
      label: 'Negative',
      value: 'negative',
    },
  ],
  optional: true,
};

export const CW_NETWORKS: INetwork[] = [
  'osmosis-1',
  'cosmoshub-4',
  'dydx-mainnet-1',
  'dymension_1100-1',
  'neutron-1',
  'noble-1',
];

export const COSMOS_NETWORKS: INetwork[] = [
  'osmosis-1',
  'cosmoshub-4',
  'dydx-mainnet-1',
  'dymension_1100-1',
  'neutron-1',
  'noble-1',
];

export const CCV_NETWORKS: INetwork[] = ['cosmoshub-4'];

export const DISTRIBUTION_NETWORKS: INetwork[] = COSMOS_NETWORKS;
export const EVIDENCE_NETWORKS: INetwork[] = COSMOS_NETWORKS;

export const COSMOS_GOV_NETWORKS: INetwork[] = [
  'osmosis-1',
  'celestia',
  'cosmoshub-4',
  'dydx-mainnet-1',
  'dymension_1100-1',
  'noble-1',
  'stride-1',
  'pio-mainnet-1',
  'agoric-3',
];

export const TOKENFACTORY_NETWORKS: INetwork[] = [
  'osmosis-1',
  'neutron-1',
  'stride-1',
  'noble-1',
  'dydx-mainnet-1',
  'celestia',
  'cosmoshub-4',
  'dymension_1100-1',
  'pio-mainnet-1',
];

export const INCENTIVES_NETWORKS: INetwork[] = TOKENFACTORY_NETWORKS;

export const ES_AGGREGATION_NETWORKS: INetwork[] = ['osmosis-1'];

export const WORKSPACES = {
  dev: ['dev', 'cm2u6lm140012p401w7buwwi0', 'range-validators'],
  mars: ['cm239nf300035pd010qsifdyu'],
  neutron: ['neutron-dao-monitoring'],
  osmosis: ['osmosis'],
  dymension: ['dymension'],
  agoric: ['agoric'],
  dydx: ['dydx-v4-perpetuals'],
  provenance: ['provenance-pio'],
  noble: ['noble'],
  squads: [
    'cm2j9b5q1001apc01jrfm7udj',
    'cm3cn4c3n004nqk013h2trq5w',
    'cm915kcmo000lqs01ze0dzes3',
    'cm970slsz0008nm01ddgiaxag',
    'cm970t4qh0002lp013k36bzfm',
    'cmbz00tlh003kqo018tni85i1',
  ],
  hydro: ['cm41amc7c000smo01dnhxtayx'],
  agent_x: ['cm84kd6pp000hqp01f06m4p7p'],
};

export const DYMENSION: INetwork[] = [`dymension_1100-1`];
export const AGORIC: INetwork[] = [`agoric-3`];
export const PROVENANCE: INetwork[] = [`pio-mainnet-1`];
export const NOBLE: INetwork[] = [`noble-1`];
export const DYDX: INetwork[] = [`dydx-mainnet-1`];
export const COSMOSHUB: INetwork[] = [`cosmoshub-4`];

export const SOLANA_SIGNER_PARAM = {
  label: 'Signer',
  description:
    'Monitor one or more signers of the transaction. By default, all signers will be included.',
  field: 'signer',
  fieldType: 'AddressesContractsList',
  optional: true,
} as const;

export const SOLANA_PROGRAM_ID_PARAM = {
  label: 'Program ID',
  description:
    'Specify the program ID to monitor. Providing a specific program ID helps reduce unnecessary notifications. By default, all program IDs are monitored.',
  field: 'programId',
  fieldType: 'ContractList',
  optional: true,
} as const;

export const SOLANA_PROGRAM_ID_PARAM_REQUIRED = {
  label: 'Program ID',
  description:
    'Specify the program ID to monitor. Providing a specific program ID helps avoid excessive notifications.',
  field: 'programId',
  fieldType: 'ContractList',
} as const;

export const SOLANA_INVOLVED_ACCOUNT_PARAM = {
  label: 'Involved Account',
  description:
    'Enter the account address you want to monitor. Leave this field empty to monitor all accounts.',
  field: 'involvedAccount',
  fieldType: 'AddressesContractsList',
  optional: true,
} as const;
