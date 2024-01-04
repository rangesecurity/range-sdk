import { IRangeMessage } from '../IRangeMessage';

export type CosmosHub4TrxMsg =
  | CosmosHub4TrxMsgCosmosAuthzV1beta1MsgExec
  | CosmosHub4TrxMsgCosmosAuthzV1beta1MsgGrant
  | CosmosHub4TrxMsgCosmosAuthzV1beta1MsgRevoke
  | CosmosHub4TrxMsgCosmosBankV1beta1MsgMultiSend
  | CosmosHub4TrxMsgCosmosBankV1beta1MsgSend
  | CosmosHub4TrxMsgCosmosDistributionV1beta1MsgSetWithdrawAddress
  | CosmosHub4TrxMsgCosmosDistributionV1beta1MsgWithdrawDelegatorReward
  | CosmosHub4TrxMsgWithdrawValidatorCommission
  | CosmosHub4TrxMsgCosmosFeegrantV1beta1MsgGrantAllowance
  | CosmosHub4TrxMsgCosmosGovV1beta1MsgDeposit
  | CosmosHub4TrxMsgCosmosGovV1beta1MsgSubmitProposal
  | CosmosHub4TrxMsgCosmosGovV1beta1MsgVote
  | CosmosHub4TrxMsgCosmosGovV1beta1MsgVoteWeighted
  | CosmosHub4TrxMsgCosmosSlashingV1beta1MsgUnjail
  | CosmosHub4TrxMsgCosmosStakingV1beta1MsgBeginRedelegate
  | CosmosHub4TrxMsgCosmosStakingV1beta1MsgCancelUnbondingDelegation
  | CosmosHub4TrxMsgCosmosStakingV1beta1MsgCreateValidator
  | CosmosHub4TrxMsgCosmosStakingV1beta1MsgDelegate
  | CosmosHub4TrxMsgCosmosStakingV1beta1MsgEditValidator
  | CosmosHub4TrxMsgCosmosStakingV1beta1MsgUndelegate
  | CosmosHub4TrxMsgIbcApplicationsTransferV1MsgTransfer
  | CosmosHub4TrxMsgIbcCoreChannelV1MsgAcknowledgement
  | CosmosHub4TrxMsgIbcCoreChannelV1MsgChannelCloseConfirm
  | CosmosHub4TrxMsgIbcCoreChannelV1MsgChannelOpenConfirm
  | CosmosHub4TrxMsgIbcCoreChannelV1MsgChannelOpenTry
  | CosmosHub4TrxMsgIbcCoreChannelV1MsgRecvPacket
  | CosmosHub4TrxMsgIbcCoreChannelV1MsgTimeout
  | CosmosHub4TrxMsgIbcCoreClientV1MsgCreateClient
  | CosmosHub4TrxMsgIbcCoreClientV1MsgSubmitMisbehaviour
  | CosmosHub4TrxMsgIbcCoreClientV1MsgUpdateClient;

