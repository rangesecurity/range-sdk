import { IRangeMessage } from '../IRangeMessage';

enum OsmoTest5TrxMsgTypes {
  CosmosBankV1beta1MsgSend = 'cosmos.bank.v1beta1.MsgSend',
  CosmosDistributionV1beta1MsgWithdrawDelegatorReward = 'cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
  CosmosGovV1beta1MsgSubmitProposal = 'cosmos.gov.v1beta1.MsgSubmitProposal',
  CosmosGovV1beta1MsgVote = 'cosmos.gov.v1beta1.MsgVote',
  CosmosSlashingV1beta1MsgUnjail = 'cosmos.slashing.v1beta1.MsgUnjail',
  CosmosStakingV1beta1MsgBeginRedelegate = 'cosmos.staking.v1beta1.MsgBeginRedelegate',
  CosmosStakingV1beta1MsgCreateValidator = 'cosmos.staking.v1beta1.MsgCreateValidator',
  CosmosStakingV1beta1MsgDelegate = 'cosmos.staking.v1beta1.MsgDelegate',
  CosmosStakingV1beta1MsgUndelegate = 'cosmos.staking.v1beta1.MsgUndelegate',
  CosmosWasmV1MsgExecuteContract = 'cosmwasm.wasm.v1.MsgExecuteContract',
  CosmosWasmV1MsgInstantiateContract = 'cosmwasm.wasm.v1.MsgInstantiateContract',
  CosmosWasmV1MsgMigrateContract = 'cosmwasm.wasm.v1.MsgMigrateContract',
  CosmWasmWasmV1MsgStoreCode = 'cosmwasm.wasm.v1.MsgStoreCode',
  IbcApplicationsTransferV1MsgTransfer = 'ibc.applications.transfer.v1.MsgTransfer',
  IbcCoreChannelV1MsgAcknowledgement = 'ibc.core.channel.v1.MsgAcknowledgement',
  IbcCoreChannelV1MsgChannelCloseConfirm = 'ibc.core.channel.v1.MsgChannelCloseConfirm',
  IbcCoreChannelV1MsgChannelOpenAck = 'ibc.core.channel.v1.MsgChannelOpenAck',
  IbcCoreChannelV1MsgChannelOpenConfirm = 'ibc.core.channel.v1.MsgChannelOpenConfirm',
  IbcCoreChannelV1MsgChannelOpenInit = 'ibc.core.channel.v1.MsgChannelOpenInit',
  IbcCoreChannelV1MsgChannelOpenTry = 'ibc.core.channel.v1.MsgChannelOpenTry',
  IbcCoreChannelV1MsgRecvPacket = 'ibc.core.channel.v1.MsgRecvPacket',
  IbcCoreChannelV1MsgTimeout = 'ibc.core.channel.v1.MsgTimeout',
  IbcCoreClientV1MsgCreateClient = 'ibc.core.client.v1.MsgCreateClient',
  IbcCoreClientV1MsgUpdateClient = 'ibc.core.client.v1.MsgUpdateClient',
  IbcCoreConnectionV1MsgConnectionOpenAck = 'ibc.core.connection.v1.MsgConnectionOpenAck',
  IbcCoreConnectionV1MsgConnectionOpenConfirm = 'ibc.core.connection.v1.MsgConnectionOpenConfirm',
  IbcCoreConnectionV1MsgConnectionOpenInit = 'ibc.core.connection.v1.MsgConnectionOpenInit',
  IbcCoreConnectionV1MsgConnectionOpenTry = 'ibc.core.connection.v1.MsgConnectionOpenTry',
  OsmosisConcentratedLiquidityPoolModelConcentratedV1beta1MsgCreateConcentratedPool = 'osmosis.concentratedliquidity.poolmodel.concentrated.v1beta1.MsgCreateConcentratedPool',
  OsmosisConcentratedLiquidityV1Beta1MsgCollectIncentives = 'osmosis.concentratedliquidity.v1beta1.MsgCollectIncentives',
  OsmosisCosmwasmPoolV1Beta1MsgCreateCosmWasmPool = 'osmosis.cosmwasmpool.v1beta1.MsgCreateCosmWasmPool',
  OsmosisGammV1Beta1MsgJoinPool = 'osmosis.gamm.v1beta1.MsgJoinPool',
  OsmosisGammV1beta1MsgSwapExactAmountIn = 'osmosis.gamm.v1beta1.MsgSwapExactAmountIn',
  OsmosisPoolManagerV1beta1MsgSwapExactAmountIn = 'osmosis.poolmanager.v1beta1.MsgSwapExactAmountIn',
  OsmosisTokenFactoryV1beta1MsgCreateDenom = 'osmosis.tokenfactory.v1beta1.MsgCreateDenom',
  OsmosisTokenFactoryV1beta1MsgMint = 'osmosis.tokenfactory.v1beta1.MsgMint',
  OsmosisValsetprefV1beta1MsgDelegateToValidatorSet = 'osmosis.valsetpref.v1beta1.MsgDelegateToValidatorSet',
  OsmosisValsetprefV1beta1MsgSetValidatorSetPreference = 'osmosis.valsetpref.v1beta1.MsgSetValidatorSetPreference',
}

