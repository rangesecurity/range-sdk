import { IRangeMessage } from '../IRangeMessage';

enum Stride1TrxMsgTypes {
  CosmosBankV1Beta1MsgMultiSend = 'cosmos.bank.v1beta1.MsgMultiSend',
  CosmosBankV1Beta1MsgSend = 'cosmos.bank.v1beta1.MsgSend',
  CosmosDistributionV1Beta1MsgSetWithdrawAddress = 'cosmos.distribution.v1beta1.MsgSetWithdrawAddress',
  CosmosDistributionV1Beta1MsgWithdrawDelegatorReward = 'cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
  CosmosDistributionV1Beta1MsgWithdrawValidatorCommission = 'cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission',
  CosmosFeeGrantV1Beta1MsgGrantAllowance = 'cosmos.feegrant.v1beta1.MsgGrantAllowance',
  CosmosGovV1Beta1MsgSubmitProposal = 'cosmos.gov.v1beta1.MsgSubmitProposal',
  CosmosGovV1Beta1MsgVote = 'cosmos.gov.v1beta1.MsgVote',
  CosmosGovV1MsgVote = 'cosmos.gov.v1.MsgVote',
  CosmosGovV1MsgVoteWeighted = 'cosmos.gov.v1.MsgVoteWeighted',
  CosmosStakingV1Beta1MsgBeginRedelegate = 'cosmos.staking.v1beta1.MsgBeginRedelegate',
  CosmosStakingV1Beta1MsgCancelUnbondingDelegation = 'cosmos.staking.v1beta1.MsgCancelUnbondingDelegation',
  CosmosStakingV1Beta1MsgDelegate = 'cosmos.staking.v1beta1.MsgDelegate',
  CosmosStakingV1Beta1MsgUndelegate = 'cosmos.staking.v1beta1.MsgUndelegate',
  IbcApplicationsTransferV1MsgTransfer = 'ibc.applications.transfer.v1.MsgTransfer',
  IbcCoreChannelV1MsgAcknowledgement = 'ibc.core.channel.v1.MsgAcknowledgement',
  IbcCoreChannelV1MsgChannelOpenAck = 'ibc.core.channel.v1.MsgChannelOpenAck',
  IbcCoreChannelMsgRecvPacket = 'ibc.core.channel.v1.MsgRecvPacket',
  IbcCoreChannelMsgTimeout = 'ibc.core.channel.v1.MsgTimeout',
  StrideClaimMsgClaimFreeAmount = 'stride.claim.MsgClaimFreeAmount',
  StrideInterchainQueryMsgSubmitQueryResponse = 'stride.interchainquery.v1.MsgSubmitQueryResponse',
  StrideStakeIBCMsgAddValidators = 'stride.stakeibc.MsgAddValidators',
  StrideStakeIBCMsgChangeValidatorWeight = 'stride.stakeibc.MsgChangeValidatorWeight',
  StrideStakeIBCMsgClaimUndelegatedTokens = 'stride.stakeibc.MsgClaimUndelegatedTokens',
  StrideStakeIBCMsgLiquidStake = 'stride.stakeibc.MsgLiquidStake',
  StrideStakeIBCMsgRedeemStake = 'stride.stakeibc.MsgRedeemStake',
  StrideStakeIBCMsgRestoreInterchainAccount = 'stride.stakeibc.MsgRestoreInterchainAccount',
  StrideStakeIBCMsgUpdateValidatorSharesExchRate = 'stride.stakeibc.MsgUpdateValidatorSharesExchRate',
  IbcCoreClientV1MsgUpdateClient = 'ibc.core.client.v1.MsgUpdateClient',
}

