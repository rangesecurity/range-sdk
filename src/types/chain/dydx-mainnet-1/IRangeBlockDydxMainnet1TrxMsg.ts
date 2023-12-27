import { IRangeMessage } from '../IRangeMessage';

export type DydxMainnet1TrxMsg =
  | DydxMainnet1TrxMsgCosmosBankV1beta1MsgMultiSend
  | DydxMainnet1TrxMsgCosmosBankV1beta1MsgSend
  | DydxMainnet1TrxMsgCosmosDistributionV1beta1MsgWithdrawDelegatorReward
  | DydxMainnet1TrxMsgCosmosDistributionV1beta1MsgWithdrawValidatorCommission
  | DydxMainnet1TrxMsgCosmosGovV1beta1MsgVote
  | DydxMainnet1TrxMsgCosmosGovV1MsgSubmitProposal
  | DydxMainnet1TrxMsgCosmosGovV1MsgVote
  | DydxMainnet1TrxMsgCosmosSlashingV1beta1MsgUnjail
  | DydxMainnet1TrxMsgCosmosStakingV1beta1MsgBeginRedelegate
  | DydxMainnet1TrxMsgCosmosStakingV1beta1MsgCancelUnbondingDelegation
  | DydxMainnet1TrxMsgCosmosStakingV1beta1MsgCreateValidator
  | DydxMainnet1TrxMsgCosmosStakingV1beta1MsgDelegate
  | DydxMainnet1TrxMsgCosmosStakingV1beta1MsgEditValidator
  | DydxMainnet1TrxMsgCosmosStakingV1beta1MsgUndelegate
  | DydxMainnet1TrxMsgDydxprotocolBridgeMsgAcknowledgeBridges
  | DydxMainnet1TrxMsgDydxprotocolClobMsgCancelOrder
  | DydxMainnet1TrxMsgDydxprotocolClobMsgPlaceOrder
  | DydxMainnet1TrxMsgDydxprotocolClobMsgProposedOperations
  | DydxMainnet1TrxMsgDydxprotocolPerpetualsMsgAddPremiumVotes
  | DydxMainnet1TrxMsgDydxprotocolPricesMsgUpdateMarketPrices
  | DydxMainnet1TrxMsgDydxprotocolSendingMsgCreateTransfer
  | DydxMainnet1TrxMsgDydxprotocolSendingMsgDepositToSubaccount
  | DydxMainnet1TrxMsgDydxprotocolSendingMsgWithdrawFromSubaccount
  | DydxMainnet1TrxMsgIbcApplicationsTransferV1MsgTransfer
  | DydxMainnet1TrxMsgIbcCoreChannelV1MsgAcknowledgement
  | DydxMainnet1TrxMsgIbcCoreChannelV1MsgChannelOpenAck
  | DydxMainnet1TrxMsgIbcCoreChannelV1MsgChannelOpenConfirm
  | DydxMainnet1TrxMsgIbcCoreChannelV1MsgChannelOpenInit
  | DydxMainnet1TrxMsgIbcCoreChannelV1MsgChannelOpenTry
  | DydxMainnet1TrxMsgIbcCoreChannelV1MsgRecvPacket
  | DydxMainnet1TrxMsgIbcCoreChannelV1MsgTimeout
  | DydxMainnet1TrxMsgIbcCoreClientV1MsgCreateClient
  | DydxMainnet1TrxMsgIbcCoreClientV1MsgUpdateClient
  | DydxMainnet1TrxMsgIbcCoreConnectionV1MsgConnectionOpenAck
  | DydxMainnet1TrxMsgIbcCoreConnectionV1MsgConnectionOpenConfirm
  | DydxMainnet1TrxMsgIbcCoreConnectionV1MsgConnectionOpenInit
  | DydxMainnet1TrxMsgIbcCoreConnectionV1MsgConnectionOpenTry;

