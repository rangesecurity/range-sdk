import { IRangeMessage } from '../IRangeMessage';

export enum Noble1TrxMsgTypes {
  IbcCoreConnectionV1MsgConnectionOpenConfirm = 'ibc.core.connection.v1.MsgConnectionOpenConfirm',
  NobleFiatTokenFactoryMsgBurn = 'noble.fiattokenfactory.MsgBurn',
  IbcCoreChannelV1MsgTimeout = 'ibc.core.channel.v1.MsgTimeout',
  CosmosAuthzV1beta1MsgExec = 'cosmos.authz.v1beta1.MsgExec',
  IbcCoreChannelV1MsgRecvPacket = 'ibc.core.channel.v1.MsgRecvPacket',
  IbcCoreConnectionV1MsgConnectionOpenAck = 'ibc.core.connection.v1.MsgConnectionOpenAck',
  CosmosFeegrantV1beta1MsgGrantAllowance = 'cosmos.feegrant.v1beta1.MsgGrantAllowance',
  IbcCoreChannelV1MsgChannelOpenInit = 'ibc.core.channel.v1.MsgChannelOpenInit',
  IbcCoreConnectionV1MsgConnectionOpenTry = 'ibc.core.connection.v1.MsgConnectionOpenTry',
  IbcCoreConnectionV1MsgConnectionOpenInit = 'ibc.core.connection.v1.MsgConnectionOpenInit',
  IbcApplicationsTransferV1MsgTransfer = 'ibc.applications.transfer.v1.MsgTransfer',
  CosmosBankV1beta1MsgSend = 'cosmos.bank.v1beta1.MsgSend',
  IbcCoreChannelV1MsgChannelOpenAck = 'ibc.core.channel.v1.MsgChannelOpenAck',
  NobleFiatTokenFactoryMsgMint = 'noble.fiattokenfactory.MsgMint',
  IbcCoreChannelV1MsgChannelOpenTry = 'ibc.core.channel.v1.MsgChannelOpenTry',
  IbcCoreChannelV1MsgChannelOpenConfirm = 'ibc.core.channel.v1.MsgChannelOpenConfirm',
  IbcCoreChannelV1MsgAcknowledgement = 'ibc.core.channel.v1.MsgAcknowledgement',
  CosmosAuthzV1beta1MsgGrant = 'cosmos.authz.v1beta1.MsgGrant',
  IbcCoreClientV1MsgCreateClient = 'ibc.core.client.v1.MsgCreateClient',
  CosmosFeegrantV1beta1MsgRevokeAllowance = 'cosmos.feegrant.v1beta1.MsgRevokeAllowance',
  IbcCoreClientV1MsgUpdateClient = 'ibc.core.client.v1.MsgUpdateClient',
}

export type Noble1TrxMsg =
  | Noble1TrxMsgIbcCoreConnectionV1MsgConnectionOpenConfirm
  | Noble1TrxMsgNobleFiatTokenFactoryMsgBurn
  | Noble1TrxMsgIbcCoreChannelV1MsgTimeout
  | Noble1TrxMsgCosmosAuthzV1beta1MsgExec
  | Noble1TrxMsgIbcCoreChannelV1MsgRecvPacket
  | Noble1TrxMsgIbcCoreConnectionV1MsgConnectionOpenAck
  | Noble1TrxMsgCosmosFeegrantV1beta1MsgGrantAllowance
  | Noble1TrxMsgTypeMsgChannelOpenInit
  | Noble1TrxMsgIbcCoreConnectionV1MsgConnectionOpenTry
  | Noble1TrxMsgIbcCoreConnectionV1MsgConnectionOpenInit
  | Noble1TrxMsgIbcApplicationsTransferV1MsgTransfer
  | Noble1TrxMsgCosmosBankV1beta1MsgSend
  | Noble1TrxMsgIbcCoreChannelV1MsgChannelOpenAck
  | Noble1TrxMsgNobleFiatTokenFactoryMsgMint
  | Noble1TrxMsgIbcCoreChannelOpenTry
  | Noble1TrxMsgIbcCoreChannelOpenConfirm
  | Noble1TrxMsgIbcCoreChannelV1MsgAcknowledgement
  | Noble1TrxMsgCosmosAuthzMsgGrant
  | Noble1TrxMsgIbcCoreClientV1MsgCreateClient
  | Noble1TrxMsgCosmosFeegrantV1beta1MsgRevokeAllowance
  | Noble1TrxMsgIbcCoreClientV1MsgUpdateClient;