export type Stride1TrxMsg =
  | Stride1TrxMsgCosmosBankV1Beta1MsgMultiSend
  | Stride1TrxMsgCosmosBankV1Beta1MsgSend
  | Stride1TrxMsgCosmosDistributionV1Beta1MsgSetWithdrawAddress
  | Stride1TrxMsgCosmosDistributionV1Beta1MsgWithdrawDelegatorReward
  | Stride1TrxMsgCosmosDistributionV1Beta1MsgWithdrawValidatorCommission
  | Stride1TrxMsgCosmosFeeGrantV1Beta1MsgGrantAllowance
  | Stride1TrxMsgCosmosGovV1Beta1MsgSubmitProposal
  | Stride1TrxMsgCosmosGovV1Beta1MsgVote
  | Stride1TrxMsgCosmosGovV1MsgVote
  | Stride1TrxMsgCosmosGovV1MsgVoteWeighted
  | Stride1TrxMsgCosmosStakingV1Beta1MsgBeginRedelegate
  | Stride1TrxMsgCosmosStakingV1Beta1MsgCancelUnbondingDelegation
  | Stride1TrxMsgCosmosStakingV1Beta1MsgDelegate
  | Stride1TrxMsgCosmosStakingV1Beta1MsgUndelegate
  | Stride1TrxMsgIbcApplicationsTransferV1MsgTransfer
  | Stride1TrxMsgIbcCoreChannelV1MsgAcknowledgement
  | Stride1TrxMsgIbcCoreChannelV1MsgChannelOpenAck
  | Stride1TrxMsgIbcCoreChannelMsgRecvPacket
  | Stride1TrxMsgIbcCoreChannelMsgTimeout
  | Stride1TrxMsgStrideClaimMsgClaimFreeAmount
  | Stride1TrxMsgStrideInterchainQueryMsgSubmitQueryResponse
  | Stride1TrxMsgStrideStakeIBCMsgAddValidators
  | Stride1TrxMsgStrideStakeIBCMsgChangeValidatorWeight
  | Stride1TrxMsgStrideStakeIBCMsgClaimUndelegatedTokens
  | Stride1TrxMsgStrideStakeIBCMsgLiquidStake
  | Stride1TrxMsgStrideStakeIBCMsgRedeemStake
  | Stride1TrxMsgStrideStakeIBCMsgRestoreInterchainAccount
  | Stride1TrxMsgStrideStakeIBCMsgUpdateValidatorSharesExchRate
  | Stride1TrxMsgIbcCoreClientV1MsgUpdateClient;

// types for mgs type:: /cosmos.bank.v1beta1.MsgMultiSend
export interface Stride1TrxMsgCosmosBankV1Beta1MsgMultiSend
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.CosmosBankV1Beta1MsgMultiSend;
  data: {
    inputs: {
      coins: { denom: string; amount: string }[];
      address: string;
    }[];
  };
  outputs: {
    coins: { denom: string; amount: string }[];
    address: string;
  }[];
}

// types for mgs type:: /cosmos.bank.v1beta1.MsgSend
export interface Stride1TrxMsgCosmosBankV1Beta1MsgSend extends IRangeMessage {
  type: Stride1TrxMsgTypes.CosmosBankV1Beta1MsgSend;
  data: {
    amount: { denom: string; amount: string }[];
    toAddress: string;
    fromAddress: string;
  };
}

// types for mgs type:: /cosmos.distribution.v1beta1.MsgSetWithdrawAddress
export interface Stride1TrxMsgCosmosDistributionV1Beta1MsgSetWithdrawAddress
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.CosmosDistributionV1Beta1MsgSetWithdrawAddress;
  data: {
    withdrawAddress: string;
    delegatorAddress: string;
  };
}

// types for mgs type:: /cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward
export interface Stride1TrxMsgCosmosDistributionV1Beta1MsgWithdrawDelegatorReward
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.CosmosDistributionV1Beta1MsgWithdrawDelegatorReward;
  data: {
    delegatorAddress: string;
    validatorAddress: string;
  };
}

// types for mgs type:: /cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission
export interface Stride1TrxMsgCosmosDistributionV1Beta1MsgWithdrawValidatorCommission
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.CosmosDistributionV1Beta1MsgWithdrawValidatorCommission;
  data: {
    validatorAddress: string;
  };
}

// types for mgs type:: /cosmos.feegrant.v1beta1.MsgGrantAllowance
export interface Stride1TrxMsgCosmosFeeGrantV1Beta1MsgGrantAllowance
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.CosmosFeeGrantV1Beta1MsgGrantAllowance;
  data: {
    '@type': string;
    grantee: string;
    granter: string;
    allowance: {
      '@type': string;
      expiration: null;
      spend_limit: [];
    };
  };
}

