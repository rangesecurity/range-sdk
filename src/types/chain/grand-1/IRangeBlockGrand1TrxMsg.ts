import { IRangeMessage } from '../IRangeMessage';

export type Grand1TrxMsg =
  | Grand1TrxMsgIbcCoreClientV1MsgUpdateClient
  | Grand1TrxMsgIbcApplicationsTransferV1MsgTransfer
  | Grand1TrxMsgCircleCctpV1MsgReceiveMessage
  | Grand1TrxMsgIbcCoreConnectionV1MsgConnectionOpenAck
  | Grand1TrxMsgIbcCoreChannelV1MsgChannelOpenInit
  | Grand1TrxMsgCircleCctpV1MsgRemoveRemoteTokenMessenger
  | Grand1TrxMsgCircleCctpV1MsgSendMessage
  | Grand1TrxMsgCircleCctpV1MsgReplaceDepositForBurn
  | Grand1TrxMsgCircleCctpV1MsgDepositForBurn
  | Grand1TrxMsgIbcCoreConnectionV1MsgConnectionOpenInit
  | Grand1TrxMsgIbcCoreChannelV1MsgRecvPacket
  | Grand1TrxMsgIbcCoreChannelV1MsgChannelOpenAck
  | Grand1TrxMsgCircleCctpV1MsgLinkTokenPair
  | Grand1TrxMsgCosmosBankV1beta1MsgSend
  | Grand1TrxMsgIbcCoreChannelV1MsgAcknowledgement
  | Grand1TrxMsgIbcCoreChannelV1MsgTimeout
  | Grand1TrxMsgCosmosAuthzV1beta1MsgExec
  | Grand1TrxMsgCircleCctpV1MsgAddRemoteTokenMessenger
  | Grand1TrxMsgNobleFiatTokenFactoryMsgBurn
  | Grand1TrxMsgNobleFiatTokenFactoryMsgMint
  | Grand1TrxMsgIbcCoreClientV1MsgCreateClient;

enum Grand1TrxMsgTypes {
  IbcCoreClientV1MsgUpdateClient = 'ibc.core.client.v1.MsgUpdateClient',
  IbcApplicationsTransferV1MsgTransfer = 'ibc.applications.transfer.v1.MsgTransfer',
  CircleCctpV1MsgReceiveMessage = 'circle.cctp.v1.MsgReceiveMessage',
  IbcCoreConnectionV1MsgConnectionOpenAck = 'ibc.core.connection.v1.MsgConnectionOpenAck',
  IbcCoreChannelV1MsgChannelOpenInit = 'ibc.core.channel.v1.MsgChannelOpenInit',
  CircleCctpV1MsgRemoveRemoteTokenMessenger = 'circle.cctp.v1.MsgRemoveRemoteTokenMessenger',
  CircleCctpV1MsgSendMessage = 'circle.cctp.v1.MsgSendMessage',
  CircleCctpV1MsgReplaceDepositForBurn = 'circle.cctp.v1.MsgReplaceDepositForBurn',
  CircleCctpV1MsgDepositForBurn = 'circle.cctp.v1.MsgDepositForBurn',
  IbcCoreConnectionV1MsgConnectionOpenInit = 'ibc.core.connection.v1.MsgConnectionOpenInit',
  IbcCoreChannelV1MsgRecvPacket = 'ibc.core.channel.v1.MsgRecvPacket',
  IbcCoreChannelV1MsgChannelOpenAck = 'ibc.core.channel.v1.MsgChannelOpenAck',
  CircleCctpV1MsgLinkTokenPair = 'circle.cctp.v1.MsgLinkTokenPair',
  CosmosBankV1beta1MsgSend = 'cosmos.bank.v1beta1.MsgSend',
  IbcCoreChannelV1MsgAcknowledgement = 'ibc.core.channel.v1.MsgAcknowledgement',
  IbcCoreChannelV1MsgTimeout = 'ibc.core.channel.v1.MsgTimeout',
  CosmosAuthzV1beta1MsgExec = 'cosmos.authz.v1beta1.MsgExec',
  CircleCctpV1MsgAddRemoteTokenMessenger = 'circle.cctp.v1.MsgAddRemoteTokenMessenger',
  NobleFiatTokenFactoryMsgBurn = 'noble.fiattokenfactory.MsgBurn',
  NobleFiatTokenFactoryMsgMint = 'noble.fiattokenfactory.MsgMint',
  IbcCoreClientV1MsgCreateClient = 'ibc.core.client.v1.MsgCreateClient',
}

