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

export enum CosmosHub4TrxMsgTypes {
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
    grantee: string;
    msgs: (
      | CosmosHub4TrxMsgCosmosAuthzV1beta1MsgExecDataMsgsTypeMsgSend
      | CosmosHub4TrxMsgCosmosAuthzV1beta1MsgExecDataMsgsTypeMsgDelegate
      | CosmosHub4TrxMsgCosmosAuthzV1beta1MsgExecDataMsgsTypeMsgWithdrawDelegatorReward
      | CosmosHub4TrxMsgCosmosAuthzV1beta1MsgExecDataMsgsTypeMsgSetWithdrawAddress
      | CosmosHub4TrxMsgCosmosAuthzV1beta1MsgExecDataMsgsTypeMsgMsgWithdrawValidatorCommission
      | CosmosHub4TrxMsgCosmosAuthzV1beta1MsgExecDataMsgsTypeMsgVote
    )[];
  };
}

interface CosmosHub4TrxMsgCosmosAuthzV1beta1MsgExecDataMsgsTypeMsgSend {
  '@type': '/cosmos.bank.v1beta1.MsgSend';
  fromAddress: string;
  toAddress: string;
  amount: {
    denom: string;
    amount: string;
  }[];
}

interface CosmosHub4TrxMsgCosmosAuthzV1beta1MsgExecDataMsgsTypeMsgDelegate {
  '@type': '/cosmos.staking.v1beta1.MsgDelegate';
  delegatorAddress: string;
  validatorAddress: string;
  amount: {
    denom: string;
    amount: string;
  };
}

interface CosmosHub4TrxMsgCosmosAuthzV1beta1MsgExecDataMsgsTypeMsgWithdrawDelegatorReward {
  '@type': '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward';
  delegatorAddress: string;
  validatorAddress: string;
}

interface CosmosHub4TrxMsgCosmosAuthzV1beta1MsgExecDataMsgsTypeMsgSetWithdrawAddress {
  '@type': '/cosmos.distribution.v1beta1.MsgSetWithdrawAddress';
  delegatorAddress: string;
  withdrawAddress: string;
}

interface CosmosHub4TrxMsgCosmosAuthzV1beta1MsgExecDataMsgsTypeMsgMsgWithdrawValidatorCommission {
  '@type': '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission';
  validatorAddress: string;
}

interface CosmosHub4TrxMsgCosmosAuthzV1beta1MsgExecDataMsgsTypeMsgVote {
  '@type': '/cosmos.gov.v1beta1.MsgVote';
  proposalId: string;
  voter: string;
  option: string;
}

// types for msg type:: /cosmos.authz.v1beta1.MsgGrant
export interface CosmosHub4TrxMsgCosmosAuthzV1beta1MsgGrant
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.CosmosAuthzV1beta1MsgGrant;
  data: {
    granter: string;
    grantee: string;
    grant:
      | CosmosHub4TrxMsgCosmosAuthzV1beta1MsgGrantDataGrantStakeAuthorization
      | CosmosHub4TrxMsgCosmosAuthzV1beta1MsgGrantDataGrantGenericAuthorization
      | CosmosHub4TrxMsgCosmosAuthzV1beta1MsgGrantDataGrantSendAuthorization;
  };
}

interface CosmosHub4TrxMsgCosmosAuthzV1beta1MsgGrantDataGrantStakeAuthorization {
  authorization: {
    '@type': '/cosmos.staking.v1beta1.StakeAuthorization';
    allowList: {
      address: string[];
    };
    authorizationType: string;
    maxTokens?: {
      denom: string;
      amount: string;
    };
  };
  expiration?: string;
}

interface CosmosHub4TrxMsgCosmosAuthzV1beta1MsgGrantDataGrantGenericAuthorization {
  authorization: {
    '@type': '/cosmos.authz.v1beta1.GenericAuthorization';
    msg: string;
  };
  expiration: string;
}

interface CosmosHub4TrxMsgCosmosAuthzV1beta1MsgGrantDataGrantSendAuthorization {
  authorization: {
    '@type': '/cosmos.bank.v1beta1.SendAuthorization';
    spendLimit: { denom: string; amount: string }[];
  }[];
  expiration: string;
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
export interface CosmosHub4TrxMsgCosmosFeegrantV1beta1MsgGrantAllowance
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.CosmosFeegrantV1beta1MsgGrantAllowance;
  data: {
    granter: string;
    grantee: string;
    allowance:
      | CosmosHub4TrxMsgCosmosFeegrantV1beta1MsgGrantAllowanceDataBasicAllowance
      | CosmosHub4TrxMsgCosmosFeegrantV1beta1MsgGrantAllowanceDataPeriodicAllowance;
  };
}

interface CosmosHub4TrxMsgCosmosFeegrantV1beta1MsgGrantAllowanceDataBasicAllowance {
  '@type': '/cosmos.feegrant.v1beta1.BasicAllowance';
  expiration?: string;
  spendLimit: {
    denom: string;
    amount: string;
  }[];
}