// types for mgs type:: /cosmos.gov.v1beta1.MsgSubmitProposal
export interface Stride1TrxMsgCosmosGovV1Beta1MsgSubmitProposal
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.CosmosGovV1Beta1MsgSubmitProposal;
  data: {
    '@type': string;
    content: {
      '@type': string;
      title: string;
      description: string;
    };
    proposer: string;
    initial_deposit: { denom: string; amount: string }[];
  };
}

// types for mgs type:: /cosmos.gov.v1beta1.MsgVote
export interface Stride1TrxMsgCosmosGovV1Beta1MsgVote extends IRangeMessage {
  type: Stride1TrxMsgTypes.CosmosGovV1Beta1MsgVote;
  data: {
    voter: string;
    option: string;
    proposalId: string;
  };
}

// types for mgs type:: /cosmos.gov.v1.MsgVote
export interface Stride1TrxMsgCosmosGovV1MsgVote extends IRangeMessage {
  type: Stride1TrxMsgTypes.CosmosGovV1MsgVote;
  data: {
    voter: string;
    option: string;
    proposalId: string;
  };
}

// types for mgs type:: /cosmos.gov.v1.MsgVoteWeighted
export interface Stride1TrxMsgCosmosGovV1MsgVoteWeighted extends IRangeMessage {
  type: Stride1TrxMsgTypes.CosmosGovV1MsgVoteWeighted;
  data: {
    voter: string;
    options: {
      option: string;
      weight: string;
    }[];
    proposalId: string;
  };
}

// types for mgs type:: /cosmos.staking.v1beta1.MsgBeginRedelegate
export interface Stride1TrxMsgCosmosStakingV1Beta1MsgBeginRedelegate
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.CosmosStakingV1Beta1MsgBeginRedelegate;
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

// types for mgs type:: /cosmos.staking.v1beta1.MsgCancelUnbondingDelegation
export interface Stride1TrxMsgCosmosStakingV1Beta1MsgCancelUnbondingDelegation
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.CosmosStakingV1Beta1MsgCancelUnbondingDelegation;
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

// types for mgs type:: /cosmos.staking.v1beta1.MsgDelegate
export interface Stride1TrxMsgCosmosStakingV1Beta1MsgDelegate
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.CosmosStakingV1Beta1MsgDelegate;
  data: {
    amount: {
      denom: string;
      amount: string;
    };
    delegatorAddress: string;
    validatorAddress: string;
  };
}

// types for mgs type:: /cosmos.staking.v1beta1.MsgUndelegate
export interface Stride1TrxMsgCosmosStakingV1Beta1MsgUndelegate
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.CosmosStakingV1Beta1MsgUndelegate;
  data: {
    amount: {
      denom: string;
      amount: string;
    };
    delegatorAddress: string;
    validatorAddress: string;
  };
}

// types for mgs type:: /ibc.applications.transfer.v1.MsgTransfer
export interface Stride1TrxMsgIbcApplicationsTransferV1MsgTransfer {
    type: string;
    data: Stride1TrxMsgIbcApplicationsTransferV1MsgTransferData;
}
interface Stride1TrxMsgIbcApplicationsTransferV1MsgTransferData {
    sourcePort: string;
    sourceChannel: string;
    token: Stride1TrxMsgIbcApplicationsTransferV1MsgTransferToken;
    sender: string;
    receiver: string;
    timeoutHeight: Stride1TrxMsgIbcApplicationsTransferV1MsgTransferTimeoutHeight;
}
interface Stride1TrxMsgIbcApplicationsTransferV1MsgTransferToken {
    denom: string;
    amount: string;
}
interface Stride1TrxMsgIbcApplicationsTransferV1MsgTransferTimeoutHeight {
    revisionNumber: string;
    revisionHeight: string;
}


// types for mgs type:: /ibc.core.channel.v1.MsgAcknowledgement
export interface Stride1TrxMsgIbcCoreChannelV1MsgAcknowledgement
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.IbcCoreChannelV1MsgAcknowledgement;
  data: {
    packet: {
      data: string;
      sequence: string;
      sourcePort: string;
      sourceChannel: string;
      timeoutHeight: Record<string | number | symbol, unknown>; // todo
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

// types for mgs type:: /ibc.core.channel.v1.MsgChannelOpenAck
export interface Stride1TrxMsgIbcCoreChannelV1MsgChannelOpenAck
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.IbcCoreChannelV1MsgChannelOpenAck;
  data: {
    portId: string;
    signer: string;
    proofTry: string;
    proofHeight: {
      revisionHeight: string;
      revisionNumber: string;
    };
    counterpartyVersion: string;
    counterpartyChannelId: string;
  };
}

// types for mgs type:: /ibc.core.channel.v1.MsgRecvPacket
export interface Stride1TrxMsgIbcCoreChannelMsgRecvPacket
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.IbcCoreChannelMsgRecvPacket;
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
    proofHeight: {
      revisionHeight: string;
      revisionNumber: string;
    };
    proofCommitment: string;
  };
}