export type OsmoTest5TrxMsg =
  | OsmoTest5TrxMsgCosmosBankV1beta1MsgSend
  | OsmoTest5TrxMsgCosmosDistributionV1beta1MsgWithdrawDelegatorReward
  | OsmoTest5TrxMsgCosmosGovV1beta1MsgSubmitProposal
  | OsmoTest5TrxMsgCosmosGovV1beta1MsgVote
  | OsmoTest5TrxMsgCosmosSlashingV1beta1MsgUnjail
  | OsmoTest5TrxMsgCosmosStakingV1beta1MsgBeginRedelegate
  | OsmoTest5TrxMsgCosmosStakingV1beta1MsgCreateValidator
  | OsmoTest5TrxMsgCosmosStakingV1beta1MsgDelegate
  | OsmoTest5TrxMsgCosmosStakingV1beta1MsgUndelegate
  | OsmoTest5TrxMsgCosmosWasmV1MsgExecuteContract
  | OsmoTest5TrxMsgCosmosWasmV1MsgInstantiateContract
  | OsmoTest5TrxMsgCosmosWasmV1MsgMigrateContract
  | OsmoTest5TrxMsgCosmWasmWasmV1MsgStoreCode
  | OsmoTest5TrxMsgIbcApplicationsTransferV1MsgTransfer
  | OsmoTest5TrxMsgIbcCoreChannelV1MsgAcknowledgement
  | OsmoTest5TrxMsgIbcCoreChannelV1MsgChannelCloseConfirm
  | OsmoTest5TrxMsgIbcCoreChannelV1MsgChannelOpenAck
  | OsmoTest5TrxMsgIbcCoreChannelV1MsgChannelOpenConfirm
  | OsmoTest5TrxMsgIbcCoreChannelV1MsgChannelOpenInit
  | OsmoTest5TrxMsgIbcCoreChannelV1MsgChannelOpenTry
  | OsmoTest5TrxMsgIbcCoreChannelV1MsgRecvPacket
  | OsmoTest5TrxMsgIbcCoreChannelV1MsgTimeout
  | OsmoTest5TrxMsgIbcCoreClientV1MsgCreateClient
  | OsmoTest5TrxMsgIbcCoreClientV1MsgUpdateClient
  | OsmoTest5TrxMsgIbcCoreConnectionV1MsgConnectionOpenAck
  | OsmoTest5TrxMsgIbcCoreConnectionV1MsgConnectionOpenConfirm
  | OsmoTest5TrxMsgIbcCoreConnectionV1MsgConnectionOpenInit
  | OsmoTest5TrxMsgIbcCoreConnectionV1MsgConnectionOpenTry
  | OsmoTest5TrxMsgOsmosisConcentratedLiquidityPoolModelConcentratedV1beta1MsgCreateConcentratedPool
  | OsmoTest5TrxMsgOsmosisConcentratedLiquidityV1Beta1MsgCollectIncentives
  | OsmoTest5TrxMsgOsmosisCosmwasmPoolV1Beta1MsgCreateCosmWasmPool
  | OsmoTest5TrxMsgOsmosisGammV1Beta1MsgJoinPool
  | OsmoTest5TrxMsgOsmosisGammV1beta1MsgSwapExactAmountIn
  | OsmoTest5TrxMsgOsmosisPoolManagerV1beta1MsgSwapExactAmountIn
  | OsmoTest5TrxMsgOsmosisTokenFactoryV1beta1MsgCreateDenom
  | OsmoTest5TrxMsgOsmosisTokenFactoryV1beta1MsgMint
  | OsmoTest5TrxMsgOsmosisValsetprefV1beta1MsgDelegateToValidatorSet
  | OsmoTest5TrxMsgOsmosisValsetprefV1beta1MsgSetValidatorSetPreference;

