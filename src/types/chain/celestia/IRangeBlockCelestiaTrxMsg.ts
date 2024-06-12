import { IRangeMessage } from '../IRangeMessage';

export enum CelestiaTrxMsgTypes {
  CelestiaQgbV1MsgRegisterEVMAddress = 'celestia.qgb.v1.MsgRegisterEVMAddress',
  CelestiaBlobV1MsgPayForBlobs = 'celestia.blob.v1.MsgPayForBlobs',
  CosmosAuthzV1beta1MsgExec = 'cosmos.authz.v1beta1.MsgExec',
  CosmosAuthzV1beta1MsgGrant = 'cosmos.authz.v1beta1.MsgGrant',
  CosmosAuthzV1beta1MsgRevoke = 'cosmos.authz.v1beta1.MsgRevoke',
  CosmosBankV1beta1MsgMultiSend = 'cosmos.bank.v1beta1.MsgMultiSend',
  CosmosBankV1beta1MsgSend = 'cosmos.bank.v1beta1.MsgSend',
  CosmosDistributionV1beta1MsgSetWithdrawAddress = 'cosmos.distribution.v1beta1.MsgSetWithdrawAddress',
  CosmosDistributionV1beta1MsgWithdrawDelegatorReward = 'cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
  CosmosDistributionV1beta1MsgWithdrawValidatorCommission = 'cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission',
  CosmosFeegrantV1beta1MsgGrantAllowance = 'cosmos.feegrant.v1beta1.MsgGrantAllowance',
  CosmosGovV1beta1MsgVote = 'cosmos.gov.v1beta1.MsgVote',
  CosmosSlashingV1beta1MsgUnjail = 'cosmos.slashing.v1beta1.MsgUnjail',
  CosmosStakingV1beta1MsgBeginRedelegate = 'cosmos.staking.v1beta1.MsgBeginRedelegate',
  CosmosStakingV1beta1MsgCancelUnbondingDelegation = 'cosmos.staking.v1beta1.MsgCancelUnbondingDelegation',
  CosmosStakingV1beta1MsgCreateValidator = 'cosmos.staking.v1beta1.MsgCreateValidator',
  CosmosStakingV1beta1MsgDelegate = 'cosmos.staking.v1beta1.MsgDelegate',
  CosmosStakingV1beta1MsgEditValidator = 'cosmos.staking.v1beta1.MsgEditValidator',
  CosmosStakingV1beta1MsgUndelegate = 'cosmos.staking.v1beta1.MsgUndelegate',
  CosmosVestingV1beta1MsgCreateVestingAccount = 'cosmos.vesting.v1beta1.MsgCreateVestingAccount',
  IbcApplicationsTransferV1MsgTransfer = 'ibc.applications.transfer.v1.MsgTransfer',
  IbcCoreChannelV1MsgAcknowledgement = 'ibc.core.channel.v1.MsgAcknowledgement',
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
}

