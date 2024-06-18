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
  | Noble1TrxMsgTypeMsgGrantAllowance
  | Noble1TrxMsgTypeMsgChannelOpenInit
  | Noble1TrxMsgTypeMsgConnectionOpenTry
  | Noble1TrxMsgTypeMsgConnectionOpenInit
  | Noble1TrxMsgIbcApplicationsTransferV1MsgTransfer
  | Noble1TrxMsgCosmosBankV1beta1MsgSend
  | Noble1TrxMsgIbcCoreChannelV1MsgChannelOpenAck
  | Noble1TrxMsgNobleFiatTokenFactoryMsgMint
  | Noble1TrxMsgIbcCoreChannelOpenTry
  | Noble1TrxMsgIbcCoreChannelOpenConfirm
  | Noble1TrxMsgIbcCoreChannelAcknowledgement
  | Noble1TrxMsgCosmosAuthzMsgGrant
  | Noble1TrxMsgIbcCoreClientCreateClient
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
    proofHeight: {
      revisionHeight: string;
      revisionNumber: string;
    };
    proofUnreceived: string;
    nextSequenceRecv: string;
  };
}

// types for msg type:: /cosmos.authz.v1beta1.MsgExec
export interface Noble1TrxMsgCosmosAuthzV1beta1MsgExec extends IRangeMessage {
  type: Noble1TrxMsgTypes.CosmosAuthzV1beta1MsgExec;
  data: {
    msgs: {
      '@type': string;
      amount: {
        denom: string;
        amount: string;
      }[];
      to_address: string;
      from_address: string;
    }[];
    '@type': string;
    grantee: string;
  };
}

// types for msg type:: /ibc.core.channel.v1.MsgRecvPacket
export interface Noble1TrxMsgIbcCoreChannelV1MsgRecvPacket
  extends IRangeMessage {
  type: Noble1TrxMsgTypes.IbcCoreChannelV1MsgRecvPacket;
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
    proofHeight: {
      revisionHeight: string;
      revisionNumber: string;
    };
    proofCommitment: string;
  };
  status: string;
  block_number: string;
  addresses: string[];
  contract_addresses?: unknown;
}

// types for msg type:: /ibc.core.connection.v1.MsgConnectionOpenAck
export interface Noble1TrxMsgIbcCoreConnectionV1MsgConnectionOpenAck
  extends IRangeMessage {
  type: Noble1TrxMsgTypes.IbcCoreConnectionV1MsgConnectionOpenAck;
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
      allow_update_after_misbehavior: boolean;
    };
    proof_client: string;
    proof_height: {
      revision_height: string;
      revision_number: string;
    };
    connection_id: string;
    proof_consensus: string;
  };
  status: string;
  block_number: string;
  addresses: string[];
  contract_addresses?: unknown;
}

// types for msg type:: /cosmos.feegrant.v1beta1.MsgGrantAllowance
export interface Noble1TrxMsgTypeMsgGrantAllowance extends IRangeMessage {
  type: Noble1TrxMsgTypes.CosmosFeegrantV1beta1MsgGrantAllowance;
  data: {
    '@type': string;
    grantee: string;
    granter: string;
    allowance: {
      '@type': string;
      allowance: {
        '@type': string;
        expiration: null;
        spend_limit: string[];
      };
      allowed_messages: string[];
    };
  };
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
export interface Noble1TrxMsgTypeMsgConnectionOpenTry extends IRangeMessage {
  type: Noble1TrxMsgTypes.IbcCoreConnectionV1MsgConnectionOpenTry;
  data: {
    signer: string;
    client_id: string;
    proof_init: string;
    proof_height: {
      revision_height: string;
      revision_number: string;
    };
    consensus_height: {
      revision_height: string;
      revision_number: string;
    };
    connection_id: string;
    counterparty: {
      client_id: string;
      connection_id: string;
    };
    delay_period: string;
    proof_client: string;
    client_state: string;
    counterparty_versions: { features: string[]; identifier: string }[];
    previous_connection_id: string;
    host_consensus_state_proof: string | null;
  };
}

// types for msg type:: /ibc.core.connection.v1.MsgConnectionOpenInit
export interface Noble1TrxMsgTypeMsgConnectionOpenInit extends IRangeMessage {
  type: Noble1TrxMsgTypes.IbcCoreConnectionV1MsgConnectionOpenInit;
  data: {
    signer: string;
    client_id: string;
    counterparty: {
      prefix: {
        keyPrefix: string;
      };
      client_id: string;
    };
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
    proofHeight: { revisionHeight: string };
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
export interface Noble1TrxMsgIbcCoreChannelAcknowledgement
  extends IRangeMessage {
  type: Noble1TrxMsgTypes.IbcCoreChannelV1MsgAcknowledgement;
  data: {
    packet: {
      data: string;
      sequence: string;
      sourcePort: string;
      sourceChannel: string;
      timeoutHeight: Record<string | number | symbol, unknown>; // todo;
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
export interface Noble1TrxMsgIbcCoreClientCreateClient extends IRangeMessage {
  type: Noble1TrxMsgTypes.IbcCoreClientV1MsgCreateClient;
  data: {
    '@type': string;
    signer: string;
    client_state: {
      '@type': string;
      chain_id: string;
      proof_specs: any[];
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
export interface Noble1TrxMsgIbcCoreClientV1MsgUpdateClient
  extends IRangeMessage {
  type: Noble1TrxMsgTypes.IbcCoreClientV1MsgUpdateClient;
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
