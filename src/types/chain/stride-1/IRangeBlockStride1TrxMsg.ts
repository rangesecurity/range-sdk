import { IRangeMessage } from '../IRangeMessage';

enum Stride1TrxMsgTypes {
  CosmosBankV1beta1MsgMultiSend = 'cosmos.bank.v1beta1.MsgMultiSend',
  CosmosBankV1Beta1MsgSend = 'cosmos.bank.v1beta1.MsgSend',
  CosmosDistributionV1Beta1MsgSetWithdrawAddress = 'cosmos.distribution.v1beta1.MsgSetWithdrawAddress',
  CosmosDistributionV1Beta1MsgWithdrawDelegatorReward = 'cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
  CosmosDistributionV1Beta1MsgWithdrawValidatorCommission = 'cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission',
  CosmosFeeGrantV1Beta1MsgGrantAllowance = 'cosmos.feegrant.v1beta1.MsgGrantAllowance',
  CosmosGovV1beta1MsgSubmitProposal = 'cosmos.gov.v1beta1.MsgSubmitProposal',
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
  IbcCoreChannelV1MsgRecvPacket = 'ibc.core.channel.v1.MsgRecvPacket',
  IbcCoreChannelV1MsgTimeout = 'ibc.core.channel.v1.MsgTimeout',
  StrideClaimMsgClaimFreeAmount = 'stride.claim.MsgClaimFreeAmount',
  StrideStakeibcMsgAddValidators = 'stride.stakeibc.MsgAddValidators',
  StrideInterchainqueryV1MsgSubmitQueryResponse = 'stride.interchainquery.v1.MsgSubmitQueryResponse',
  StrideStakeIBCMsgChangeValidatorWeight = 'stride.stakeibc.MsgChangeValidatorWeight',
  StrideStakeibcMsgClaimUndelegatedTokens = 'stride.stakeibc.MsgClaimUndelegatedTokens',
  StrideStakeIBCMsgLiquidStake = 'stride.stakeibc.MsgLiquidStake',
  StrideStakeIBCMsgRedeemStake = 'stride.stakeibc.MsgRedeemStake',
  StrideStakeIBCMsgRestoreInterchainAccount = 'stride.stakeibc.MsgRestoreInterchainAccount',
  StrideStakeIBCMsgUpdateValidatorSharesExchRate = 'stride.stakeibc.MsgUpdateValidatorSharesExchRate',
  IbcCoreClientV1MsgUpdateClient = 'ibc.core.client.v1.MsgUpdateClient',
}

export type Stride1TrxMsg =
  | Stride1TrxMsgCosmosBankV1beta1MsgMultiSend
  | Stride1TrxMsgCosmosBankV1Beta1MsgSend
  | Stride1TrxMsgCosmosDistributionV1Beta1MsgSetWithdrawAddress
  | Stride1TrxMsgCosmosDistributionV1Beta1MsgWithdrawDelegatorReward
  | Stride1TrxMsgCosmosDistributionV1Beta1MsgWithdrawValidatorCommission
  | Stride1TrxMsgCosmosFeeGrantV1Beta1MsgGrantAllowance
  | Stride1TrxMsgCosmosGovV1beta1MsgSubmitProposal
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
  | Stride1TrxMsgIbcCoreChannelV1MsgRecvPacket
  | Stride1TrxMsgIbcCoreChannelV1MsgTimeout
  | Stride1TrxMsgStrideClaimMsgClaimFreeAmount
  | Stride1TrxMsgStrideInterchainqueryV1MsgSubmitQueryResponse
  | Stride1TrxMsgStrideStakeIBCMsgAddValidators
  | Stride1TrxMsgStrideStakeIBCMsgChangeValidatorWeight
  | Stride1TrxMsgStrideStakeIBCMsgClaimUndelegatedTokens
  | Stride1TrxMsgStrideStakeIBCMsgLiquidStake
  | Stride1TrxMsgStrideStakeIBCMsgRedeemStake
  | Stride1TrxMsgStrideStakeIBCMsgRestoreInterchainAccount
  | Stride1TrxMsgStrideStakeIBCMsgUpdateValidatorSharesExchRate
  | Stride1TrxMsgIbcCoreClientV1MsgUpdateClient;

// types for mgs type:: /cosmos.bank.v1beta1.MsgMultiSend
export interface Stride1TrxMsgCosmosBankV1beta1MsgMultiSend
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.CosmosBankV1beta1MsgMultiSend;
  data: {
    inputs: {
      coins: { denom: string; amount: string }[];
      address: string;
    }[];
    outputs: {
      coins: { denom: string; amount: string }[];
      address: string;
    }[];
  };
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
export interface Stride1TrxMsgCosmosGovV1beta1MsgSubmitProposal
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.CosmosGovV1beta1MsgSubmitProposal;
  data: {
    content: {
      '@type': string;
      title: string;
      description: string;
      plan?: {
        name: string;
        time: string;
        height: string;
      };
    };
    initialDeposit: {
      denom: string;
      amount: string;
    }[];
    proposer: string;
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
export interface Stride1TrxMsgIbcApplicationsTransferV1MsgTransfer
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.IbcApplicationsTransferV1MsgTransfer;
  data: {
    sourcePort: string;
    sourceChannel: string;
    token: {
      denom: string;
      amount: string;
    };
    sender: string;
    receiver: string;
    timeoutHeight?: {
      revisionNumber?: string;
      revisionHeight?: string;
    };
    timeoutTimestamp?: string;
    memo?: string;
  };
}

