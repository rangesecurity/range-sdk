import { IRangeMessage } from '../IRangeMessage';

enum Mocha4TrxMsgTypes {
  CosmosAuthzV1beta1MsgExec = 'cosmos.authz.v1beta1.MsgExec',
  CosmosAuthzV1beta1MsgGrant = 'cosmos.authz.v1beta1.MsgGrant',
  CosmosBankV1beta1MsgSend = 'cosmos.bank.v1beta1.MsgSend',
  CosmosDistributionV1beta1MsgSetWithdrawAddress = 'cosmos.distribution.v1beta1.MsgSetWithdrawAddress',
  CosmosDistributionV1beta1MsgWithdrawDelegatorReward = 'cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
  CosmosDistributionV1beta1MsgWithdrawValidatorCommission = 'cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission',
  CosmosFeeGrantV1beta1MsgGrantAllowance = 'cosmos.feegrant.v1beta1.MsgGrantAllowance',
  CosmosSlashingV1beta1MsgUnjail = 'cosmos.slashing.v1beta1.MsgUnjail',
  CosmosStakingV1beta1MsgBeginRedelegate = 'cosmos.staking.v1beta1.MsgBeginRedelegate',
  CosmosStakingV1beta1MsgCreateValidator = 'cosmos.staking.v1beta1.MsgCreateValidator',
  CosmosStakingV1beta1MsgDelegate = 'cosmos.staking.v1beta1.MsgDelegate',
  CosmosStakingV1beta1MsgEditValidator = 'cosmos.staking.v1beta1.MsgEditValidator',
  CosmosStakingV1beta1MsgUndelegate = 'cosmos.staking.v1beta1.MsgUndelegate',
  CosmosVestingV1beta1MsgCreateVestingAccount = 'cosmos.vesting.v1beta1.MsgCreateVestingAccount',
  IbcApplicationsTransferV1MsgTransfer = 'ibc.applications.transfer.v1.MsgTransfer',
  IbcCoreChannelV1MsgAcknowledgement = 'ibc.core.channel.v1.MsgAcknowledgement',
  IbcCoreChannelV1MsgChannelOpenConfirm = 'ibc.core.channel.v1.MsgChannelOpenConfirm',
  IbcCoreChannelV1MsgChannelOpenTry = 'ibc.core.channel.v1.MsgChannelOpenTry',
  IbcCoreClientV1MsgCreateClient = 'ibc.core.client.v1.MsgCreateClient',
  IbcCoreClientV1MsgUpdateClient = 'ibc.core.client.v1.MsgUpdateClient',
  IbcCoreConnectionV1MsgConnectionOpenConfirm = 'ibc.core.connection.v1.MsgConnectionOpenConfirm',
  IbcCoreConnectionV1MsgConnectionOpenInit = 'ibc.core.connection.v1.MsgConnectionOpenInit',
  IbcCoreConnectionV1MsgConnectionOpenTry = 'ibc.core.connection.v1.MsgConnectionOpenTry',
}

export type Mocha4TrxMsg =
  | Mocha4TrxMsgCosmosAuthzV1beta1MsgExec
  | Mocha4TrxMsgCosmosAuthzV1beta1MsgGrant
  | Mocha4TrxMsgCosmosBankV1beta1MsgSend
  | Mocha4TrxMsgCosmosDistributionV1beta1MsgSetWithdrawAddress
  | Mocha4TrxMsgCosmosDistributionV1beta1MsgWithdrawDelegatorReward
  | Mocha4TrxMsgCosmosDistributionV1beta1MsgWithdrawValidatorCommission
  | Mocha4TrxMsgCosmosFeeGrantV1beta1MsgGrantAllowance
  | Mocha4TrxMsgCosmosSlashingV1beta1MsgUnjail
  | Mocha4TrxMsgCosmosStakingV1beta1MsgBeginRedelegate
  | Mocha4TrxMsgCosmosStakingV1beta1MsgCreateValidator
  | Mocha4TrxMsgCosmosStakingV1beta1MsgDelegate
  | Mocha4TrxMsgCosmosStakingV1beta1MsgEditValidator
  | Mocha4TrxMsgCosmosStakingV1beta1MsgUndelegate
  | Mocha4TrxMsgCosmosVestingV1beta1MsgCreateVestingAccount
  | Mocha4TrxMsgIbcApplicationsTransferV1MsgTransfer
  | Mocha4TrxMsgIbcCoreChannelV1MsgAcknowledgement
  | Mocha4TrxMsgIbcCoreChannelV1MsgChannelOpenConfirm
  | Mocha4TrxMsgIbcCoreChannelV1MsgChannelOpenTry
  | Mocha4TrxMsgIbcCoreClientV1MsgCreateClient
  | Mocha4TrxMsgIbcCoreClientV1MsgUpdateClient
  | Mocha4TrxMsgIbcCoreConnectionV1MsgConnectionOpenConfirm
  | Mocha4TrxMsgConnectionOpenInit
  | Mocha4TrxMsgConnectionOpenTry;

