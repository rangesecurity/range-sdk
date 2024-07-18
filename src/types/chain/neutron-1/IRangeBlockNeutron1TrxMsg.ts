import { IRangeMessage } from '../IRangeMessage';

export enum Neutron1TrxMsgTypes {
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
  OsmosisTokenfactoryV1beta1MsgMint = 'osmosis.tokenfactory.v1beta1.MsgMint',
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
  | Neutron1TrxMsgOsmosisTokenfactoryV1beta1MsgMint
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
    sender: string;
    contract: string;
    msg: Record<string | number | symbol, unknown>;
    funds?: {
      denom: string;
      amount: string;
    }[];
  };
}

// types for msg type:: /cosmwasm.wasm.v1.MsgInstantiateContract
export interface Neutron1TrxMsgCosmwasmWasmV1MsgInstantiateContract
  extends IRangeMessage {
  type: Neutron1TrxMsgTypes.CosmwasmWasmV1MsgInstantiateContract;
  data: {
    admin?: string;
    label: string;
    codeId: string;
    sender: string;
    msg: Record<string | number | symbol, unknown>;
  };
}

// types for msg type:: /cosmwasm.wasm.v1.MsgInstantiateContract2
export interface Neutron1TrxMsgCosmwasmWasmV1MsgInstantiateContract2
  extends IRangeMessage {
  type: Neutron1TrxMsgTypes.CosmwasmWasmV1MsgInstantiateContract2;
  data: {
    sender: string;
    admin?: string;
    codeId: string;
    label: string;
    msg: string;
    salt: string;
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
    instantiatePermission?: {
      permission: string;
      addresses: string[];
    };
  };
}

// types for msg type:: /ibc.applications.transfer.v1.MsgTransfer
export interface Neutron1TrxMsgIbcApplicationsTransferV1MsgTransfer
  extends IRangeMessage {
  type: Neutron1TrxMsgTypes.IbcApplicationsTransferV1MsgTransfer;
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

// types for msg type:: /ibc.core.channel.v1.MsgAcknowledgement
export interface Neutron1TrxMsgIbcCoreChannelV1MsgAcknowledgement
  extends IRangeMessage {
  type: Neutron1TrxMsgTypes.IbcCoreChannelV1MsgAcknowledgement;
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

// types for mgs type:: ibc.core.channel.v1.MsgRecvPacket
export interface Neutron1TrxMsgIbcCoreChannelV1MsgRecvPacket
  extends IRangeMessage {
  type: Neutron1TrxMsgTypes.IbcCoreChannelV1MsgRecvPacket;
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
export interface Neutron1TrxMsgIbcCoreChannelV1MsgTimeout
  extends IRangeMessage {
  type: Neutron1TrxMsgTypes.IbcCoreChannelV1MsgTimeout;
  data: {
    packet: {
      data: string;
      sequence: string;
      sourcePort: string;
      sourceChannel: string;
      destinationPort: string;
      destinationChannel: string;
      timeoutHeight?: {
        revisionHeight?: string;
        revisionNumber?: string;
      };
      timeoutTimestamp?: string;
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
        revisionHeight?: string;
        revisionNumber?: string;
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

// types for mgs type:: ibc.core.client.v1.MsgUpdateClient
export interface Neutron1TrxMsgIbcCoreClientV1MsgUpdateClient
  extends IRangeMessage {
  type: Neutron1TrxMsgTypes.IbcCoreClientV1MsgUpdateClient;
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
          round?: number;
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
          proposerPriority?: string;
        }[];
        proposer: {
          address: string;
          pubKey: {
            ed25519: string;
          };
          votingPower: string;
          proposerPriority?: string;
        };
        totalVotingPower?: string;
      };
      trustedHeight: {
        revisionNumber?: string;
        revisionHeight: string;
      };
      trustedValidators: {
        validators: {
          address: string;
          pubKey: {
            ed25519: string;
          };
          votingPower: string;
          proposerPriority?: string;
        }[];
        proposer: {
          address: string;
          pubKey: {
            ed25519: string;
          };
          votingPower: string;
          proposerPriority?: string;
        };
        totalVotingPower?: string;
      };
    };
    signer: string;
  };
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
export interface Neutron1TrxMsgOsmosisTokenfactoryV1beta1MsgMint
  extends IRangeMessage {
  type: Neutron1TrxMsgTypes.OsmosisTokenfactoryV1beta1MsgMint;
  data: {
    sender: string;
    amount: {
      denom: string;
      amount: string;
    };
    mintToAddress?: string;
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