// types for mgs type:: /cosmos.bank.v1beta1.MsgSend
interface OsmoTest5TrxMsgCosmosBankV1beta1MsgSend extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.CosmosBankV1beta1MsgSend;
  data: {
    amount: { denom: string; amount: string }[];
    toAddress: string;
    fromAddress: string;
  };
}

// types for mgs type:: /cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward
interface OsmoTest5TrxMsgCosmosDistributionV1beta1MsgWithdrawDelegatorReward
  extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.CosmosDistributionV1beta1MsgWithdrawDelegatorReward;
  data: {
    delegatorAddress: string;
    validatorAddress: string;
  };
}

// types for mgs type:: /cosmos.gov.v1beta1.MsgSubmitProposal
interface OsmoTest5TrxMsgCosmosGovV1beta1MsgSubmitProposal
  extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.CosmosGovV1beta1MsgSubmitProposal;
  data: {
    '@type': string;
    content: {
      plan: {
        info: string;
        name: string;
        time: string;
        height: string;
        upgraded_client_state?: unknown;
      };
      '@type': string;
      title: string;
      description: string;
    };
    proposer: string;
    initial_deposit: { denom: string; amount: string }[];
  };
}

// types for mgs type:: /cosmos.gov.v1beta1.MsgVote
interface OsmoTest5TrxMsgCosmosGovV1beta1MsgVote extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.CosmosGovV1beta1MsgVote;
  data: {
    voter: string;
    option: string;
    proposalId: string;
  };
}

// types for mgs type:: /cosmos.slashing.v1beta1.MsgUnjail
interface OsmoTest5TrxMsgCosmosSlashingV1beta1MsgUnjail extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.CosmosSlashingV1beta1MsgUnjail;
  data: {
    validatorAddr: string;
  };
}

// types for mgs type:: /cosmos.staking.v1beta1.MsgBeginRedelegate
interface OsmoTest5TrxMsgCosmosStakingV1beta1MsgBeginRedelegate
  extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.CosmosStakingV1beta1MsgBeginRedelegate;
  data: {
    amount: { denom: string; amount: string };
    delegatorAddress: string;
    validatorDstAddress: string;
    validatorSrcAddress: string;
  };
}

// types for mgs type:: /cosmos.staking.v1beta1.MsgCreateValidator
interface OsmoTest5TrxMsgCosmosStakingV1beta1MsgCreateValidator
  extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.CosmosStakingV1beta1MsgCreateValidator;
  data: {
    '@type': string;
    value: { denom: string; amount: string };
    pubkey: { key: string; '@type': string };
    commission: { rate: string; max_rate: string; max_change_rate: string };
    description: {
      details: string;
      moniker: string;
      website: string;
      identity: string;
      security_contact: string;
    };
    delegator_address: string;
    validator_address: string;
    min_self_delegation: string;
  };
}

// types for mgs type:: /cosmos.staking.v1beta1.MsgDelegate
interface OsmoTest5TrxMsgCosmosStakingV1beta1MsgDelegate extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.CosmosStakingV1beta1MsgDelegate;
  data: {
    amount: { denom: string; amount: string };
    delegatorAddress: string;
    validatorAddress: string;
  };
}

// types for mgs type:: /cosmos.staking.v1beta1.MsgUndelegate
interface OsmoTest5TrxMsgCosmosStakingV1beta1MsgUndelegate
  extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.CosmosStakingV1beta1MsgUndelegate;
  data: {
    amount: { denom: string; amount: string };
    delegatorAddress: string;
    validatorAddress: string;
  };
}

// types for mgs type:: /cosmwasm.wasm.v1.MsgExecuteContract
interface OsmoTest5TrxMsgCosmosWasmV1MsgExecuteContract extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.CosmosWasmV1MsgExecuteContract;
  data: {
    msg: string;
    funds: { denom: string; amount: string }[];
    sender: string;
    contract: string;
  };
}

// types for mgs type:: /cosmwasm.wasm.v1.MsgInstantiateContract
interface OsmoTest5TrxMsgCosmosWasmV1MsgInstantiateContract
  extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.CosmosWasmV1MsgInstantiateContract;
  data: {
    msg: string;
    admin: string;
    funds: { denom: string; amount: string }[];
    label: string;
    codeId: string;
    sender: string;
  };
}