// types for mgs type:: /ibc.core.channel.v1.MsgAcknowledgement
export interface Stride1TrxMsgIbcCoreChannelV1MsgAcknowledgement
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.IbcCoreChannelV1MsgAcknowledgement;
  data: {
    packet: {
      sequence: string;
      sourcePort: string;
      sourceChannel: string;
      destinationPort: string;
      destinationChannel: string;
      data: string;
      timeoutHeight?: {
        revisionHeight?: string;
        revisionNumber?: string;
      };
      timeoutTimestamp?: string;
    };
    acknowledgement: string;
    proofAcked: string;
    proofHeight: {
      revisionHeight: string;
      revisionNumber?: string;
    };
    signer: string;
  };
}

// types for mgs type:: /ibc.core.channel.v1.MsgChannelOpenAck
export interface Stride1TrxMsgIbcCoreChannelV1MsgChannelOpenAck
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.IbcCoreChannelV1MsgChannelOpenAck;
  data: {
    portId: string;
    channelId: string;
    counterpartyChannelId: string;
    counterpartyVersion: string;
    proofTry: string;
    proofHeight: {
      revisionNumber: string;
      revisionHeight: string;
    };
    signer: string;
  };
}

// types for mgs type:: /ibc.core.channel.v1.MsgRecvPacket
export interface Stride1TrxMsgIbcCoreChannelV1MsgRecvPacket
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.IbcCoreChannelV1MsgRecvPacket;
  data: {
    packet: {
      sequence: string;
      sourcePort: string;
      sourceChannel: string;
      destinationPort: string;
      destinationChannel: string;
      data: string;
      timeoutHeight?: {
        revisionHeight?: string;
        revisionNumber?: string;
      };
      timeoutTimestamp?: string;
    };
    proofCommitment: string;
    proofHeight: {
      revisionHeight: string;
      revisionNumber?: string;
    };
    signer: string;
  };
}

// types for mgs type:: /ibc.core.channel.v1.MsgTimeout
export interface Stride1TrxMsgIbcCoreChannelV1MsgTimeout extends IRangeMessage {
  type: Stride1TrxMsgTypes.IbcCoreChannelV1MsgTimeout;
  data: {
    packet: {
      sequence: string;
      sourcePort: string;
      sourceChannel: string;
      destinationPort: string;
      destinationChannel: string;
      data: string;
      timeoutHeight?: {
        revisionNumber?: string;
        revisionHeight?: string;
      };
      timeoutTimestamp?: string;
    };
    proofUnreceived: string;
    proofHeight: {
      revisionNumber: string;
      revisionHeight: string;
    };
    nextSequenceRecv: string;
    signer: string;
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
export interface Stride1TrxMsgStrideInterchainqueryV1MsgSubmitQueryResponse
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.StrideInterchainqueryV1MsgSubmitQueryResponse;
  data: {
    chainId: string;
    queryId: string;
    proofOps: {
      ops: {
        type: string;
        key: string;
        data: string;
      }[];
    };
    height: string;
    fromAddress: string;
    result?: string;
  };
}

// types for mgs type:: /stride.stakeibc.MsgAddValidators
export interface Stride1TrxMsgStrideStakeIBCMsgAddValidators
  extends IRangeMessage {
  type: Stride1TrxMsgTypes.StrideStakeibcMsgAddValidators;
  data: {
    creator: string;
    hostZone: string;
    validators: {
      name: string;
      address: string;
      delegationAmt: string;
      weight?: string;
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
  type: Stride1TrxMsgTypes.StrideStakeibcMsgClaimUndelegatedTokens;
  data: {
    epoch: string;
    creator: string;
    hostZoneId: string;
    sender?: string;
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
    clientId: string;
    clientMessage: {
      '@type': string;
      signedHeader: {
        header: {
          version: {
            block: string;
          };
          chainId: string;
          height: string;
          time: string;
          lastBlockId: {
            hash: string;
            partSetHeader: {
              total: number;
              hash: string;
            };
          };
          lastCommitHash: string;
          dataHash: string;
          validatorsHash: string;
          nextValidatorsHash: string;
          consensusHash: string;
          appHash: string;
          lastResultsHash: string;
          evidenceHash: string;
          proposerAddress: string;
        };
        commit: {
          height: string;
          blockId: {
            hash: string;
            partSetHeader: {
              total: number;
              hash: string;
            };
          };
          signatures: {
            blockIdFlag: string;
            timestamp: string;
            validatorAddress?: string;
            signature?: string;
          }[];
        };
      };
      validatorSet: {
        validators: {
          address: string;
          pubKey: {
            ed25519: string;
          };
          votingPower: string;
        }[];
        proposer: {
          address: string;
          pubKey: {
            ed25519: string;
          };
          votingPower: string;
        };
        totalVotingPower: string;
      };
      trustedHeight: {
        revisionNumber: string;
        revisionHeight: string;
      };
      trustedValidators: {
        validators: {
          address: string;
          pubKey: {
            ed25519: string;
          };
          votingPower: string;
        }[];
        proposer: {
          address: string;
          pubKey: {
            ed25519: string;
          };
          votingPower: string;
        };
        totalVotingPower: string;
      };
    };
    signer: string;
  };
}