export type CelestiaTrxMsg =
  | CelestiaTrxMsgCelestiaQgbV1MsgRegisterEVMAddress
  | CelestiaTrxMsgCelestiaBlobV1MsgPayForBlobs
  | CelestiaTrxMsgCosmosAuthzV1beta1MsgExec
  | CelestiaTrxMsgCosmosAuthzV1beta1MsgGrant
  | CelestiaTrxMsgCosmosAuthzV1beta1MsgRevoke
  | CelestiaTrxMsgCosmosBankV1beta1MsgMultiSend
  | CelestiaTrxMsgCosmosBankV1beta1MsgSend
  | CelestiaTrxMsgCosmosDistributionV1beta1MsgSetWithdrawAddress
  | CelestiaTrxMsgCosmosDistributionV1beta1MsgWithdrawDelegatorReward
  | CelestiaTrxMsgCosmosDistributionV1beta1MsgWithdrawValidatorCommission
  | CelestiaTrxMsgCosmosFeegrantV1beta1MsgGrantAllowance
  | CelestiaTrxMsgCosmosGovV1beta1MsgVote
  | CelestiaTrxMsgCosmosSlashingV1beta1MsgUnjail
  | CelestiaTrxMsgCosmosStakingV1beta1MsgBeginRedelegate
  | CelestiaTrxMsgCosmosStakingV1beta1MsgCancelUnbondingDelegation
  | CelestiaTrxMsgCosmosStakingV1beta1MsgCreateValidator
  | CelestiaTrxMsgCosmosStakingV1beta1MsgDelegate
  | CelestiaTrxMsgCosmosStakingV1beta1MsgEditValidator
  | CelestiaTrxMsgCosmosStakingV1beta1MsgUndelegate
  | CelestiaTrxMsgCosmosVestingV1beta1MsgCreateVestingAccount
  | CelestiaTrxMsgIbcApplicationsTransferV1MsgTransfer
  | CelestiaTrxMsgIbcCoreChannelV1MsgAcknowledgement
  | CelestiaTrxMsgIbcCoreChannelV1MsgChannelOpenAck
  | CelestiaTrxMsgIbcCoreChannelV1MsgChannelOpenConfirm
  | CelestiaTrxMsgIbcCoreChannelV1MsgChannelOpenInit
  | CelestiaTrxMsgIbcCoreChannelV1MsgChannelOpenTry
  | CelestiaTrxMsgIbcCoreChannelV1MsgRecvPacket
  | CelestiaTrxMsgIbcCoreChannelV1MsgTimeout
  | CelestiaTrxMsgIbcCoreClientV1MsgCreateClient
  | CelestiaTrxMsgIbcCoreClientV1MsgUpdateClient
  | CelestiaTrxMsgIbcCoreConnectionV1MsgConnectionOpenAck
  | CelestiaTrxMsgIbcCoreConnectionV1MsgConnectionOpenConfirm
  | CelestiaTrxMsgIbcCoreConnectionV1MsgConnectionOpenInit
  | CelestiaTrxMsgIbcCoreConnectionV1MsgConnectionOpenTry;

// types for msg type:: /celestia.qgb.v1.MsgRegisterEVMAddress
export interface CelestiaTrxMsgCelestiaQgbV1MsgRegisterEVMAddress
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.CelestiaQgbV1MsgRegisterEVMAddress;
  data: {
    evmAddress: string;
    validatorAddress: string;
  };
}

// types for msg type:: /celestia.blob.v1.MsgPayForBlobs
export interface CelestiaTrxMsgCelestiaBlobV1MsgPayForBlobs
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.CelestiaBlobV1MsgPayForBlobs;
  data: {
    signer: string;
    namespaces: string[];
    blobSizes: number[];
    shareCommitments: string[];
    shareVersions: number[];
  };
}

// types for msg type:: /cosmos.authz.v1beta1.MsgExec
export interface CelestiaTrxMsgCosmosAuthzV1beta1MsgExec extends IRangeMessage {
  type: CelestiaTrxMsgTypes.CosmosAuthzV1beta1MsgExec;
  data: {
    grantee: string;
    msgs: (
      | CelestiaTrxMsgCosmosAuthzV1beta1MsgExecDataMsgSend
      | CelestiaTrxMsgCosmosAuthzV1beta1MsgExecDataMsgGrant
      | CelestiaTrxMsgCosmosAuthzV1beta1MsgExecDataMsgGrantAllowance
      | CelestiaTrxMsgCosmosAuthzV1beta1MsgExecDataMsgRevokeAllowance
    )[];
  };
}

interface CelestiaTrxMsgCosmosAuthzV1beta1MsgExecDataMsgSend {
  '@type': '/cosmos.bank.v1beta1.MsgSend';
  fromAddress: string;
  toAddress: string;
  amount: {
    denom: string;
    amount: string;
  }[];
}

interface CelestiaTrxMsgCosmosAuthzV1beta1MsgExecDataMsgGrant {
  '@type': '/cosmos.authz.v1beta1.MsgGrant';
  granter: string;
  grantee: string;
  grant: {
    authorization: {
      '@type': string;
      msg: string;
    };
  }[];
}