// types for mgs type:: /cosmwasm.wasm.v1.MsgMigrateContract
interface OsmoTest5TrxMsgCosmosWasmV1MsgMigrateContract extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.CosmosWasmV1MsgMigrateContract;
  data: {
    msg: string;
    codeId: string;
    sender: string;
    contract: string;
  };
}

// types for mgs type:: /cosmwasm.wasm.v1.MsgStoreCode
interface OsmoTest5TrxMsgCosmWasmWasmV1MsgStoreCode extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.CosmWasmWasmV1MsgStoreCode;
  data: {
    sender: string;
    wasmByteCode: string;
  };
}

// types for mgs type:: /ibc.applications.transfer.v1.MsgTransfer
interface OsmoTest5TrxMsgIbcApplicationsTransferV1MsgTransfer
  extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.IbcApplicationsTransferV1MsgTransfer;
  data: {
    token: {
      denom: string;
      amount: string;
    };
    sender: string;
    receiver: string;
    sourcePort: string;
    sourceChannel: string;
    timeoutTimestamp: string;
  };
}

// types for mgs type:: /ibc.core.channel.v1.MsgAcknowledgement
interface OsmoTest5TrxMsgIbcCoreChannelV1MsgAcknowledgement
  extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.IbcCoreChannelV1MsgAcknowledgement;
  data: {
    packet: {
      data: string;
      sequence: string;
      sourcePort: string;
      sourceChannel: string;
      timeoutHeight: { revisionHeight: string; revisionNumber: string };
      destinationPort: string;
      timeoutTimestamp: string;
      destinationChannel: string;
    };
    signer: string;
    proofAcked: string;
    proofHeight: { revisionHeight: string; revisionNumber: string };
    acknowledgement: string;
  };
}

// types for mgs type:: /ibc.core.channel.v1.MsgChannelCloseConfirm
interface OsmoTest5TrxMsgIbcCoreChannelV1MsgChannelCloseConfirm
  extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.IbcCoreChannelV1MsgChannelCloseConfirm;
  data: {
    portId: string;
    signer: string;
    channelId: string;
    proofInit: string;
    proofHeight: { revisionHeight: string; revisionNumber: string };
  };
}

// types for mgs type:: /ibc.core.channel.v1.MsgChannelOpenAck
interface OsmoTest5TrxMsgIbcCoreChannelV1MsgChannelOpenAck
  extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.IbcCoreChannelV1MsgChannelOpenAck;
  data: {
    portId: string;
    signer: string;
    proofTry: string;
    channelId: string;
    proofHeight: {
      revisionHeight: string;
      revisionNumber: string;
    };
    counterpartyVersion: string;
    counterpartyChannelId: string;
  };
}

// types for mgs type:: /ibc.core.channel.v1.MsgChannelOpenConfirm
interface OsmoTest5TrxMsgIbcCoreChannelV1MsgChannelOpenConfirm
  extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.IbcCoreChannelV1MsgChannelOpenConfirm;
  data: {
    portId: string;
    signer: string;
    proofAck: string;
    channelId: string;
    proofHeight: {
      revisionHeight: string;
      revisionNumber: string;
    };
  };
}

// types for mgs type:: /ibc.core.channel.v1.MsgChannelOpenInit
interface OsmoTest5TrxMsgIbcCoreChannelV1MsgChannelOpenInit
  extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.IbcCoreChannelV1MsgChannelOpenInit;
  data: {
    portId: string;
    signer: string;
    channel: {
      state: string;
      version: string;
      ordering: string;
      counterparty: {
        portId: string;
      };
      connectionHops: string[];
    };
  };
}

// types for mgs type:: /ibc.core.channel.v1.MsgChannelOpenTry
interface OsmoTest5TrxMsgIbcCoreChannelV1MsgChannelOpenTry
  extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.IbcCoreChannelV1MsgChannelOpenTry;
  data: {
    portId: string;
    signer: string;
    channel: {
      state: string;
      version: string;
      ordering: string;
      counterparty: {
        portId: string;
        channelId: string;
      };
      connectionHops: string[];
    };
    proofInit: string;
    proofHeight: {
      revisionHeight: string;
      revisionNumber: string;
    };
    counterpartyVersion: string;
  };
}