enum CosmosHub4TrxMsgTypes {
  CosmosAuthzV1beta1MsgExec = 'cosmos.authz.v1beta1.MsgExec',
  CosmosAuthzV1beta1MsgGrant = 'cosmos.authz.v1beta1.MsgGrant',
  CosmosAuthzV1beta1MsgRevoke = 'cosmos.authz.v1beta1.MsgRevoke',
  CosmosBankV1beta1MsgMultiSend = 'cosmos.bank.v1beta1.MsgMultiSend',
  CosmosBankV1beta1MsgSend = 'cosmos.bank.v1beta1.MsgSend',
  CosmosDistributionV1beta1MsgSetWithdrawAddress = 'cosmos.distribution.v1beta1.MsgSetWithdrawAddress',
  CosmosDistributionV1beta1MsgWithdrawDelegatorReward = 'cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
  CosmosDistributionV1beta1MsgWithdrawValidatorCommission = 'cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission',
  CosmosFeegrantV1beta1MsgGrantAllowance = 'cosmos.feegrant.v1beta1.MsgGrantAllowance',
  CosmosGovV1beta1MsgDeposit = 'cosmos.gov.v1beta1.MsgDeposit',
  CosmosGovV1beta1MsgSubmitProposal = 'cosmos.gov.v1beta1.MsgSubmitProposal',
  CosmosGovV1beta1MsgVote = 'cosmos.gov.v1beta1.MsgVote',
  CosmosGovV1beta1MsgVoteWeighted = 'cosmos.gov.v1beta1.MsgVoteWeighted',
  CosmosSlashingV1beta1MsgUnjail = 'cosmos.slashing.v1beta1.MsgUnjail',
  CosmosStakingV1beta1MsgBeginRedelegate = 'cosmos.staking.v1beta1.MsgBeginRedelegate',
  CosmosStakingV1beta1MsgCancelUnbondingDelegation = 'cosmos.staking.v1beta1.MsgCancelUnbondingDelegation',
  CosmosStakingV1beta1MsgCreateValidator = 'cosmos.staking.v1beta1.MsgCreateValidator',
  CosmosStakingV1beta1MsgDelegate = 'cosmos.staking.v1beta1.MsgDelegate',
  CosmosStakingV1beta1MsgEditValidator = 'cosmos.staking.v1beta1.MsgEditValidator',
  CosmosStakingV1beta1MsgUndelegate = 'cosmos.staking.v1beta1.MsgUndelegate',
  IbcApplicationsTransferV1MsgTransfer = 'ibc.applications.transfer.v1.MsgTransfer',
  IbcCoreChannelV1MsgAcknowledgement = 'ibc.core.channel.v1.MsgAcknowledgement',
  IbcCoreChannelV1MsgChannelCloseConfirm = 'ibc.core.channel.v1.MsgChannelCloseConfirm',
  IbcCoreChannelV1MsgChannelOpenConfirm = 'ibc.core.channel.v1.MsgChannelOpenConfirm',
  IbcCoreChannelV1MsgChannelOpenTry = 'ibc.core.channel.v1.MsgChannelOpenTry',
  IbcCoreChannelV1MsgRecvPacket = 'ibc.core.channel.v1.MsgRecvPacket',
  IbcCoreChannelV1MsgTimeout = 'ibc.core.channel.v1.MsgTimeout',
  IbcCoreClientV1MsgCreateClient = 'ibc.core.client.v1.MsgCreateClient',
  IbcCoreClientV1MsgSubmitMisbehaviour = 'ibc.core.client.v1.MsgSubmitMisbehaviour',
  IbcCoreClientV1MsgUpdateClient = 'ibc.core.client.v1.MsgUpdateClient',
}

// types for mgs type:: /cosmos.authz.v1beta1.MsgExec
export interface CosmosHub4TrxMsgCosmosAuthzV1beta1MsgExec
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.CosmosAuthzV1beta1MsgExec;
  data: {
    msgs: {
      '@type': string;
      amount: {
        denom: string;
        amount: string;
      };
      delegator_address: string;
      validator_address: string;
    }[];
    '@type': string;
    grantee: string;
  };
}

// types for msg type:: /cosmos.authz.v1beta1.MsgGrant
export interface CosmosHub4TrxMsgCosmosAuthzV1beta1MsgGrant
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.CosmosAuthzV1beta1MsgGrant;
  data: {
    '@type': string;
    grant: {
      expiration: string;
      authorization: {
        '@type': string;
        allow_list: {
          address: string[];
        };
        max_tokens: null;
        authorization_type: string;
      };
    };
    grantee: string;
    granter: string;
  };
}

// types for msg type:: /cosmos.authz.v1beta1.MsgRevoke
export interface CosmosHub4TrxMsgCosmosAuthzV1beta1MsgRevoke
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.CosmosAuthzV1beta1MsgRevoke;
  data: {
    grantee: string;
    granter: string;
    msgTypeUrl: string;
  };
}

// types for msg type:: /cosmos.bank.v1beta1.MsgMultiSend
export interface CosmosHub4TrxMsgCosmosBankV1beta1MsgMultiSend
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.CosmosBankV1beta1MsgMultiSend;
  data: {
    inputs: {
      coins: {
        denom: string;
        amount: string;
      }[];
      address: string;
    }[];
    outputs: {
      coins: {
        denom: string;
        amount: string;
      }[];
      address: string;
    }[];
  };
}

// types for msg type:: /cosmos.bank.v1beta1.MsgSend
export interface CosmosHub4TrxMsgCosmosBankV1beta1MsgSend
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.CosmosBankV1beta1MsgSend;
  data: {
    amount: {
      denom: string;
      amount: string;
    }[];
    toAddress: string;
    fromAddress: string;
  };
}

// types for mgs type:: /cosmos.distribution.v1beta1.MsgSetWithdrawAddress
export interface CosmosHub4TrxMsgCosmosDistributionV1beta1MsgSetWithdrawAddress
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.CosmosDistributionV1beta1MsgSetWithdrawAddress;
  data: {
    withdrawAddress: string;
    delegatorAddress: string;
  };
}