// types for msg type:: /cosmos.authz.v1beta1.MsgExec
export interface Mocha4TrxMsgCosmosAuthzV1beta1MsgExec extends IRangeMessage {
  type: Mocha4TrxMsgTypes.CosmosAuthzV1beta1MsgExec;
  data: {
    msgs: {
      '@type': string;
      delegator_address: string;
      validator_address: string;
    }[];
    '@type': string;
    grantee: string;
  };
}

// types for msg type:: /cosmos.authz.v1beta1.MsgGrant
export interface Mocha4TrxMsgCosmosAuthzV1beta1MsgGrant extends IRangeMessage {
  type: Mocha4TrxMsgTypes.CosmosAuthzV1beta1MsgGrant;
  data: {
    '@type': string;
    grant: {
      expiration: string;
      authorization: {
        msg: string;
        '@type': string;
      };
    };
    grantee: string;
    granter: string;
  };
}

// types for msg type:: /cosmos.bank.v1beta1.MsgSend
export interface Mocha4TrxMsgCosmosBankV1beta1MsgSend extends IRangeMessage {
  type: Mocha4TrxMsgTypes.CosmosBankV1beta1MsgSend;
  data: {
    amount: Array<{
      denom: string;
      amount: string;
    }>;
    toAddress: string;
    fromAddress: string;
  };
}

// types for msg type:: /cosmos.distribution.v1beta1.MsgSetWithdrawAddress
export interface Mocha4TrxMsgCosmosDistributionV1beta1MsgSetWithdrawAddress
  extends IRangeMessage {
  type: Mocha4TrxMsgTypes.CosmosDistributionV1beta1MsgSetWithdrawAddress;
  data: {
    withdrawAddress: string;
    delegatorAddress: string;
  };
}

// types for msg type:: /cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward
export interface Mocha4TrxMsgCosmosDistributionV1beta1MsgWithdrawDelegatorReward
  extends IRangeMessage {
  type: Mocha4TrxMsgTypes.CosmosDistributionV1beta1MsgWithdrawDelegatorReward;
  data: {
    delegatorAddress: string;
    validatorAddress: string;
  };
}

// types for msg type:: /cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission
export interface Mocha4TrxMsgCosmosDistributionV1beta1MsgWithdrawValidatorCommission
  extends IRangeMessage {
  type: Mocha4TrxMsgTypes.CosmosDistributionV1beta1MsgWithdrawValidatorCommission;
  data: {
    validatorAddress: string;
  };
}

// types for msg type:: /cosmos.feegrant.v1beta1.MsgGrantAllowance
export interface Mocha4TrxMsgCosmosFeeGrantV1beta1MsgGrantAllowance
  extends IRangeMessage {
  type: Mocha4TrxMsgTypes.CosmosFeeGrantV1beta1MsgGrantAllowance;
  data: {
    '@type': string;
    grantee: string;
    granter: string;
    allowance: {
      '@type': string;
      expiration: string | null;
      spend_limit: string[];
    };
  };
}

// types for msg type:: /cosmos.slashing.v1beta1.MsgUnjail
export interface Mocha4TrxMsgCosmosSlashingV1beta1MsgUnjail
  extends IRangeMessage {
  type: Mocha4TrxMsgTypes.CosmosSlashingV1beta1MsgUnjail;
  data: {
    validatorAddr: string;
  };
}

// types for msg type:: /cosmos.staking.v1beta1.MsgBeginRedelegate
export interface Mocha4TrxMsgCosmosStakingV1beta1MsgBeginRedelegate
  extends IRangeMessage {
  type: Mocha4TrxMsgTypes.CosmosStakingV1beta1MsgBeginRedelegate;
  data: {
    amount: {
      denom: string;
      amount: string;
    };
    delegatorAddress: string;
    validatorDstAddress: string;
    validatorSrcAddress: string;
  };
}