// types for msg type:: /ibc.core.connection.v1.MsgConnectionOpenConfirm
export interface Noble1TrxMsgIbcCoreConnectionV1MsgConnectionOpenConfirm
  extends IRangeMessage {
  type: Noble1TrxMsgTypes.IbcCoreConnectionV1MsgConnectionOpenConfirm;
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

// types for msg type:: /noble.fiattokenfactory.MsgBurn
export interface Noble1TrxMsgNobleFiatTokenFactoryMsgBurn
  extends IRangeMessage {
  type: Noble1TrxMsgTypes.NobleFiatTokenFactoryMsgBurn;
  data: {
    from: string;
    amount: {
      denom: string;
      amount: string;
    };
  };
}

// types for msg type:: /ibc.core.channel.v1.MsgTimeout
export interface Noble1TrxMsgIbcCoreChannelV1MsgTimeout extends IRangeMessage {
  type: Noble1TrxMsgTypes.IbcCoreChannelV1MsgTimeout;
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
      revisionHeight: string;
    };
    nextSequenceRecv: string;
    signer: string;
  };
}

// types for msg type:: /cosmos.authz.v1beta1.MsgExec
export interface Noble1TrxMsgCosmosAuthzV1beta1MsgExec extends IRangeMessage {
  type: Noble1TrxMsgTypes.CosmosAuthzV1beta1MsgExec;
  data: {
    grantee: string;
    msgs: Noble1TrxMsgCosmosAuthzV1beta1MsgExecDataMsgSend[];
  };
}

interface Noble1TrxMsgCosmosAuthzV1beta1MsgExecDataMsgSend {
  '@type': '/cosmos.bank.v1beta1.MsgSend';
  fromAddress: string;
  toAddress: string;
  amount: {
    denom: string;
    amount: string;
  }[];
}

// types for msg type:: /ibc.core.channel.v1.MsgRecvPacket
export interface Noble1TrxMsgIbcCoreChannelV1MsgRecvPacket
  extends IRangeMessage {
  type: Noble1TrxMsgTypes.IbcCoreChannelV1MsgRecvPacket;
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
      revisionHeight: string;
    };
    signer: string;
  };
}

// types for msg type:: /ibc.core.connection.v1.MsgConnectionOpenAck
export interface Noble1TrxMsgIbcCoreConnectionV1MsgConnectionOpenAck
  extends IRangeMessage {
  type: Noble1TrxMsgTypes.IbcCoreConnectionV1MsgConnectionOpenAck;
  data: {
    connectionId: string;
    counterpartyConnectionId: string;
    version: {
      identifier: string;
      features: string[];
    };
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
        revisionHeight: string;
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
    proofHeight: {
      revisionNumber: string;
      revisionHeight: string;
    };
    proofTry: string;
    proofClient: string;
    proofConsensus: string;
    consensusHeight: {
      revisionNumber: string;
      revisionHeight: string;
    };
    signer: string;
  };
}

// types for msg type:: /cosmos.feegrant.v1beta1.MsgGrantAllowance
export interface Noble1TrxMsgCosmosFeegrantV1beta1MsgGrantAllowance
  extends IRangeMessage {
  type: Noble1TrxMsgTypes.CosmosFeegrantV1beta1MsgGrantAllowance;
  data: {
    granter: string;
    grantee: string;
    allowance: Noble1TrxMsgCosmosFeegrantV1beta1MsgGrantAllowanceAllowedMsgAllowance;
  };
}

interface Noble1TrxMsgCosmosFeegrantV1beta1MsgGrantAllowanceAllowedMsgAllowance {
  '@type': '/cosmos.feegrant.v1beta1.AllowedMsgAllowance';
  allowance: {
    '@type': string;
  };
  allowedMessages: string[];
}