enum DydxMainnet1TrxMsgTypes {
  CosmosBankV1beta1MsgMultiSend = 'cosmos.bank.v1beta1.MsgMultiSend',
  CosmosBankV1beta1MsgSend = 'cosmos.bank.v1beta1.MsgSend',
  CosmosDistributionV1beta1MsgWithdrawDelegatorReward = 'cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
  CosmosDistributionV1beta1MsgWithdrawValidatorCommission = 'cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission',
  CosmosGovV1beta1MsgVote = 'cosmos.gov.v1beta1.MsgVote',
  CosmosGovV1MsgSubmitProposal = 'cosmos.gov.v1.MsgSubmitProposal',
  CosmosGovV1MsgVote = 'cosmos.gov.v1.MsgVote',
  CosmosSlashingV1beta1MsgUnjail = 'cosmos.slashing.v1beta1.MsgUnjail',
  CosmosStakingV1beta1MsgBeginRedelegate = 'cosmos.staking.v1beta1.MsgBeginRedelegate',
  CosmosStakingV1beta1MsgCancelUnbondingDelegation = 'cosmos.staking.v1beta1.MsgCancelUnbondingDelegation',
  CosmosStakingV1beta1MsgCreateValidator = 'cosmos.staking.v1beta1.MsgCreateValidator',
  CosmosStakingV1beta1MsgDelegate = 'cosmos.staking.v1beta1.MsgDelegate',
  CosmosStakingV1beta1MsgEditValidator = 'cosmos.staking.v1beta1.MsgEditValidator',
  CosmosStakingV1beta1MsgUndelegate = 'cosmos.staking.v1beta1.MsgUndelegate',
  DydxprotocolBridgeMsgAcknowledgeBridges = 'dydxprotocol.bridge.MsgAcknowledgeBridges',
  DydxprotocolClobMsgCancelOrder = 'dydxprotocol.clob.MsgCancelOrder',
  DydxprotocolClobMsgPlaceOrder = 'dydxprotocol.clob.MsgPlaceOrder',
  DydxprotocolClobMsgProposedOperations = 'dydxprotocol.clob.MsgProposedOperations',
  DydxprotocolPerpetualsMsgAddPremiumVotes = 'dydxprotocol.perpetuals.MsgAddPremiumVotes',
  DydxprotocolPricesMsgUpdateMarketPrices = 'dydxprotocol.prices.MsgUpdateMarketPrices',
  DydxprotocolSendingMsgCreateTransfer = 'dydxprotocol.sending.MsgCreateTransfer',
  DydxprotocolSendingMsgDepositToSubaccount = 'dydxprotocol.sending.MsgDepositToSubaccount',
  DydxprotocolSendingMsgWithdrawFromSubaccount = 'dydxprotocol.sending.MsgWithdrawFromSubaccount',
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

// types for mgs type:: /cosmos.bank.v1beta1.MsgMultiSend
export interface DydxMainnet1TrxMsgCosmosBankV1beta1MsgMultiSend
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.CosmosBankV1beta1MsgMultiSend;
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

// types for mgs type:: /cosmos.bank.v1beta1.MsgSend
export interface DydxMainnet1TrxMsgCosmosBankV1beta1MsgSend
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.CosmosBankV1beta1MsgSend;
  data: {
    amount: {
      denom: string;
      amount: string;
    }[];
    toAddress: string;
    fromAddress: string;
  };
}

// types for mgs type:: /cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward
export interface DydxMainnet1TrxMsgCosmosDistributionV1beta1MsgWithdrawDelegatorReward
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.CosmosDistributionV1beta1MsgWithdrawDelegatorReward;
  data: {
    delegatorAddress: string;
    validatorAddress: string;
  };
}

// types for mgs type:: /cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward
export interface DydxMainnet1TrxMsgCosmosDistributionV1beta1MsgWithdrawValidatorCommission
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.CosmosDistributionV1beta1MsgWithdrawValidatorCommission;
  data: {
    validatorAddress: string;
  };
}

// types for mgs type:: /cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward
export interface DydxMainnet1TrxMsgCosmosGovV1beta1MsgVote
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.CosmosGovV1beta1MsgVote;
  data: {
    voter: string;
    option: string;
    proposalId: string;
  };
}

