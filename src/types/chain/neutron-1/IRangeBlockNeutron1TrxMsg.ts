import { IRangeMessage } from '../IRangeMessage';

enum Neutron1TrxMsgTypes {
  CosmosBankV1beta1MsgSend = 'cosmos.bank.v1beta1.MsgSend',
  CosmwasmWasmV1MsgExecuteContract = 'cosmwasm.wasm.v1.MsgExecuteContract',
  CosmwasmWasmV1MsgInstantiateContract = 'cosmwasm.wasm.v1.MsgInstantiateContract',
  CosmwasmWasmV1MsgInstantiateContract2 = 'cosmwasm.wasm.v1.MsgInstantiateContract2',
  CosmwasmWasmV1MsgMigrateContract = 'cosmwasm.wasm.v1.MsgMigrateContract',
  CosmwasmWasmV1MsgStoreCode = 'cosmwasm.wasm.v1.MsgStoreCode',
  IbcApplicationsTransferV1MsgTransfer = 'ibc.applications.transfer.v1.MsgTransfer',
  IbcCoreChannelV1MsgAcknowledgement = 'ibc.core.channel.v1.MsgAcknowledgement',
  IbcCoreChannelV1MsgRecvPacket = 'ibc.core.channel.v1.MsgRecvPacket',
  IbcCoreChannelV1MsgTimeout = 'ibc.core.channel.v1.MsgTimeout',
  IbcCoreClientV1MsgCreateClient = 'ibc.core.client.v1.MsgCreateClient',
  IbcCoreClientV1MsgUpdateClient = 'ibc.core.client.v1.MsgUpdateClient',
  OsmosisTokenFactoryV1beta1MsgCreateDenom = 'osmosis.tokenfactory.v1beta1.MsgCreateDenom',
  OsmosisTokenFactoryV1beta1MsgMint = 'osmosis.tokenfactory.v1beta1.MsgMint',
  CosmwasmWasmV1MsgUpdateAdmin = 'cosmwasm.wasm.v1.MsgUpdateAdmin',
}

export type Neutron1TrxMsg =
  | Neutron1TrxMsgCosmosBankV1beta1MsgSend
  | Neutron1TrxMsgCosmwasmWasmV1MsgExecuteContract
  | Neutron1TrxMsgCosmwasmWasmV1MsgInstantiateContract
  | Neutron1TrxMsgCosmwasmWasmV1MsgInstantiateContract2
  | Neutron1TrxMsgCosmwasmWasmV1MsgMigrateContract
  | Neutron1TrxMsgCosmwasmWasmV1MsgStoreCode
  | Neutron1TrxMsgIbcApplicationsTransferV1MsgTransfer
  | Neutron1TrxMsgIbcCoreChannelV1MsgAcknowledgement
  | Neutron1TrxMsgIbcCoreChannelV1MsgRecvPacket
  | Neutron1TrxMsgIbcCoreChannelV1MsgTimeout
  | Neutron1TrxMsgIbcCoreClientV1MsgCreateClient
  | Neutron1TrxMsgIbcCoreClientV1MsgUpdateClient
  | Neutron1TrxMsgOsmosisTokenFactoryV1beta1MsgCreateDenom
  | Neutron1TrxMsgOsmosisTokenFactoryV1beta1MsgMintRootObject
  | Neutron1TrxMsgCosmwasmWasmV1MsgUpdateAdmin;

// types for msg type:: /cosmos.bank.v1beta1.MsgSend
export interface Neutron1TrxMsgCosmosBankV1beta1MsgSend extends IRangeMessage {
  type: Neutron1TrxMsgTypes.CosmosBankV1beta1MsgSend;
  data: {
    amount: { denom: string; amount: string }[];
    toAddress: string;
    fromAddress: string;
  };
}

// types for msg type:: /cosmwasm.wasm.v1.MsgExecuteContract
export interface Neutron1TrxMsgCosmwasmWasmV1MsgExecuteContract
  extends IRangeMessage {
  type: Neutron1TrxMsgTypes.CosmwasmWasmV1MsgExecuteContract;
  data: {
    msg: string;
    sender: string;
    contract: string;
  };
}

// types for msg type:: /cosmwasm.wasm.v1.MsgInstantiateContract
export interface Neutron1TrxMsgCosmwasmWasmV1MsgInstantiateContract
  extends IRangeMessage {
  type: Neutron1TrxMsgTypes.CosmwasmWasmV1MsgInstantiateContract;
  data: {
    msg: string;
    label: string;
    codeId: string;
    sender: string;
  };
}

// types for msg type:: /cosmwasm.wasm.v1.MsgInstantiateContract2
export interface Neutron1TrxMsgCosmwasmWasmV1MsgInstantiateContract2
  extends IRangeMessage {
  type: Neutron1TrxMsgTypes.CosmwasmWasmV1MsgInstantiateContract2;
  data: {
    msg: string;
    salt: string;
    label: string;
    codeId: string;
    sender: string;
  };
}

// types for msg type:: /cosmwasm.wasm.v1.MsgMigrateContract
export interface Neutron1TrxMsgCosmwasmWasmV1MsgMigrateContract
  extends IRangeMessage {
  type: Neutron1TrxMsgTypes.CosmwasmWasmV1MsgMigrateContract;
  data: {
    msg: string;
    codeId: string;
    sender: string;
    contract: string;
  };
}

// types for msg type:: /cosmwasm.wasm.v1.MsgStoreCode
export interface Neutron1TrxMsgCosmwasmWasmV1MsgStoreCode
  extends IRangeMessage {
  type: Neutron1TrxMsgTypes.CosmwasmWasmV1MsgStoreCode;
  data: {
    sender: string;
    wasmByteCode: string;
  };
}