// types for msg type:: /ibc.core.channel.v1.MsgChannelOpenInit
export interface Noble1TrxMsgTypeMsgChannelOpenInit extends IRangeMessage {
  type: Noble1TrxMsgTypes.IbcCoreChannelV1MsgChannelOpenInit;
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

// types for msg type:: /ibc.core.connection.v1.MsgConnectionOpenTry
export interface Noble1TrxMsgIbcCoreConnectionV1MsgConnectionOpenTry
  extends IRangeMessage {
  type: Noble1TrxMsgTypes.IbcCoreConnectionV1MsgConnectionOpenTry;
  data: {
    clientId: string;
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
        revisionNumber: string;
        revisionHeight: string;
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
    counterparty: {
      clientId: string;
      connectionId: string;
      prefix: {
        keyPrefix: string;
      };
    };
    counterpartyVersions: {
      identifier: string;
      features: string[];
    }[];
    proofHeight: {
      revisionNumber: string;
      revisionHeight: string;
    };
    proofInit: string;
    proofClient: string;
    proofConsensus: string;
    consensusHeight: {
      revisionNumber: string;
      revisionHeight: string;
    };
    signer: string;
  };
}

// types for msg type:: /ibc.core.connection.v1.MsgConnectionOpenInit
export interface Noble1TrxMsgIbcCoreConnectionV1MsgConnectionOpenInit
  extends IRangeMessage {
  type: Noble1TrxMsgTypes.IbcCoreConnectionV1MsgConnectionOpenInit;
  data: {
    clientId: string;
    counterparty: {
      clientId: string;
      prefix: {
        keyPrefix: string;
      };
    };
    signer: string;
  };
}

// types for msg type:: /ibc.applications.transfer.v1.MsgTransfer
export interface Noble1TrxMsgIbcApplicationsTransferV1MsgTransfer
  extends IRangeMessage {
  type: Noble1TrxMsgTypes.IbcApplicationsTransferV1MsgTransfer;
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
      revisionHeight?: string;
      revisionNumber?: string;
    };
    timeoutTimestamp?: string;
    memo?: string;
  };
}

// types for msg type:: /cosmos.bank.v1beta1.MsgSend
export interface Noble1TrxMsgCosmosBankV1beta1MsgSend extends IRangeMessage {
  type: Noble1TrxMsgTypes.CosmosBankV1beta1MsgSend;
  data: {
    amount: { denom: string; amount: string }[];
    toAddress: string;
    fromAddress: string;
  };
}

// types for msg type:: /ibc.core.channel.v1.MsgChannelOpenAck
export interface Noble1TrxMsgIbcCoreChannelV1MsgChannelOpenAck
  extends IRangeMessage {
  type: Noble1TrxMsgTypes.IbcCoreChannelV1MsgChannelOpenAck;
  data: {
    portId: string;
    signer: string;
    proofTry: string;
    channelId: string;
    proofHeight: {
      revisionHeight: string;
      revisionNumber?: string;
    };
    counterpartyVersion: string;
    counterpartyChannelId: string;
  };
}

// types for msg type:: /noble.fiattokenfactory.MsgMint
export interface Noble1TrxMsgNobleFiatTokenFactoryMsgMint
  extends IRangeMessage {
  type: Noble1TrxMsgTypes.NobleFiatTokenFactoryMsgMint;
  data: {
    from: string;
    amount: { denom: string; amount: string };
    address: string;
  };
}