// types for mgs type:: /ibc.core.channel.v1.MsgTimeout
export interface Stride1TrxMsgIbcCoreChannelMsgTimeout extends IRangeMessage {
  type: Stride1TrxMsgTypes.IbcCoreChannelMsgTimeout;
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
    proofHeight: {
      revisionHeight: string;
      revisionNumber: string;
    };
    proofUnreceived: string;
    nextSequenceRecv: string;
  };
}

// types for mgs type:: /stride.claim.MsgClaimFreeAmount
export interface Stride1TrxMsgStrideClaimMsgClaimFreeAmount
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.StrideClaimMsgClaimFreeAmount;
  data: {
    user: string;
  };
}

// types for mgs type:: /stride.interchainquery.v1.MsgSubmitQueryResponse
export interface Stride1TrxMsgStrideInterchainQueryMsgSubmitQueryResponse
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.StrideInterchainQueryMsgSubmitQueryResponse;
  data: {
    height: string;
    result: string;
    chainId: string;
    queryId: string;
    proofOps: {
      ops: {
        key: string;
        data: string;
        type: string;
      }[];
    };
    fromAddress: string;
  };
}

// types for mgs type:: /stride.stakeibc.MsgAddValidators
export interface Stride1TrxMsgStrideStakeIBCMsgAddValidators
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.StrideStakeIBCMsgAddValidators;
  data: {
    creator: string;
    hostZone: string;
    validators: {
      name: string;
      address: string;
      delegationAmt: string;
    }[];
  };
}

// types for mgs type:: /stride.stakeibc.MsgChangeValidatorWeight
export interface Stride1TrxMsgStrideStakeIBCMsgChangeValidatorWeight
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.StrideStakeIBCMsgChangeValidatorWeight;
  data: {
    creator: string;
    valAddr: string;
    hostZone: string;
  };
}

// types for mgs type:: /stride.stakeibc.MsgClaimUndelegatedTokens
export interface Stride1TrxMsgStrideStakeIBCMsgClaimUndelegatedTokens
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.StrideStakeIBCMsgClaimUndelegatedTokens;
  data: {
    epoch: string;
    sender: string;
    creator: string;
    hostZoneId: string;
  };
}

// types for mgs type:: /stride.stakeibc.MsgLiquidStake
export interface Stride1TrxMsgStrideStakeIBCMsgLiquidStake
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.StrideStakeIBCMsgLiquidStake;
  data: {
    amount: string;
    creator: string;
    hostDenom: string;
  };
}

// types for mgs type:: /stride.stakeibc.MsgRedeemStake
export interface Stride1TrxMsgStrideStakeIBCMsgRedeemStake
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.StrideStakeIBCMsgRedeemStake;
  data: {
    amount: string;
    creator: string;
    hostZone: string;
    receiver: string;
  };
}

// types for mgs type:: /stride.stakeibc.MsgRestoreInterchainAccount
export interface Stride1TrxMsgStrideStakeIBCMsgRestoreInterchainAccount
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.StrideStakeIBCMsgRestoreInterchainAccount;
  data: {
    chainId: string;
    creator: string;
  };
}

// types for mgs type:: /stride.stakeibc.MsgUpdateValidatorSharesExchRate
export interface Stride1TrxMsgStrideStakeIBCMsgUpdateValidatorSharesExchRate
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.StrideStakeIBCMsgUpdateValidatorSharesExchRate;
  data: {
    chainId: string;
    creator: string;
    valoper: string;
  };
}
// types for mgs type:: /ibc.core.client.v1.MsgUpdateClient
export interface Stride1TrxMsgIbcCoreClientV1MsgUpdateClient
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.IbcCoreClientV1MsgUpdateClient;
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