interface CosmosHub4TrxMsgCosmosFeegrantV1beta1MsgGrantAllowanceDataPeriodicAllowance {
  '@type': '/cosmos.feegrant.v1beta1.PeriodicAllowance';
  period: string;
  periodSpendLimit: {
    denom: string;
    amount: string;
  }[];
  periodCanSpend: {
    denom: string;
    amount: string;
  }[];
  periodReset: string;
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
    content:
      | CosmosHub4TrxMsgCosmosGovV1beta1MsgSubmitProposalDataContentTypeTextProposal
      | CosmosHub4TrxMsgCosmosGovV1beta1MsgSubmitProposalDataContentTypeSoftwareUpgradeProposal;
    initialDeposit: {
      denom: string;
      amount: string;
    }[];
    proposer: string;
  };
}

interface CosmosHub4TrxMsgCosmosGovV1beta1MsgSubmitProposalDataContentTypeTextProposal {
  '@type': '/cosmos.gov.v1beta1.TextProposal';
  title: string;
  description: string;
}

interface CosmosHub4TrxMsgCosmosGovV1beta1MsgSubmitProposalDataContentTypeSoftwareUpgradeProposal {
  '@type': '/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal';
  title: string;
  description: string;
  plan: {
    info: string;
    name: string;
    height: string;
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
    description: {
      moniker: string;
      identity?: string;
      website?: string;
      details?: string;
    };
    commission: {
      rate: string;
      maxRate: string;
      maxChangeRate: string;
    };
    minSelfDelegation: string;
    delegatorAddress: string;
    validatorAddress: string;
    pubkey: {
      '@type': string;
      key: string;
    };
    value: {
      denom: string;
      amount: string;
    };
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
      moniker: string;
      identity?: string;
      website?: string;
      securityContact?: string;
      details?: string;
    };
    validatorAddress: string;
    commissionRate?: string;
    minSelfDelegation?: string;
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
  };
}

// types for msg type:: /ibc.core.channel.v1.MsgAcknowledgement
export interface CosmosHub4TrxMsgIbcCoreChannelV1MsgAcknowledgement
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.IbcCoreChannelV1MsgAcknowledgement;
  data: {
    packet: {
      sequence: string;
      sourcePort: string;
      sourceChannel: string;
      destinationPort: string;
      destinationChannel: string;
      data: string;
      timeoutHeight: {
        revisionNumber?: string;
        revisionHeight?: string;
      };
      timeoutTimestamp?: string;
    };
    acknowledgement: string;
    proofAcked: string;
    proofHeight: {
      revisionNumber?: string;
      revisionHeight?: string;
    };
    signer: string;
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
    channelId: string;
    proofAck: string;
    proofHeight: {
      revisionHeight: string;
      revisionNumber?: string;
    };
    signer: string;
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
      revisionNumber?: string;
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
    proofCommitment: string;
    proofHeight: {
      revisionNumber?: string;
      revisionHeight?: string;
    };
    signer: string;
  };
}

// types for mgs type:: /ibc.core.channel.v1.MsgTimeout
export interface CosmosHub4TrxMsgIbcCoreChannelV1MsgTimeout
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.IbcCoreChannelV1MsgTimeout;
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
      revisionNumber?: string;
      revisionHeight?: string;
    };
    nextSequenceRecv: string;
    signer: string;
  };
}

// types for mgs type:: /ibc.core.client.v1.MsgCreateClient
export interface CosmosHub4TrxMsgIbcCoreClientV1MsgCreateClient
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.IbcCoreClientV1MsgCreateClient;
  data: {
    clientState: {
      '@type': string;
      chainId: string;
      trustLevel: {
        numerator: string;
        denominator: string;
      };
      trustingPeriod: string;
      unbondingPeriod: string;
      maxClockDrift: string;
      frozenHeight: {
        revisionNumber?: string;
        revisionHeight?: string;
      };
      latestHeight: {
        revisionNumber?: string;
        revisionHeight?: string;
      };
      proofSpecs: {
        leafSpec: {
          hash: string;
          prehashValue: string;
          length: string;
          prefix: string;
        };
        innerSpec: {
          childOrder: number[];
          childSize: number;
          minPrefixLength: number;
          maxPrefixLength: number;
          hash: string;
        };
      }[];
      upgradePath: string[];
      allowUpdateAfterExpiry: boolean;
      allowUpdateAfterMisbehaviour: boolean;
    };
    consensusState: {
      '@type': string;
      timestamp: string;
      root: {
        hash: string;
      };
      nextValidatorsHash: string;
    };
    signer: string;
  };
}

// types for mgs type:: /ibc.core.client.v1.MsgSubmitMisbehaviour
export interface CosmosHub4TrxMsgIbcCoreClientV1MsgSubmitMisbehaviour
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.IbcCoreClientV1MsgSubmitMisbehaviour;
  data: {
    clientId: string;
    misbehaviour: {
      '@type': string;
      clientId: string;
      header1: {
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
              validatorAddress?: string;
              timestamp: string;
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
      header2: {
        signedHeader: {
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
    };
    signer: string;
  };
}

// types for mgs type:: /ibc.core.client.v1.MsgUpdateClient
export interface CosmosHub4TrxMsgIbcCoreClientV1MsgUpdateClient
  extends IRangeMessage {
  type: CosmosHub4TrxMsgTypes.IbcCoreClientV1MsgUpdateClient;
  data: {
    clientId: string;
    clientMessage: {
      '@type': string;
      signedHeader: {
        header: {
          version: {
            block: string;
            app?: string;
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
            validatorAddress?: string;
            timestamp?: string;
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