interface CelestiaTrxMsgCosmosAuthzV1beta1MsgExecDataMsgGrantAllowance {
  '@type': '/cosmos.feegrant.v1beta1.MsgGrantAllowance';
  granter: string;
  grantee: string;
  allowance: {
    '@type': string;
    allowance: {
      '@type': string;
    };
    allowedMessages: string[];
  };
}

interface CelestiaTrxMsgCosmosAuthzV1beta1MsgExecDataMsgRevokeAllowance {
  '@type': '/cosmos.feegrant.v1beta1.MsgRevokeAllowance';
  granter: string;
  grantee: string;
}

// types for msg type:: /cosmos.authz.v1beta1.MsgGrant
export interface CelestiaTrxMsgCosmosAuthzV1beta1MsgGrant
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.CosmosAuthzV1beta1MsgGrant;
  data: {
    grant: {
      expiration?: string;
      authorization:
        | {
            '@type': string;
            allowList: {
              address: string[];
            };
            maxTokens?: {
              denom: string;
              amount: string;
            };
            authorizationType: string;
          }
        | {
            '@type': string;
            msg: string;
          };
    };
    grantee: string;
    granter: string;
  };
}

// types for msg type:: /cosmos.authz.v1beta1.MsgRevoke
export interface CelestiaTrxMsgCosmosAuthzV1beta1MsgRevoke
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.CosmosAuthzV1beta1MsgRevoke;
  data: {
    grantee: string;
    granter: string;
    msgTypeUrl: string;
  };
}

// types for msg type:: /cosmos.bank.v1beta1.MsgMultiSend
export interface CelestiaTrxMsgCosmosBankV1beta1MsgMultiSend
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.CosmosBankV1beta1MsgMultiSend;
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
export interface CelestiaTrxMsgCosmosBankV1beta1MsgSend extends IRangeMessage {
  type: CelestiaTrxMsgTypes.CosmosBankV1beta1MsgSend;
  data: {
    amount: {
      denom: string;
      amount: string;
    }[];
    toAddress: string;
    fromAddress: string;
  };
}

// types for msg type: /cosmos.distribution.v1beta1.MsgSetWithdrawAddress
export interface CelestiaTrxMsgCosmosDistributionV1beta1MsgSetWithdrawAddress
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.CosmosDistributionV1beta1MsgSetWithdrawAddress;
  data: {
    withdrawAddress: string;
    delegatorAddress: string;
  };
}

// types for msg type: /cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward
export interface CelestiaTrxMsgCosmosDistributionV1beta1MsgWithdrawDelegatorReward
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.CosmosDistributionV1beta1MsgWithdrawDelegatorReward;
  data: {
    delegatorAddress: string;
    validatorAddress: string;
  };
}

// types for msg type: /cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission
export interface CelestiaTrxMsgCosmosDistributionV1beta1MsgWithdrawValidatorCommission
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.CosmosDistributionV1beta1MsgWithdrawValidatorCommission;
  data: {
    validatorAddress: string;
  };
}

// types for msg type: /cosmos.feegrant.v1beta1.MsgGrantAllowance
export interface CelestiaTrxMsgCosmosFeegrantV1beta1MsgGrantAllowance
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.CosmosFeegrantV1beta1MsgGrantAllowance;
  data: {
    grantee: string;
    granter: string;
    allowance: {
      '@type': string;
      allowance?: {
        '@type': string;
        expiration: string;
      };
      allowedMessages?: string[];
    };
  };
}

// types for msg type: /cosmos.gov.v1beta1.MsgVote
export interface CelestiaTrxMsgCosmosGovV1beta1MsgVote extends IRangeMessage {
  type: CelestiaTrxMsgTypes.CosmosGovV1beta1MsgVote;
  data: {
    voter: string;
    option:
      | string
      | 'VOTE_OPTION_YES'
      | 'VOTE_OPTION_ABSTAIN'
      | 'VOTE_OPTION_NO';
    proposalId: string;
  };
}

// types for msg type: /cosmos.slashing.v1beta1.MsgUnjail
export interface CelestiaTrxMsgCosmosSlashingV1beta1MsgUnjail
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.CosmosSlashingV1beta1MsgUnjail;
  data: {
    validatorAddr: string;
  };
}