// types for msg type: /ibc.core.channel.v1.MsgRecvPacket
interface OsmoTest5TrxMsgIbcCoreChannelV1MsgRecvPacket extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.IbcCoreChannelV1MsgRecvPacket;
  data: {
    packet: {
      data: string;
      sequence: string;
      sourcePort: string;
      sourceChannel: string;
      timeoutHeight: Record<string, unknown>;
      destinationPort: string;
      timeoutTimestamp: string;
      destinationChannel: string;
    };
    signer: string;
    proofHeight: { revisionHeight: string; revisionNumber: string };
    proofCommitment: string;
  };
}

// types for msg type: /ibc.core.channel.v1.MsgTimeout
interface OsmoTest5TrxMsgIbcCoreChannelV1MsgTimeout extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.IbcCoreChannelV1MsgTimeout;
  data: {
    packet: {
      data: string;
      sequence: string;
      sourcePort: string;
      sourceChannel: string;
      timeoutHeight: Record<string, unknown>;
      destinationPort: string;
      timeoutTimestamp: string;
      destinationChannel: string;
    };
    signer: string;
    proofHeight: { revisionHeight: string; revisionNumber: string };
    proofUnreceived: string;
    nextSequenceRecv: string;
  };
}

// types for msg type: /ibc.core.client.v1.MsgCreateClient
interface OsmoTest5TrxMsgIbcCoreClientV1MsgCreateClient extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.IbcCoreClientV1MsgCreateClient;
  data: {
    '@type': string;
    signer: string;
    client_state: {
      '@type': string;
      chain_id: string;
      proof_specs: {
        leaf_spec: {
          hash: string;
          length: string;
          prefix: string;
          prehash_key: string;
          prehash_value: string;
        };
        max_depth: number;
        min_depth: number;
        inner_spec: {
          hash: string;
          child_size: number;
          child_order: number[];
          empty_child?: unknown;
          max_prefix_length: number;
          min_prefix_length: number;
        };
        prehash_key_before_comparison: boolean;
      }[];
      trust_level: { numerator: string; denominator: string };
      upgrade_path: string[];
      frozen_height: { revisionHeight: string; revisionNumber: string };
      latest_height: { revisionHeight: string; revisionNumber: string };
      max_clock_drift: string;
      trusting_period: string;
      unbonding_period: string;
      allow_update_after_expiry: boolean;
      allow_update_after_misbehaviour: boolean;
    };
    consensus_state: {
      root: { hash: string };
      '@type': string;
      timestamp: string;
      next_validators_hash: string;
    };
  };
}

// types for msg type:: /ibc.core.client.v1.MsgUpdateClient
interface OsmoTest5TrxMsgIbcCoreClientV1MsgUpdateClient extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.IbcCoreClientV1MsgUpdateClient;
  data: {
    '@type': string;
    signer: string;
    client_id: string;
    client_message: {
      '@type': string;
      signed_header: {
        commit: {
          round: number;
          height: string;
          block_id: {
            hash: string;
            part_set_header: {
              hash: string;
              total: number;
            };
          };
          signatures: {
            signature: string;
            timestamp: string;
            block_id_flag: string;
            validator_address: string;
          }[];
        };
        header: {
          time: string;
          height: string;
          version: {
            app: string;
            block: string;
          };
          app_hash: string;
          chain_id: string;
          data_hash: string;
          evidence_hash: string;
          last_block_id: {
            hash: string;
            part_set_header: {
              hash: string;
              total: number;
            };
          };
          consensus_hash: string;
          validators_hash: string;
          last_commit_hash: string;
          proposer_address: string;
          last_results_hash: string;
          next_validators_hash: string;
        };
      };
      validator_set: {
        proposer: {
          address: string;
          pub_key: {
            ed25519: string;
          };
          voting_power: string;
          proposer_priority: string;
        };
        validators: {
          address: string;
          pub_key: {
            ed25519: string;
          };
          voting_power: string;
          proposer_priority: string;
        }[];
        total_voting_power: string;
      };
      trusted_height: {
        revision_height: string;
        revision_number: string;
      };
      trusted_validators: {
        proposer: {
          address: string;
          pub_key: {
            ed25519: string;
          };
          voting_power: string;
          proposer_priority: string;
        };
        validators: {
          address: string;
          pub_key: {
            ed25519: string;
          };
          voting_power: string;
          proposer_priority: string;
        }[];
        total_voting_power: string;
      };
    };
  };
}