// types for msg type:: /cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward
export interface CosmosHub4TrxMsgCosmosDistributionV1beta1MsgWithdrawDelegatorReward
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.CosmosDistributionV1beta1MsgWithdrawDelegatorReward;
  data: {
    delegatorAddress: string;
    validatorAddress: string;
  };
}

// types for msg type:: /cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission
export interface CosmosHub4TrxMsgWithdrawValidatorCommission
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.CosmosDistributionV1beta1MsgWithdrawValidatorCommission;
  data: {
    validatorAddress: string;
  };
}

// types for msg type:: /cosmos.feegrant.v1beta1.MsgGrantAllowance
export interface CosmosHub4TrxMsgCosmosFeegrantV1beta1MsgGrantAllowance {
    type: string;
    data: CosmosHub4TrxMsgCosmosFeegrantV1beta1MsgGrantAllowanceData;
}
interface CosmosHub4TrxMsgCosmosFeegrantV1beta1MsgGrantAllowanceData {
    granter: string;
    grantee: string;
    allowance: CosmosHub4TrxMsgCosmosFeegrantV1beta1MsgGrantAllowanceAllowance;
}
interface CosmosHub4TrxMsgCosmosFeegrantV1beta1MsgGrantAllowanceAllowance {
    '@type': string;
}


// types for msg type:: /cosmos.gov.v1beta1.MsgDeposit
export interface CosmosHub4TrxMsgCosmosGovV1beta1MsgDeposit
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.CosmosGovV1beta1MsgDeposit;
  data: {
    amount: {
      denom: string;
      amount: string;
    }[];
    depositor: string;
    proposalId: string;
  };
}

// types for msg type:: /cosmos.gov.v1beta1.MsgSubmitProposal
export interface CosmosHub4TrxMsgCosmosGovV1beta1MsgSubmitProposal
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.CosmosGovV1beta1MsgSubmitProposal;
  data: {
    '@type': string;
    content: {
      '@type': string;
      title: string;
      description: string;
    };
    proposer: string;
    initial_deposit: {
      denom: string;
      amount: string;
    }[];
  };
}

// types for msg type:: /cosmos.gov.v1beta1.MsgVote
export interface CosmosHub4TrxMsgCosmosGovV1beta1MsgVote extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.CosmosGovV1beta1MsgVote;
  data: {
    voter: string;
    option: string;
    proposalId: string;
  };
}

// types for msg type:: /cosmos.gov.v1beta1.MsgVoteWeighted
export interface CosmosHub4TrxMsgCosmosGovV1beta1MsgVoteWeighted
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.CosmosGovV1beta1MsgVoteWeighted;
  data: {
    voter: string;
    options: {
      option: string;
      weight: string;
    }[];
    proposalId: string;
  };
}

// types for msg type:: /cosmos.slashing.v1beta1.MsgUnjail
export interface CosmosHub4TrxMsgCosmosSlashingV1beta1MsgUnjail
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.CosmosSlashingV1beta1MsgUnjail;
  data: {
    validatorAddr: string;
  };
}

// types for msg type:: /cosmos.staking.v1beta1.MsgBeginRedelegate
export interface CosmosHub4TrxMsgCosmosStakingV1beta1MsgBeginRedelegate
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.CosmosStakingV1beta1MsgBeginRedelegate;
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

// types for msg type:: /cosmos.staking.v1beta1.MsgCancelUnbondingDelegation
export interface CosmosHub4TrxMsgCosmosStakingV1beta1MsgCancelUnbondingDelegation
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.CosmosStakingV1beta1MsgCancelUnbondingDelegation;
  data: {
    amount: {
      denom: string;
      amount: string;
    };
    creationHeight: string;
    delegatorAddress: string;
    validatorAddress: string;
  };
}

// types for msg type:: /cosmos.staking.v1beta1.MsgCreateValidator
export interface CosmosHub4TrxMsgCosmosStakingV1beta1MsgCreateValidator
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.CosmosStakingV1beta1MsgCreateValidator;
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
export interface CosmosHub4TrxMsgCosmosStakingV1beta1MsgDelegate
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.CosmosStakingV1beta1MsgDelegate;
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
export interface CosmosHub4TrxMsgCosmosStakingV1beta1MsgEditValidator
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.CosmosStakingV1beta1MsgEditValidator;
  data: {
    description: {
      details: string;
      moniker: string;
      website: string;
      identity: string;
      securityContact: string;
    };
    commissionRate: string;
    validatorAddress: string;
    minSelfDelegation: string;
  };
}