// types for msg type:: /ibc.core.channel.v1.MsgChannelOpenTry
export interface Noble1TrxMsgIbcCoreChannelOpenTry extends IRangeMessage {
  type: Noble1TrxMsgTypes.IbcCoreChannelV1MsgChannelOpenTry;
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

// types for msg type:: /ibc.core.channel.v1.MsgChannelOpenConfirm
export interface Noble1TrxMsgIbcCoreChannelOpenConfirm extends IRangeMessage {
  type: Noble1TrxMsgTypes.IbcCoreChannelV1MsgChannelOpenConfirm;
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

// types for msg type:: /ibc.core.channel.v1.MsgAcknowledgement
export interface Noble1TrxMsgIbcCoreChannelV1MsgAcknowledgement
  extends IRangeMessage {
  type: Noble1TrxMsgTypes.IbcCoreChannelV1MsgAcknowledgement;
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
    acknowledgement: string;
    proofAcked: string;
    proofHeight: {
      revisionNumber?: string;
      revisionHeight: string;
    };
    signer: string;
  };
}

// types for msg type:: /cosmos.authz.v1beta1.MsgGrant
export interface Noble1TrxMsgCosmosAuthzMsgGrant extends IRangeMessage {
  type: Noble1TrxMsgTypes.CosmosAuthzV1beta1MsgGrant;
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

// types for msg type:: /ibc.core.client.v1.MsgCreateClient
export interface Noble1TrxMsgIbcCoreClientV1MsgCreateClient
  extends IRangeMessage {
  type: Noble1TrxMsgTypes.IbcCoreClientV1MsgCreateClient;
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
      frozenHeight?: {
        revisionNumber?: string;
        revisionHeight?: string;
      };
      latestHeight: {
        revisionNumber?: string;
        revisionHeight: string;
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

// types for mgs type:: /cosmos.feegrant.v1beta1.MsgRevokeAllowance
export interface Noble1TrxMsgCosmosFeegrantV1beta1MsgRevokeAllowance
  extends IRangeMessage {
  type: Noble1TrxMsgTypes.CosmosFeegrantV1beta1MsgRevokeAllowance;
  data: {
    grantee: string;
    granter: string;
  };
}

// types for mgs type:: /ibc.core.client.v1.MsgUpdateClient
export interface Noble1TrxMsgIbcCoreClientV1MsgUpdateClient {
    type: string;
    data: Noble1TrxMsgIbcCoreClientV1MsgUpdateClientData;
}
interface Noble1TrxMsgIbcCoreClientV1MsgUpdateClientData {
    clientId: string;
    clientMessage: Noble1TrxMsgIbcCoreClientV1MsgUpdateClientClientMessage;
    signer: string;
}
interface Noble1TrxMsgIbcCoreClientV1MsgUpdateClientClientMessage {
    '@type': string;
    signedHeader: Noble1TrxMsgIbcCoreClientV1MsgUpdateClientSignedHeader;
    validatorSet: Noble1TrxMsgIbcCoreClientV1MsgUpdateClientValidatorSet;
    trustedHeight: Noble1TrxMsgIbcCoreClientV1MsgUpdateClientTrustedHeight;
    trustedValidators: Noble1TrxMsgIbcCoreClientV1MsgUpdateClientTrustedValidators;
}
interface Noble1TrxMsgIbcCoreClientV1MsgUpdateClientSignedHeader {
    header: Noble1TrxMsgIbcCoreClientV1MsgUpdateClientHeader;
    commit: Noble1TrxMsgIbcCoreClientV1MsgUpdateClientCommit;
}
interface Noble1TrxMsgIbcCoreClientV1MsgUpdateClientHeader {
    version: Noble1TrxMsgIbcCoreClientV1MsgUpdateClientVersion;
    chainId: string;
    height: string;
    time: string;
    lastBlockId: Noble1TrxMsgIbcCoreClientV1MsgUpdateClientLastBlockId;
    lastCommitHash: string;
    dataHash: string;
    validatorsHash: string;
    nextValidatorsHash: string;
    consensusHash: string;
    appHash: string;
    lastResultsHash: string;
    evidenceHash: string;
    proposerAddress: string;
}
interface Noble1TrxMsgIbcCoreClientV1MsgUpdateClientVersion {
    block: string;
}
interface Noble1TrxMsgIbcCoreClientV1MsgUpdateClientLastBlockId {
    hash: string;
    partSetHeader: Noble1TrxMsgIbcCoreClientV1MsgUpdateClientPartSetHeader;
}
interface Noble1TrxMsgIbcCoreClientV1MsgUpdateClientPartSetHeader {
    total: number;
    hash: string;
}
interface Noble1TrxMsgIbcCoreClientV1MsgUpdateClientCommit {
    height: string;
    blockId: Noble1TrxMsgIbcCoreClientV1MsgUpdateClientBlockId;
    signatures: Noble1TrxMsgIbcCoreClientV1MsgUpdateClientSignaturesItem[];
}
interface Noble1TrxMsgIbcCoreClientV1MsgUpdateClientBlockId {
    hash: string;
    partSetHeader: Noble1TrxMsgIbcCoreClientV1MsgUpdateClientPartSetHeader;
}
interface Noble1TrxMsgIbcCoreClientV1MsgUpdateClientSignaturesItem {
    blockIdFlag: string;
    validatorAddress?: string;
    timestamp?: string;
    signature?: string;
}
interface Noble1TrxMsgIbcCoreClientV1MsgUpdateClientValidatorSet {
    validators: Noble1TrxMsgIbcCoreClientV1MsgUpdateClientValidatorsItem[];
    proposer: Noble1TrxMsgIbcCoreClientV1MsgUpdateClientProposer;
    totalVotingPower: string;
}
interface Noble1TrxMsgIbcCoreClientV1MsgUpdateClientValidatorsItem {
    address: string;
    pubKey: Noble1TrxMsgIbcCoreClientV1MsgUpdateClientPubKey;
    votingPower: string;
}
interface Noble1TrxMsgIbcCoreClientV1MsgUpdateClientPubKey {
    ed25519: string;
}
interface Noble1TrxMsgIbcCoreClientV1MsgUpdateClientProposer {
    address: string;
    pubKey: Noble1TrxMsgIbcCoreClientV1MsgUpdateClientPubKey;
    votingPower: string;
}
interface Noble1TrxMsgIbcCoreClientV1MsgUpdateClientTrustedHeight {
    revisionNumber: string;
    revisionHeight: string;
}
interface Noble1TrxMsgIbcCoreClientV1MsgUpdateClientTrustedValidators {
    validators: Noble1TrxMsgIbcCoreClientV1MsgUpdateClientValidatorsItem[];
    proposer: Noble1TrxMsgIbcCoreClientV1MsgUpdateClientProposer;
    totalVotingPower: string;
}