// types for mgs type:: /ibc.core.client.v1.MsgUpdateClient
interface Grand1TrxMsgIbcCoreClientV1MsgUpdateClient extends IRangeMessage {
  type: Grand1TrxMsgTypes.IbcCoreClientV1MsgUpdateClient;
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

// types for mgs type:: /ibc.applications.transfer.v1.MsgTransfer
interface Grand1TrxMsgIbcApplicationsTransferV1MsgTransfer
  extends IRangeMessage {
  type: Grand1TrxMsgTypes.IbcApplicationsTransferV1MsgTransfer;
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

// types for mgs type:: /circle.cctp.v1.MsgReceiveMessage
interface Grand1TrxMsgCircleCctpV1MsgReceiveMessage extends IRangeMessage {
  type: Grand1TrxMsgTypes.CircleCctpV1MsgReceiveMessage;
  data: {
    from: string;
    message: string;
    attestation: string;
  };
}

// types for mgs type:: /ibc.core.connection.v1.MsgConnectionOpenAck
interface Grand1TrxMsgIbcCoreConnectionV1MsgConnectionOpenAck
  extends IRangeMessage {
  type: Grand1TrxMsgTypes.IbcCoreConnectionV1MsgConnectionOpenAck;
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
          empty_child?: any;
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
    proof_client: string;
    proof_height: {
      revision_height: string;
      revision_number: string;
    };
    connection_id: string;
    proof_consensus: string;
    consensus_height: {
      revision_height: string;
      revision_number: string;
    };
    counterparty_connection_id: string;
    host_consensus_state_proof?: any;
  };
}

// types for mgs type:: /ibc.core.channel.v1.MsgChannelOpenInit
interface Grand1TrxMsgIbcCoreChannelV1MsgChannelOpenInit extends IRangeMessage {
  type: Grand1TrxMsgTypes.IbcCoreChannelV1MsgChannelOpenInit;
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

// types for mgs type:: /circle.cctp.v1.MsgRemoveRemoteTokenMessenger
interface Grand1TrxMsgCircleCctpV1MsgRemoveRemoteTokenMessenger
  extends IRangeMessage {
  type: Grand1TrxMsgTypes.CircleCctpV1MsgRemoveRemoteTokenMessenger;
  data: {
    from: string;
    domainId: number;
  };
}

// types for mgs type:: /circle.cctp.v1.MsgSendMessage
interface Grand1TrxMsgCircleCctpV1MsgSendMessage extends IRangeMessage {
  type: Grand1TrxMsgTypes.CircleCctpV1MsgSendMessage;
  data: {
    from: string;
    recipient: string;
    messageBody: string;
  };
}

// types for mgs type:: /circle.cctp.v1.MsgReplaceDepositForBurn
interface Grand1TrxMsgCircleCctpV1MsgReplaceDepositForBurn
  extends IRangeMessage {
  type: Grand1TrxMsgTypes.CircleCctpV1MsgReplaceDepositForBurn;
  data: {
    from: string;
    originalMessage: string;
    newMintRecipient: string;
    originalAttestation: string;
    newDestinationCaller: string;
  };
}

// types for mgs type:: /circle.cctp.v1.MsgDepositForBurn
interface Grand1TrxMsgCircleCctpV1MsgDepositForBurn extends IRangeMessage {
  type: Grand1TrxMsgTypes.CircleCctpV1MsgDepositForBurn;
  data: {
    from: string;
    amount: string;
    burnToken: string;
    mintRecipient: string;
  };
}

// types for mgs type:: /ibc.core.connection.v1.MsgConnectionOpenInit
interface Grand1TrxMsgIbcCoreConnectionV1MsgConnectionOpenInit
  extends IRangeMessage {
  type: Grand1TrxMsgTypes.IbcCoreConnectionV1MsgConnectionOpenInit;
  data: {
    signer: string;
    clientId: string;
    counterparty: {
      prefix: {
        keyPrefix: string;
      };
      clientId: string;
    };
  };
}

// types for mgs type:: /ibc.core.channel.v1.MsgRecvPacket
interface Grand1TrxMsgIbcCoreChannelV1MsgRecvPacket extends IRangeMessage {
  type: Grand1TrxMsgTypes.IbcCoreChannelV1MsgRecvPacket;
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

// types for mgs type:: /ibc.core.channel.v1.MsgChannelOpenAck
interface Grand1TrxMsgIbcCoreChannelV1MsgChannelOpenAck extends IRangeMessage {
  type: Grand1TrxMsgTypes.IbcCoreChannelV1MsgChannelOpenAck;
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

// types for mgs type:: /circle.cctp.v1.MsgLinkTokenPair
interface Grand1TrxMsgCircleCctpV1MsgLinkTokenPair extends IRangeMessage {
  type: Grand1TrxMsgTypes.CircleCctpV1MsgLinkTokenPair;
  data: {
    from: string;
    localToken: string;
    remoteToken: string;
    remoteDomain: number;
  };
}

// types for mgs type:: /cosmos.bank.v1beta1.MsgSend
interface Grand1TrxMsgCosmosBankV1beta1MsgSend extends IRangeMessage {
  type: Grand1TrxMsgTypes.CosmosBankV1beta1MsgSend;
  data: {
    amount: {
      denom: string;
      amount: string;
    }[];
    toAddress: string;
    fromAddress: string;
  };
}

// types for mgs type:: /ibc.core.channel.v1.MsgAcknowledgement
interface Grand1TrxMsgIbcCoreChannelV1MsgAcknowledgement extends IRangeMessage {
  type: Grand1TrxMsgTypes.IbcCoreChannelV1MsgAcknowledgement;
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

// types for mgs type:: /ibc.core.channel.v1.MsgTimeout
interface Grand1TrxMsgIbcCoreChannelV1MsgTimeout extends IRangeMessage {
  type: Grand1TrxMsgTypes.IbcCoreChannelV1MsgTimeout;
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

// types for mgs type:: /cosmos.authz.v1beta1.MsgExec
interface Grand1TrxMsgCosmosAuthzV1beta1MsgExec extends IRangeMessage {
  type: Grand1TrxMsgTypes.CosmosAuthzV1beta1MsgExec;
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

// types for mgs type:: /circle.cctp.v1.MsgAddRemoteTokenMessenger
interface Grand1TrxMsgCircleCctpV1MsgAddRemoteTokenMessenger {
  type: Grand1TrxMsgTypes.CircleCctpV1MsgAddRemoteTokenMessenger;
  data: {
    from: string;
    address: string;
    domainId: number;
  };
}

// types for mgs type:: /noble.fiattokenfactory.MsgBurn
interface Grand1TrxMsgNobleFiatTokenFactoryMsgBurn extends IRangeMessage {
  type: Grand1TrxMsgTypes.NobleFiatTokenFactoryMsgBurn;
  data: {
    from: string;
    amount: {
      denom: string;
      amount: string;
    };
  };
}

// types for mgs type:: /noble.fiattokenfactory.MsgMint
interface Grand1TrxMsgNobleFiatTokenFactoryMsgMint extends IRangeMessage {
  type: Grand1TrxMsgTypes.NobleFiatTokenFactoryMsgMint;
  data: {
    from: string;
    amount: {
      denom: string;
      amount: string;
    };
    address: string;
  };
}

// types for mgs type:: /ibc.core.client.v1.MsgCreateClient
interface Grand1TrxMsgIbcCoreClientV1MsgCreateClient {
  type: Grand1TrxMsgTypes.IbcCoreClientV1MsgCreateClient;
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
          empty_child?: any;
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