// types for mgs type:: /cosmos.gov.v1.MsgSubmitProposal
export interface DydxMainnet1TrxMsgCosmosGovV1MsgSubmitProposal
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.CosmosGovV1MsgSubmitProposal;
  data: {
    title: string;
    summary: string;
    messages: {
      '@type': string;
      params?: {
        id: number;
        pair?: string;
        exponent?: number;
        minExchanges?: number;
        minPriceChangePpm?: number;
        exchangeConfigJson?: string;
        ticker?: string;
        marketId?: number;
        liquidityTier?: number;
        atomicResolution?: number;
      };
      authority: string;
      clobPair?: {
        id: number;
        status: string;
        subticksPerTick: number;
        stepBaseQuantums: string;
        perpetualClobMetadata: {
          perpetualId: number;
        };
        quantumConversionExponent: number;
      };
      msg?: {
        '@type': string;
        clobPair: {
          id: number;
          status: string;
          subticksPerTick: number;
          stepBaseQuantums: string;
          perpetualClobMetadata: {
            perpetualId: number;
          };
          quantumConversionExponent: number;
        };
        authority: string;
      };
      delayBlocks?: number;
    }[];
    proposer: string;
    initialDeposit: {
      denom: string;
      amount: string;
    }[];
  };
}

// types for mgs type:: /cosmos.gov.v1.MsgVote
export interface DydxMainnet1TrxMsgCosmosGovV1MsgVote extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.CosmosGovV1MsgVote;
  data: {
    voter: string;
    option: string;
    proposalId: string;
  };
}

// types for mgs type:: /cosmos.slashing.v1beta1.MsgUnjail
export interface DydxMainnet1TrxMsgCosmosSlashingV1beta1MsgUnjail
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.CosmosSlashingV1beta1MsgUnjail;
  data: {
    validatorAddr: string;
  };
}

// types for mgs type:: /cosmos.staking.v1beta1.MsgBeginRedelegate
export interface DydxMainnet1TrxMsgCosmosStakingV1beta1MsgBeginRedelegate
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.CosmosStakingV1beta1MsgBeginRedelegate;
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
export interface DydxMainnet1TrxMsgCosmosStakingV1beta1MsgCancelUnbondingDelegation
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.CosmosStakingV1beta1MsgCancelUnbondingDelegation;
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

// types for mgs type:: /cosmos.staking.v1beta1.MsgCreateValidator
export interface DydxMainnet1TrxMsgCosmosStakingV1beta1MsgCreateValidator
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.CosmosStakingV1beta1MsgCreateValidator;
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

// types for mgs type:: /cosmos.staking.v1beta1.MsgDelegate
export interface DydxMainnet1TrxMsgCosmosStakingV1beta1MsgDelegate
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.CosmosStakingV1beta1MsgDelegate;
  data: {
    amount: {
      denom: string;
      amount: string;
    };
    delegatorAddress: string;
    validatorAddress: string;
  };
}

// types for mgs type:: /cosmos.staking.v1beta1.MsgEditValidator
export interface DydxMainnet1TrxMsgCosmosStakingV1beta1MsgEditValidator
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.CosmosStakingV1beta1MsgEditValidator;
  data: {
    description: {
      details: string;
      moniker: string;
      website: string;
      identity: string;
      securityContact: string;
    };
    commissionRate?: string;
    validatorAddress: string;
    minSelfDelegation?: string;
  };
}

// types for mgs type:: /cosmos.staking.v1beta1.MsgUndelegate
export interface DydxMainnet1TrxMsgCosmosStakingV1beta1MsgUndelegate
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.CosmosStakingV1beta1MsgUndelegate;
  data: {
    amount: {
      denom: string;
      amount: string;
    };
    delegatorAddress: string;
    validatorAddress: string;
  };
}

// types for mgs type:: /dydxprotocol.bridge.MsgAcknowledgeBridges
export interface DydxMainnet1TrxMsgDydxprotocolBridgeMsgAcknowledgeBridges
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.DydxprotocolBridgeMsgAcknowledgeBridges;
  data: {
    events?: {
      id: number;
      coin: {
        denom: string;
        amount: string;
      };
      address: string;
      ethBlockHeight: string;
    }[];
  };
}

// types for mgs type:: /dydxprotocol.clob.MsgCancelOrder
export interface DydxMainnet1TrxMsgDydxprotocolClobMsgCancelOrder
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.DydxprotocolClobMsgCancelOrder;
  data: {
    orderId: {
      clientId?: number;
      clobPairId?: number;
      orderFlags: number;
      subaccountId: {
        owner: string;
      };
    };
    goodTilBlockTime: number;
  };
}