// types for msg type:: /cosmos.staking.v1beta1.MsgCreateValidator
export interface Mocha4TrxMsgCosmosStakingV1beta1MsgCreateValidator
  extends IRangeMessage {
  type: Mocha4TrxMsgTypes.CosmosStakingV1beta1MsgCreateValidator;
  data: {
    '@type': string;
    value: {
      denom: string;
      amount: string;
    };
    pubkey: {
      key: string;
      '@type': string;
    };
    commission: {
      rate: string;
      max_rate: string;
      max_change_rate: string;
    };
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

// types for msg type:: /cosmos.staking.v1beta1.MsgDelegate
export interface Mocha4TrxMsgCosmosStakingV1beta1MsgDelegate
  extends IRangeMessage {
  type: Mocha4TrxMsgTypes.CosmosStakingV1beta1MsgDelegate;
  data: {
    amount: {
      denom: string;
      amount: string;
    };
    delegatorAddress: string;
    validatorAddress: string;
  };
}

// types for msg type:: /cosmos.staking.v1beta1.MsgEditValidator
export interface Mocha4TrxMsgCosmosStakingV1beta1MsgEditValidator
  extends IRangeMessage {
  type: Mocha4TrxMsgTypes.CosmosStakingV1beta1MsgEditValidator;
  data: {
    description: {
      details: string;
      moniker: string;
      website: string;
      identity: string;
      securityContact: string;
    };
    validatorAddress: string;
  };
}

// types for msg type:: /cosmos.staking.v1beta1.MsgUndelegate
export interface Mocha4TrxMsgCosmosStakingV1beta1MsgUndelegate
  extends IRangeMessage {
  type: Mocha4TrxMsgTypes.CosmosStakingV1beta1MsgUndelegate;
  data: {
    amount: {
      denom: string;
      amount: string;
    };
    delegatorAddress: string;
    validatorAddress: string;
  };
}

// types for msg type:: /cosmos.vesting.v1beta1.MsgCreateVestingAccount
export interface Mocha4TrxMsgCosmosVestingV1beta1MsgCreateVestingAccount
  extends IRangeMessage {
  type: Mocha4TrxMsgTypes.CosmosVestingV1beta1MsgCreateVestingAccount;
  data: {
    amount: {
      denom: string;
      amount: string;
    }[];
    endTime: string;
    toAddress: string;
    fromAddress: string;
  };
}

// types for msg type:: /ibc.applications.transfer.v1.MsgTransfer
export interface Mocha4TrxMsgIbcApplicationsTransferV1MsgTransfer
  extends IRangeMessage {
  type: Mocha4TrxMsgTypes.IbcApplicationsTransferV1MsgTransfer;
  data: {
    memo: string;
    token: {
      denom: string;
      amount: string;
    };
    sender: string;
    receiver: string;
    sourcePort: string;
    sourceChannel: string;
    timeoutHeight: {
      revisionHeight: string;
    };
  };
}

// types for msg type:: /ibc.core.channel.v1.MsgAcknowledgement
export interface Mocha4TrxMsgIbcCoreChannelV1MsgAcknowledgement
  extends IRangeMessage {
  type: Mocha4TrxMsgTypes.IbcCoreChannelV1MsgAcknowledgement;
  data: {
    packet: {
      data: string;
      sequence: string;
      sourcePort: string;
      sourceChannel: string;
      timeoutHeight: {
        revisionHeight: string;
        revisionNumber: string;
      };
      destinationPort: string;
      destinationChannel: string;
    };
    signer: string;
    proofAcked: string;
    proofHeight: {
      revisionHeight: string;
      revisionNumber: string;
    };
    acknowledgement: string;
  };
}

// types for msg type:: /ibc.core.channel.v1.MsgChannelOpenConfirm
export interface Mocha4TrxMsgIbcCoreChannelV1MsgChannelOpenConfirm
  extends IRangeMessage {
  type: Mocha4TrxMsgTypes.IbcCoreChannelV1MsgChannelOpenConfirm;
  data: {
    portId: string;
    signer: string;
    proofAck: string;
    channelId: string;
    proofHeight: {
      revisionHeight: string;
      revisionNumber: string;
    };
    counterpartyVersion: string;
  };
}

// types for msg type:: /ibc.core.channel.v1.MsgChannelOpenTry
export interface Mocha4TrxMsgIbcCoreChannelV1MsgChannelOpenTry
  extends IRangeMessage {
  type: Mocha4TrxMsgTypes.IbcCoreChannelV1MsgChannelOpenTry;
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

// types for msg type:: /ibc.core.client.v1.MsgCreateClient
export interface Mocha4TrxMsgIbcCoreClientV1MsgCreateClient
  extends IRangeMessage {
  type: Mocha4TrxMsgTypes.IbcCoreClientV1MsgCreateClient;
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
          empty_child: null;
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
    consensus_state: {
      root: {
        hash: string;
      };
      '@type': string;
      timestamp: string;
      next_validators_hash: string;
    };
  };
}

// types for msg type:: /ibc.core.client.v1.MsgUpdateClient
export interface Mocha4TrxMsgIbcCoreClientV1MsgUpdateClient
  extends IRangeMessage {
  type: Mocha4TrxMsgTypes.IbcCoreClientV1MsgUpdateClient;
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

// types for msg type:: /ibc.core.connection.v1.MsgConnectionOpenConfirm
export interface Mocha4TrxMsgIbcCoreConnectionV1MsgConnectionOpenConfirm
  extends IRangeMessage {
  type: Mocha4TrxMsgTypes.IbcCoreConnectionV1MsgConnectionOpenConfirm;
  data: {
    signer: string;
    proofAck: string;
    proofHeight: {
      revisionHeight: string;
      revisionNumber: string;
    };
    connectionId: string;
  };
}

// types for msg type:: /ibc.core.connection.v1.MsgConnectionOpenInit
export interface Mocha4TrxMsgConnectionOpenInit extends IRangeMessage {
  type: Mocha4TrxMsgTypes.IbcCoreConnectionV1MsgConnectionOpenInit;
  data: {
    '@type': string;
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
export interface Mocha4TrxMsgConnectionOpenTry extends IRangeMessage {
  type: Mocha4TrxMsgTypes.IbcCoreConnectionV1MsgConnectionOpenTry;
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
          empty_child: null;
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
        keyPrefix: string;
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
    host_consensus_state_proof: null;
  };
}