// types for msg type:: /ibc.core.connection.v1.MsgConnectionOpenAck
interface OsmoTest5TrxMsgIbcCoreConnectionV1MsgConnectionOpenAck
  extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.IbcCoreConnectionV1MsgConnectionOpenAck;
  data: {
    '@type': string;
    signer: string;
    version: {
      features: string[];
      identifier: string;
    };
    proof_try: string;
    client_state: {
      '@type': string;
      chain_id: string;
      proof_specs: {
        leaf_spec: {
          hash: string;
          length: string;
          prefix: string;
          prehash_key: string;
          prehash_value: string;
        };
        max_depth: number;
        min_depth: number;
        inner_spec: {
          hash: string;
          child_size: number;
          child_order: number[];
          empty_child?: unknown;
          max_prefix_length: number;
          min_prefix_length: number;
        };
        prehash_key_before_comparison: boolean;
      }[];
      trust_level: {
        numerator: string;
        denominator: string;
      };
      upgrade_path: string[];
      frozen_height: {
        revision_height: string;
        revision_number: string;
      };
      latest_height: {
        revision_height: string;
        revision_number: string;
      };
      max_clock_drift: string;
      trusting_period: string;
      unbonding_period: string;
      allow_update_after_expiry: boolean;
      allow_update_after_misbehaviour: boolean;
    };
    proof_client: string;
    proof_height: {
      revision_height: string;
      revision_number: string;
    };
    connection_id: string;
    proof_consensus: string;
    consensus_height: {
      revision_height: string;
      revision_number: string;
    };
    counterparty_connection_id: string;
    host_consensus_state_proof?: unknown;
  };
}

// types for msg type:: /ibc.core.connection.v1.MsgConnectionOpenConfirm
interface OsmoTest5TrxMsgIbcCoreConnectionV1MsgConnectionOpenConfirm
  extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.IbcCoreConnectionV1MsgConnectionOpenConfirm;
  data: {
    signer: string;
    proofAck: string;
    proofHeight: { revisionHeight: string; revisionNumber: string };
    connectionId: string;
  };
}

// types for msg type:: /ibc.core.connection.v1.MsgConnectionOpenInit
interface OsmoTest5TrxMsgIbcCoreConnectionV1MsgConnectionOpenInit
  extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.IbcCoreConnectionV1MsgConnectionOpenInit;
  data: {
    signer: string;
    version: {
      features: string[];
      identifier: string;
    };
    clientId: string;
    counterparty: {
      prefix: {
        keyPrefix: string;
      };
      clientId: string;
    };
  };
}

// types for msg type:: /ibc.core.connection.v1.MsgConnectionOpenTry
interface OsmoTest5TrxMsgIbcCoreConnectionV1MsgConnectionOpenTry
  extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.IbcCoreConnectionV1MsgConnectionOpenTry;
  data: {
    '@type': string;
    signer: string;
    client_id: string;
    proof_init: string;
    client_state: {
      '@type': string;
      chain_id: string;
      proof_specs: {
        leaf_spec: {
          hash: string;
          length: string;
          prefix: string;
          prehash_key: string;
          prehash_value: string;
        };
        max_depth: number;
        min_depth: number;
        inner_spec: {
          hash: string;
          child_size: number;
          child_order: number[];
          max_prefix_length: number;
          min_prefix_length: number;
        };
        prehash_key_before_comparison: boolean;
      }[];
      trust_level: {
        numerator: string;
        denominator: string;
      };
      upgrade_path: string[];
      frozen_height: {
        revision_height: string;
        revision_number: string;
      };
      latest_height: {
        revision_height: string;
        revision_number: string;
      };
      max_clock_drift: string;
      trusting_period: string;
      unbonding_period: string;
      allow_update_after_expiry: boolean;
      allow_update_after_misbehaviour: boolean;
    };
    counterparty: {
      prefix: {
        key_prefix: string;
      };
      client_id: string;
      connection_id: string;
    };
    delay_period: string;
    proof_client: string;
    proof_height: {
      revision_height: string;
      revision_number: string;
    };
    proof_consensus: string;
    consensus_height: {
      revision_height: string;
      revision_number: string;
    };
    counterparty_versions: {
      features: string[];
      identifier: string;
    }[];
    previous_connection_id: string;
  };
}