// types for msg type:: /cosmos.staking.v1beta1.MsgUndelegate
export interface CosmosHub4TrxMsgCosmosStakingV1beta1MsgUndelegate
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.CosmosStakingV1beta1MsgUndelegate;
  data: {
    amount: {
      denom: string;
      amount: string;
    };
    delegatorAddress: string;
    validatorAddress: string;
  };
}

// types for msg type:: /ibc.applications.transfer.v1.MsgTransfer
export interface CosmosHub4TrxMsgIbcApplicationsTransferV1MsgTransfer
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.IbcApplicationsTransferV1MsgTransfer;
  data: {
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
      revisionNumber: string;
    };
    timeoutTimestamp: string;
  };
}

// types for msg type:: /ibc.core.channel.v1.MsgAcknowledgement
export interface CosmosHub4TrxMsgIbcCoreChannelV1MsgAcknowledgement
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.IbcCoreChannelV1MsgAcknowledgement;
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
      timeoutTimestamp: string;
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

// types for msg type:: /ibc.core.channel.v1.MsgChannelCloseConfirm
export interface CosmosHub4TrxMsgIbcCoreChannelV1MsgChannelCloseConfirm
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.IbcCoreChannelV1MsgChannelCloseConfirm;
  data: {
    portId: string;
    signer: string;
    channelId: string;
    proofInit: string;
    proofHeight: {
      revisionHeight: string;
      revisionNumber: string;
    };
  };
}

// types for msg type:: /ibc.core.channel.v1.MsgChannelOpenConfirm
export interface CosmosHub4TrxMsgIbcCoreChannelV1MsgChannelOpenConfirm
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.IbcCoreChannelV1MsgChannelOpenConfirm;
  data: {
    portId: string;
    signer: string;
    proofAck: string;
    proofHeight: {
      revisionHeight: string;
      revisionNumber: string;
    };
  };
}
// types for mgs type:: /ibc.core.channel.v1.MsgChannelOpenTry
export interface CosmosHub4TrxMsgIbcCoreChannelV1MsgChannelOpenTry
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.IbcCoreChannelV1MsgChannelOpenTry;
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
    };
    counterpartyVersion: string;
  };
}

// types for mgs type:: /ibc.core.channel.v1.MsgRecvPacket
export interface CosmosHub4TrxMsgIbcCoreChannelV1MsgRecvPacket
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.IbcCoreChannelV1MsgRecvPacket;
  data: {
    packet: {
      data: string;
      sequence: string;
      sourcePort: string;
      sourceChannel: string;
      timeoutHeight: Record<string | number | symbol, unknown>;
      destinationPort: string;
      timeoutTimestamp: string;
      destinationChannel: string;
    };
    signer: string;
    proofHeight: {
      revisionHeight: string;
      revisionNumber: string;
    };
    proofCommitment: string;
  };
}

// types for mgs type:: /ibc.core.channel.v1.MsgTimeout
export interface CosmosHub4TrxMsgIbcCoreChannelV1MsgTimeout
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.IbcCoreChannelV1MsgTimeout;
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
      timeoutTimestamp: string;
      destinationChannel: string;
    };
    signer: string;
    proofHeight: {
      revisionHeight: string;
      revisionNumber: string;
    };
    proofUnreceived: string;
    nextSequenceRecv: string;
  };
}

// types for mgs type:: /ibc.core.client.v1.MsgCreateClient
export interface CosmosHub4TrxMsgIbcCoreClientV1MsgCreateClient
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.IbcCoreClientV1MsgCreateClient;
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

// types for mgs type:: /ibc.core.client.v1.MsgSubmitMisbehaviour
export interface CosmosHub4TrxMsgIbcCoreClientV1MsgSubmitMisbehaviour
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.IbcCoreClientV1MsgSubmitMisbehaviour;
  data: {
    '@type': string;
    signer: string;
    client_id: string;
    misbehaviour: {
      '@type': string;
      header_1: {
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
              signature?: string;
              timestamp: string;
              block_id_flag: string;
              validator_address?: string;
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
      header_2: {
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
              signature?: string;
              timestamp: string;
              block_id_flag: string;
              validator_address?: string;
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
      client_id: string;
    };
  };
}

// types for mgs type:: /ibc.core.client.v1.MsgUpdateClient
export interface CosmosHub4TrxMsgIbcCoreClientV1MsgUpdateClient
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.IbcCoreClientV1MsgUpdateClient;
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
            signature?: string;
            timestamp: string;
            block_id_flag: string;
            validator_address?: string;
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