// types for msg type:: /ibc.applications.transfer.v1.MsgTransfer
export interface Neutron1TrxMsgIbcApplicationsTransferV1MsgTransfer
  extends IRangeMessage {
  type: Neutron1TrxMsgTypes.IbcApplicationsTransferV1MsgTransfer;
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
  };
}

// types for msg type:: /ibc.core.channel.v1.MsgAcknowledgement
export interface Neutron1TrxMsgIbcCoreChannelV1MsgAcknowledgement
  extends IRangeMessage {
  type: Neutron1TrxMsgTypes.IbcCoreChannelV1MsgAcknowledgement;
  data: {
    packet: {
      data: string;
      sequence: string;
      sourcePort: string;
      sourceChannel: string;
      timeoutHeight: Record<string | number | symbol, unknown>; // todo: find example in db
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

// types for mgs type:: ibc.core.channel.v1.MsgRecvPacket
export interface Neutron1TrxMsgIbcCoreChannelV1MsgRecvPacket
  extends IRangeMessage {
  type: Neutron1TrxMsgTypes.IbcCoreChannelV1MsgRecvPacket;
  data: {
    packet: {
      data: string;
      sequence: string;
      sourcePort: string;
      sourceChannel: string;
      timeoutHeight: Record<string | number | symbol, unknown>; // todo: find example in db
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
export interface Neutron1TrxMsgIbcCoreChannelV1MsgTimeout
  extends IRangeMessage {
  type: Neutron1TrxMsgTypes.IbcCoreChannelV1MsgTimeout;
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
      timeoutTimestamp: string;
      destinationChannel: string;
    };
    signer: string;
    proofHeight: {
      revisionHeight?: string;
      revisionNumber?: string;
    };
    proofUnreceived: string;
    nextSequenceRecv: string;
  };
}

// types for mgs type:: /ibc.core.client.v1.MsgCreateClient
export interface Neutron1TrxMsgIbcCoreClientV1MsgCreateClient
  extends IRangeMessage {
  type: Neutron1TrxMsgTypes.IbcCoreClientV1MsgCreateClient;
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

// types for mgs type:: ibc.core.client.v1.MsgUpdateClient
export interface Neutron1TrxMsgIbcCoreClientV1MsgUpdateClient {
    type: string;
    data: Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientData;
}
interface Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientData {
    clientId: string;
    clientMessage: Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientClientMessage;
    signer: string;
}
interface Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientClientMessage {
    '@type': string;
    signedHeader: Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientSignedHeader;
    validatorSet: Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientValidatorSet;
    trustedHeight: Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientTrustedHeight;
    trustedValidators: Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientTrustedValidators;
}
interface Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientSignedHeader {
    header: Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientHeader;
    commit: Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientCommit;
}
interface Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientHeader {
    version: Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientVersion;
    chainId: string;
    height: string;
    time: string;
    lastBlockId: Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientLastBlockId;
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
interface Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientVersion {
    block: string;
    app: string;
}
interface Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientLastBlockId {
    hash: string;
    partSetHeader: Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientPartSetHeader;
}
interface Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientPartSetHeader {
    total: number;
    hash: string;
}
interface Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientCommit {
    height: string;
    blockId: Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientBlockId;
    signatures: Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientSignaturesItem[];
}
interface Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientBlockId {
    hash: string;
    partSetHeader: Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientPartSetHeader;
}
interface Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientSignaturesItem {
    blockIdFlag: string;
    validatorAddress?: string;
    timestamp: string;
    signature?: string;
}
interface Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientValidatorSet {
    validators: Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientValidatorsItem[];
    proposer: Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientProposer;
    totalVotingPower: string;
}
interface Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientValidatorsItem {
    address: string;
    pubKey: Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientPubKey;
    votingPower: string;
}
interface Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientPubKey {
    ed25519: string;
}
interface Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientProposer {
    address: string;
    pubKey: Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientPubKey;
    votingPower: string;
}
interface Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientTrustedHeight {
    revisionNumber: string;
    revisionHeight: string;
}
interface Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientTrustedValidators {
    validators: Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientValidatorsItem[];
    proposer: Neutron1TrxMsgIbcCoreClientV1MsgUpdateClientProposer;
    totalVotingPower: string;
}


// types for mgs type:: /osmosis.tokenfactory.v1beta1.MsgCreateDenom
export interface Neutron1TrxMsgOsmosisTokenFactoryV1beta1MsgCreateDenom
  extends IRangeMessage {
  type: Neutron1TrxMsgTypes.OsmosisTokenFactoryV1beta1MsgCreateDenom;
  data: {
    sender: string;
    subdenom: string;
  };
}

// types for mgs type:: /osmosis.tokenfactory.v1beta1.MsgMint
export interface Neutron1TrxMsgOsmosisTokenFactoryV1beta1MsgMintRootObject
  extends IRangeMessage {
  type: Neutron1TrxMsgTypes.OsmosisTokenFactoryV1beta1MsgMint;
  data: {
    amount: {
      denom: string;
      amount: string;
    };
    sender: string;
  };
}

// types for mgs type:: /cosmwasm.wasm.v1.MsgUpdateAdmin
export interface Neutron1TrxMsgCosmwasmWasmV1MsgUpdateAdmin
  extends IRangeMessage {
  type: Neutron1TrxMsgTypes.CosmwasmWasmV1MsgUpdateAdmin;
  data: {
    sender: string;
    contract: string;
    newAdmin: string;
  };
}