// types for msg type: /cosmos.staking.v1beta1.MsgBeginRedelegate
export interface CelestiaTrxMsgCosmosStakingV1beta1MsgBeginRedelegate
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.CosmosStakingV1beta1MsgBeginRedelegate;
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

// types for msg type: /cosmos.staking.v1beta1.MsgCancelUnbondingDelegation
export interface CelestiaTrxMsgCosmosStakingV1beta1MsgCancelUnbondingDelegation
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.CosmosStakingV1beta1MsgCancelUnbondingDelegation;
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

// types for msg type: /cosmos.staking.v1beta1.MsgCreateValidator
export interface CelestiaTrxMsgCosmosStakingV1beta1MsgCreateValidator
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.CosmosStakingV1beta1MsgCreateValidator;
  data: {
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
      maxRate: string;
      maxChangeRate: string;
    };
    description: {
      details?: string;
      moniker?: string;
      website?: string;
      identity?: string;
      securityContact?: string;
    };
    delegatorAddress: string;
    validatorAddress: string;
    minSelfDelegation: string;
  };
}

// types for msg type: /cosmos.staking.v1beta1.MsgDelegate
export interface CelestiaTrxMsgCosmosStakingV1beta1MsgDelegate
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.CosmosStakingV1beta1MsgDelegate;
  data: {
    amount: {
      denom: string;
      amount: string;
    };
    delegatorAddress: string;
    validatorAddress: string;
  };
}

// types for msg type: /cosmos.staking.v1beta1.MsgEditValidator
export interface CelestiaTrxMsgCosmosStakingV1beta1MsgEditValidator
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.CosmosStakingV1beta1MsgEditValidator;
  data: {
    description: {
      details?: string;
      moniker?: string;
      website?: string;
      identity?: string;
      securityContact?: string;
    };
    commissionRate?: string;
    validatorAddress: string;
    minSelfDelegation?: string;
  };
}

// types for msg type: /cosmos.staking.v1beta1.MsgUndelegate
export interface CelestiaTrxMsgCosmosStakingV1beta1MsgUndelegate
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.CosmosStakingV1beta1MsgUndelegate;
  data: {
    amount: {
      denom: string;
      amount: string;
    };
    delegatorAddress: string;
    validatorAddress: string;
  };
}

// types for msg type: /cosmos.vesting.v1beta1.MsgCreateVestingAccount
export interface CelestiaTrxMsgCosmosVestingV1beta1MsgCreateVestingAccount
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.CosmosVestingV1beta1MsgCreateVestingAccount;
  data: {
    amount: {
      denom: string;
      amount: string;
    }[];
    delayed?: boolean;
    endTime: string;
    toAddress: string;
    fromAddress: string;
  };
}

// types for msg type: /ibc.applications.transfer.v1.MsgTransfer
export interface CelestiaTrxMsgIbcApplicationsTransferV1MsgTransfer
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.IbcApplicationsTransferV1MsgTransfer;
  data: {
    memo?: string;
    token: {
      denom: string;
      amount: string;
    };
    sender: string;
    receiver: string;
    sourcePort: string;
    sourceChannel: string;
    timeoutHeight?: {
      revisionHeight?: string;
      revisionNumber?: string;
    };
    timeoutTimestamp?: string;
  };
}