// types for mgs type:: /dydxprotocol.clob.MsgPlaceOrder
export interface DydxMainnet1TrxMsgDydxprotocolClobMsgPlaceOrder
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.DydxprotocolClobMsgPlaceOrder;
  data: {
    order: {
      side: string;
      orderId: {
        clientId?: number;
        clobPairId?: number;
        orderFlags: number;
        subaccountId: {
          owner: string;
          number?: number;
        };
      };
      quantums: string;
      subticks: string;
      timeInForce?: string;
      conditionType?: string;
      clientMetadata?: number;
      goodTilBlockTime: number;
      conditionalOrderTriggerSubticks?: string;
    };
  };
}

// types for mgs type:: /dydxprotocol.clob.MsgProposedOperations
export interface DydxMainnet1TrxMsgDydxprotocolClobMsgProposedOperations
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.DydxprotocolClobMsgProposedOperations;
  data: {
    operationsQueue?: {
      shortTermOrderPlacement?: string;
      match?: {
        matchOrders: {
          fills: {
            fillAmount: string;
            makerOrderId: {
              clientId: number;
              clobPairId?: number;
              subaccountId: {
                owner: string;
                number?: number;
              };
              orderFlags?: number;
            };
          }[];
          takerOrderId: {
            clientId: number;
            clobPairId?: number;
            orderFlags?: number;
            subaccountId: {
              owner: string;
              number?: number;
            };
          };
        };
      };
    }[];
  };
}

// types for mgs type:: /dydxprotocol.perpetuals.MsgAddPremiumVotes
export interface DydxMainnet1TrxMsgDydxprotocolPerpetualsMsgAddPremiumVotes
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.DydxprotocolPerpetualsMsgAddPremiumVotes;
  data: {
    votes: {
      premiumPpm: number;
      perpetualId?: number;
    }[];
  };
}

// types for mgs type:: /dydxprotocol.prices.MsgUpdateMarketPrices
export interface DydxMainnet1TrxMsgDydxprotocolPricesMsgUpdateMarketPrices
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.DydxprotocolPricesMsgUpdateMarketPrices;
  data: {
    marketPriceUpdates?: {
      price: string;
      marketId: number;
    }[];
  };
}

// types for mgs type:: /dydxprotocol.sending.MsgCreateTransfer
export interface DydxMainnet1TrxMsgDydxprotocolSendingMsgCreateTransfer
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.DydxprotocolSendingMsgCreateTransfer;
  data: {
    transfer: {
      amount: string;
      sender: {
        owner: string;
        number?: number;
      };
      recipient: {
        owner: string;
        number?: number;
      };
    };
  };
}

// types for mgs type:: /dydxprotocol.sending.MsgDepositToSubaccount
export interface DydxMainnet1TrxMsgDydxprotocolSendingMsgDepositToSubaccount
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.DydxprotocolSendingMsgDepositToSubaccount;
  data: {
    sender: string;
    quantums: string;
    recipient: {
      owner: string;
      number?: number;
    };
  };
}

// types for mgs type:: /dydxprotocol.sending.MsgWithdrawFromSubaccount
export interface DydxMainnet1TrxMsgDydxprotocolSendingMsgWithdrawFromSubaccount
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.DydxprotocolSendingMsgWithdrawFromSubaccount;
  data: {
    sender: {
      owner: string;
      number?: number;
    };
    quantums: string;
    recipient: string;
  };
}

// types for mgs type:: /ibc.applications.transfer.v1.MsgTransfer
export interface DydxMainnet1TrxMsgIbcApplicationsTransferV1MsgTransfer
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.IbcApplicationsTransferV1MsgTransfer;
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
    timeoutHeight:
      | string
      | {
          revisionHeight?: string;
          revisionNumber?: string;
        };
    timeoutTimestamp?: string;
  };
}

// types for mgs type:: /ibc.core.channel.v1.MsgAcknowledgement
export interface DydxMainnet1TrxMsgIbcCoreChannelV1MsgAcknowledgement
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.IbcCoreChannelV1MsgAcknowledgement;
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
    proofAcked: string;
    proofHeight: {
      revisionHeight: string;
      revisionNumber: string;
    };
    acknowledgement: string;
  };
}