// types for msg type:: /osmosis.concentratedliquidity.poolmodel.concentrated.v1beta1.MsgCreateConcentratedPool
interface OsmoTest5TrxMsgOsmosisConcentratedLiquidityPoolModelConcentratedV1beta1MsgCreateConcentratedPool
  extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.OsmosisConcentratedLiquidityPoolModelConcentratedV1beta1MsgCreateConcentratedPool;
  data: {
    denom0: string;
    denom1: string;
    sender: string;
    tickSpacing: string;
    spreadFactor: string;
  };
}

// types for mgs type:: /osmosis.concentratedliquidity.v1beta1.MsgCollectIncentives
interface OsmoTest5TrxMsgOsmosisConcentratedLiquidityV1Beta1MsgCollectIncentives
  extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.OsmosisConcentratedLiquidityV1Beta1MsgCollectIncentives;
  data: {
    sender: string;
    positionIds: string[];
  };
}

// types for mgs type:: /osmosis.cosmwasmpool.v1beta1.MsgCreateCosmWasmPool
interface OsmoTest5TrxMsgOsmosisCosmwasmPoolV1Beta1MsgCreateCosmWasmPool
  extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.OsmosisCosmwasmPoolV1Beta1MsgCreateCosmWasmPool;
  data: {
    codeId: string;
    sender: string;
    instantiateMsg: string;
  };
}

// types for mgs type:: /osmosis.gamm.v1beta1.MsgJoinPool
interface OsmoTest5TrxMsgOsmosisGammV1Beta1MsgJoinPool extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.OsmosisGammV1Beta1MsgJoinPool;
  data: {
    poolId: string;
    sender: string;
    tokenInMaxs: {
      denom: string;
      amount: string;
    }[];
    shareOutAmount: string;
  };
}

// types for msg type:: /osmosis.gamm.v1beta1.MsgSwapExactAmountIn
interface OsmoTest5TrxMsgOsmosisGammV1beta1MsgSwapExactAmountIn {
  type: OsmoTest5TrxMsgTypes.OsmosisGammV1beta1MsgSwapExactAmountIn;
  data: {
    routes: Array<{ poolId: string; tokenOutDenom: string }>;
    sender: string;
    tokenIn: { denom: string; amount: string };
    tokenOutMinAmount: string;
  };
}

// types for msg type:: /osmosis.poolmanager.v1beta1.MsgSwapExactAmountIn
interface OsmoTest5TrxMsgOsmosisPoolManagerV1beta1MsgSwapExactAmountIn {
  type: OsmoTest5TrxMsgTypes.OsmosisPoolManagerV1beta1MsgSwapExactAmountIn;
  data: {
    routes: Array<{ poolId: string; tokenOutDenom: string }>;
    sender: string;
    tokenIn: { denom: string; amount: string };
    tokenOutMinAmount: string;
  };
}

// types for msg type:: /osmosis.tokenfactory.v1beta1.MsgCreateDenom
interface OsmoTest5TrxMsgOsmosisTokenFactoryV1beta1MsgCreateDenom {
  type: OsmoTest5TrxMsgTypes.OsmosisTokenFactoryV1beta1MsgCreateDenom;
  data: {
    sender: string;
    subdenom: string;
  };
}

// types for mgs type:: /osmosis.tokenfactory.v1beta1.MsgMint
interface OsmoTest5TrxMsgOsmosisTokenFactoryV1beta1MsgMint
  extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.OsmosisTokenFactoryV1beta1MsgMint;
  data: {
    amount: {
      denom: string;
      amount: string;
    };
    sender: string;
    mintToAddress: string;
  };
}

// types for mgs type:: /osmosis.valsetpref.v1beta1.MsgDelegateToValidatorSet
interface OsmoTest5TrxMsgOsmosisValsetprefV1beta1MsgDelegateToValidatorSet
  extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.OsmosisValsetprefV1beta1MsgDelegateToValidatorSet;
  data: {
    coin: {
      denom: string;
      amount: string;
    };
    delegator: string;
  };
}

// types for mgs type:: /osmosis.valsetpref.v1beta1.MsgSetValidatorSetPreference
interface OsmoTest5TrxMsgOsmosisValsetprefV1beta1MsgSetValidatorSetPreference
  extends IRangeMessage {
  type: OsmoTest5TrxMsgTypes.OsmosisValsetprefV1beta1MsgSetValidatorSetPreference;
  data: {
    delegator: string;
    preferences: {
      weight: string;
      valOperAddress: string;
    }[];
  };
}