// types for msg type: /ibc.core.channel.v1.MsgAcknowledgement
export interface CelestiaTrxMsgIbcCoreChannelV1MsgAcknowledgement
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.IbcCoreChannelV1MsgAcknowledgement;
  data: {
    packet: {
      data: string;
      sequence: string;
      sourcePort: string;
      sourceChannel: string;
      timeoutHeight: {
        revisionHeight?: string;
        revisionNumber?: string;
      };
      destinationPort: string;
      destinationChannel: string;
      timeoutTimestamp?: string;
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

// types for msg type: /ibc.core.channel.v1.MsgChannelOpenAck
export interface CelestiaTrxMsgIbcCoreChannelV1MsgChannelOpenAck
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.IbcCoreChannelV1MsgChannelOpenAck;
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

// types for msg type: /ibc.core.channel.v1.MsgChannelOpenConfirm
export interface CelestiaTrxMsgIbcCoreChannelV1MsgChannelOpenConfirm
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.IbcCoreChannelV1MsgChannelOpenConfirm;
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

// types for msg type: /ibc.core.channel.v1.MsgChannelOpenInit
export interface CelestiaTrxMsgIbcCoreChannelV1MsgChannelOpenInit
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.IbcCoreChannelV1MsgChannelOpenInit;
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

// types for msg type: /ibc.core.channel.v1.MsgChannelOpenTry
export interface CelestiaTrxMsgIbcCoreChannelV1MsgChannelOpenTry
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.IbcCoreChannelV1MsgChannelOpenTry;
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
export interface CelestiaTrxMsgIbcCoreChannelV1MsgRecvPacket
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.IbcCoreChannelV1MsgRecvPacket;
  data: {
    packet: {
      data: string;
      sequence: string;
      sourcePort: string;
      sourceChannel: string;
      timeoutHeight: {
        revisionHeight?: string;
        revisionNumber?: string;
      };
      destinationPort: string;
      timeoutTimestamp?: string;
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

// types for msg type: /ibc.core.channel.v1.MsgTimeout
export interface CelestiaTrxMsgIbcCoreChannelV1MsgTimeout
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.IbcCoreChannelV1MsgTimeout;
  data: {
    packet: {
      data: string;
      sequence: string;
      sourcePort: string;
      sourceChannel: string;
      timeoutHeight: {
        revisionHeight?: string;
        revisionNumber?: string;
      };
      destinationPort: string;
      timeoutTimestamp?: string;
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

// types for msg type: /ibc.core.client.v1.MsgCreateClient
export interface CelestiaTrxMsgIbcCoreClientV1MsgCreateClient
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.IbcCoreClientV1MsgCreateClient;
  data: {
    signer: string;
    clientState: {
      '@type': string;
      chainId: string;
      proofSpecs: {
        leafSpec: {
          hash: string;
          length: string;
          prefix: string;
          prehashValue: string;
        };
        innerSpec: {
          hash: string;
          childSize: number;
          childOrder: number[];
          maxPrefixLength: number;
          minPrefixLength: number;
        };
      }[];
      trustLevel: {
        numerator: string;
        denominator: string;
      };
      upgradePath: string[];
      frozenHeight: Record<string | number | symbol, unknown>;
      latestHeight: {
        revisionHeight: string;
        revisionNumber: string;
      };
      maxClockDrift: string;
      trustingPeriod: string;
      unbondingPeriod: string;
      allowUpdateAfterExpiry: boolean;
      allowUpdateAfterMisbehaviour: boolean;
    };
    consensusState: {
      root: {
        hash: string;
      };
      '@type': string;
      timestamp: string;
      nextValidatorsHash: string;
    };
  };
}

// types for msg type: /ibc.core.client.v1.MsgUpdateClient
export interface CelestiaTrxMsgIbcCoreClientV1MsgUpdateClient
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.IbcCoreClientV1MsgUpdateClient;
  data: {
    signer: string;
    clientId: string;
    clientMessage: {
      '@type': string;
      signedHeader: {
        commit: {
          round?: number;
          height: string;
          blockId: {
            hash: string;
            partSetHeader: {
              hash: string;
              total: number;
            };
          };
          signatures: {
            blockIdFlag: string;
            signature?: string;
            timestamp?: string;
            validatorAddress?: string;
          }[];
        };
        header: {
          time: string;
          height: string;
          appHash: string;
          chainId: string;
          version: {
            app?: string;
            block: string;
          };
          dataHash: string;
          lastBlockId: {
            hash: string;
            partSetHeader: {
              hash: string;
              total: number;
            };
          };
          evidenceHash: string;
          consensusHash: string;
          lastCommitHash: string;
          validatorsHash: string;
          lastResultsHash: string;
          proposerAddress: string;
          nextValidatorsHash: string;
        };
      };
      validatorSet: {
        proposer: {
          pubKey: {
            ed25519: string;
          };
          address: string;
          votingPower: string;
        };
        validators: {
          pubKey: {
            ed25519: string;
          };
          address: string;
          votingPower: string;
        }[];
        totalVotingPower?: string;
      };
      trustedHeight: {
        revisionHeight: string;
        revisionNumber: string;
      };
      trustedValidators: {
        proposer: {
          pubKey: {
            ed25519: string;
          };
          address: string;
          votingPower: string;
        };
        validators: {
          pubKey: {
            ed25519: string;
          };
          address: string;
          votingPower: string;
        }[];
        totalVotingPower?: string;
      };
    };
  };
}

// types for msg type: /ibc.core.connection.v1.MsgConnectionOpenAck
export interface CelestiaTrxMsgIbcCoreConnectionV1MsgConnectionOpenAck
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.IbcCoreConnectionV1MsgConnectionOpenAck;
  data: {
    signer: string;
    version: {
      features: string[];
      identifier: string;
    };
    proofTry: string;
    clientState: {
      '@type': string;
      chainId: string;
      proofSpecs: {
        leafSpec: {
          hash: string;
          length: string;
          prefix: string;
          prehashValue: string;
        };
        innerSpec: {
          hash: string;
          childSize: number;
          childOrder: number[];
          maxPrefixLength: number;
          minPrefixLength: number;
        };
      }[];
      trustLevel: {
        numerator: string;
        denominator: string;
      };
      upgradePath: string[];
      frozenHeight: Record<string | number | symbol, unknown>;
      latestHeight: {
        revisionHeight: string;
      };
      maxClockDrift: string;
      trustingPeriod: string;
      unbondingPeriod: string;
      allowUpdateAfterExpiry: boolean;
      allowUpdateAfterMisbehaviour: boolean;
    };
    proofClient: string;
    proofHeight: {
      revisionHeight: string;
      revisionNumber: string;
    };
    connectionId: string;
    proofConsensus: string;
    consensusHeight: {
      revisionHeight: string;
    };
    counterpartyConnectionId: string;
  };
}

// types for msg type: /ibc.core.connection.v1.MsgConnectionOpenConfirm
export interface CelestiaTrxMsgIbcCoreConnectionV1MsgConnectionOpenConfirm
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.IbcCoreConnectionV1MsgConnectionOpenConfirm;
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

// types for msg type: /ibc.core.connection.v1.MsgConnectionOpenInit
export interface CelestiaTrxMsgIbcCoreConnectionV1MsgConnectionOpenInit
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.IbcCoreConnectionV1MsgConnectionOpenInit;
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

// types for msg type: /ibc.core.connection.v1.MsgConnectionOpenTry
export interface CelestiaTrxMsgIbcCoreConnectionV1MsgConnectionOpenTry
  extends IRangeMessage {
  type: CelestiaTrxMsgTypes.IbcCoreConnectionV1MsgConnectionOpenTry;
  data: {
    signer: string;
    clientId: string;
    proofInit: string;
    clientState: {
      '@type': string;
      chainId: string;
      proofSpecs: {
        leafSpec: {
          hash: string;
          length: string;
          prefix: string;
          prehashValue: string;
        };
        innerSpec: {
          hash: string;
          childSize: number;
          childOrder: number[];
          maxPrefixLength: number;
          minPrefixLength: number;
        };
      }[];
      trustLevel: {
        numerator: string;
        denominator: string;
      };
      upgradePath: string[];
      frozenHeight: Record<string | number | symbol, unknown>;
      latestHeight: {
        revisionHeight: string;
      };
      maxClockDrift: string;
      trustingPeriod: string;
      unbondingPeriod: string;
      allowUpdateAfterExpiry: boolean;
      allowUpdateAfterMisbehaviour: boolean;
    };
    proofClient: string;
    proofHeight: {
      revisionHeight: string;
      revisionNumber: string;
    };
    counterparty: {
      prefix: {
        keyPrefix: string;
      };
      clientId: string;
      connectionId: string;
    };
    proofConsensus: string;
    consensusHeight: {
      revisionHeight: string;
    };
    counterpartyVersions: {
      features: string[];
      identifier: string;
    }[];
  };
}