// types for mgs type:: /ibc.core.channel.v1.MsgChannelOpenAck
export interface DydxMainnet1TrxMsgIbcCoreChannelV1MsgChannelOpenAck
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.IbcCoreChannelV1MsgChannelOpenAck;
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

// types for mgs type:: /ibc.core.channel.v1.MsgChannelOpenConfirm
export interface DydxMainnet1TrxMsgIbcCoreChannelV1MsgChannelOpenConfirm
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.IbcCoreChannelV1MsgChannelOpenConfirm;
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

// types for mgs type:: /ibc.core.channel.v1.MsgChannelOpenInit
export interface DydxMainnet1TrxMsgIbcCoreChannelV1MsgChannelOpenInit
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.IbcCoreChannelV1MsgChannelOpenInit;
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

// types for mgs type:: /ibc.core.channel.v1.MsgChannelOpenTry
export interface DydxMainnet1TrxMsgIbcCoreChannelV1MsgChannelOpenTry
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.IbcCoreChannelV1MsgChannelOpenTry;
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

// types for mgs type:: /ibc.core.channel.v1.MsgRecvPacket
export interface DydxMainnet1TrxMsgIbcCoreChannelV1MsgRecvPacket
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.IbcCoreChannelV1MsgRecvPacket;
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
      revisionHeight: string;
      revisionNumber: string;
    };
    proofCommitment: string;
  };
}

// types for mgs type:: /ibc.core.channel.v1.MsgTimeout
export interface DydxMainnet1TrxMsgIbcCoreChannelV1MsgTimeout
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.IbcCoreChannelV1MsgTimeout;
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
      revisionHeight: string;
      revisionNumber: string;
    };
    proofUnreceived: string;
    nextSequenceRecv: string;
  };
}

// types for mgs type:: /ibc.core.client.v1.MsgCreateClient
export interface DydxMainnet1TrxMsgIbcCoreClientV1MsgCreateClient
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.IbcCoreClientV1MsgCreateClient;
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

// types for mgs type:: /ibc.core.client.v1.MsgUpdateClient
export interface DydxMainnet1TrxMsgIbcCoreClientV1MsgUpdateClient
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.IbcCoreClientV1MsgUpdateClient;
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
            signature?: string;
            timestamp: string;
            blockIdFlag: string;
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
          proposerPriority?: string;
        };
        validators: {
          pubKey: {
            ed25519: string;
          };
          address: string;
          votingPower: string;
          proposerPriority?: string;
        }[];
        totalVotingPower: string;
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
          proposerPriority?: string;
        };
        validators: {
          pubKey: {
            ed25519: string;
          };
          address: string;
          votingPower: string;
          proposerPriority?: string;
        }[];
        totalVotingPower?: string;
      };
    };
  };
}

// types for mgs type:: /ibc.core.connection.v1.MsgConnectionOpenAck
export interface DydxMainnet1TrxMsgIbcCoreConnectionV1MsgConnectionOpenAck
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.IbcCoreConnectionV1MsgConnectionOpenAck;
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
        revisionNumber: string;
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
      revisionNumber: string;
    };
    counterpartyConnectionId: string;
  };
}

// types for mgs type:: /ibc.core.connection.v1.MsgConnectionOpenConfirm
export interface DydxMainnet1TrxMsgIbcCoreConnectionV1MsgConnectionOpenConfirm
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.IbcCoreConnectionV1MsgConnectionOpenConfirm;
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

// types for mgs type:: /ibc.core.connection.v1.MsgConnectionOpenInit
export interface DydxMainnet1TrxMsgIbcCoreConnectionV1MsgConnectionOpenInit
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.IbcCoreConnectionV1MsgConnectionOpenInit;
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

// types for mgs type:: /ibc.core.connection.v1.MsgConnectionOpenTry
export interface DydxMainnet1TrxMsgIbcCoreConnectionV1MsgConnectionOpenTry
  extends IRangeMessage {
  type: DydxMainnet1TrxMsgTypes.IbcCoreConnectionV1MsgConnectionOpenTry;
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
        revisionNumber: string;
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
      revisionNumber: string;
    };
    counterpartyVersions: {
      features: string[];
      identifier: string;
    }[];
  };
}
