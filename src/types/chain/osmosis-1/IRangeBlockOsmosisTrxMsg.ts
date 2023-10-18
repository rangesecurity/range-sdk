import { IRangeMessage } from '../IRangeMessage';

export enum OsmosisTrxMsgTypes {
  CosmosAuthzV1beta1MsgExec = 'cosmos.authz.v1beta1.MsgExec',
  CosmosAuthzV1beta1MsgGrant = 'cosmos.authz.v1beta1.MsgGrant',
  CosmosAuthzV1beta1MsgRevoke = 'cosmos.authz.v1beta1.MsgRevoke',
  CosmosBankV1beta1MsgSend = 'cosmos.bank.v1beta1.MsgSend',
  CosmosDistributionV1beta1MsgSetWithdrawAddress = 'cosmos.distribution.v1beta1.MsgSetWithdrawAddress',
  CosmosDistributionV1beta1MsgWithdrawDelegatorReward = 'cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
  CosmosDistributionV1beta1MsgWithdrawValidatorCommission = 'cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission',
  CosmosGovV1beta1MsgDeposit = 'cosmos.gov.v1beta1.MsgDeposit',
  CosmosGovV1beta1MsgSubmitProposal = 'cosmos.gov.v1beta1.MsgSubmitProposal',
  CosmosGovV1beta1MsgVote = 'cosmos.gov.v1beta1.MsgVote',
  CosmosSlashingV1beta1MsgUnjail = 'cosmos.slashing.v1beta1.MsgUnjail',
  CosmosStakingV1beta1MsgBeginRedelegate = 'cosmos.staking.v1beta1.MsgBeginRedelegate',
  CosmosStakingV1beta1MsgDelegate = 'cosmos.staking.v1beta1.MsgDelegate',
  CosmosStakingV1beta1MsgEditValidator = 'cosmos.staking.v1beta1.MsgEditValidator',
  CosmosStakingV1beta1MsgUndelegate = 'cosmos.staking.v1beta1.MsgUndelegate',
  CosmosVestingV1beta1MsgCreateVestingAccount = 'cosmos.vesting.v1beta1.MsgCreateVestingAccount',
  CosmwasmWasmV1MsgExecuteContract = 'cosmwasm.wasm.v1.MsgExecuteContract',
  CosmwasmWasmV1MsgInstantiateContract = 'cosmwasm.wasm.v1.MsgInstantiateContract',
  CosmwasmWasmV1MsgMigrateContract = 'cosmwasm.wasm.v1.MsgMigrateContract',
  CosmwasmWasmV1MsgStoreCode = 'cosmwasm.wasm.v1.MsgStoreCode',
  IbcApplicationsTransferV1MsgTransfer = 'ibc.applications.transfer.v1.MsgTransfer',
  IbcCoreChannelV1MsgAcknowledgement = 'ibc.core.channel.v1.MsgAcknowledgement',
  IbcCoreChannelV1MsgChannelCloseConfirm = 'ibc.core.channel.v1.MsgChannelCloseConfirm',
  IbcCoreChannelV1MsgChannelOpenConfirm = 'ibc.core.channel.v1.MsgChannelOpenConfirm',
  IbcCoreChannelV1MsgChannelOpenTry = 'ibc.core.channel.v1.MsgChannelOpenTry',
  IbcCoreChannelV1MsgRecvPacket = 'ibc.core.channel.v1.MsgRecvPacket',
  IbcCoreChannelV1MsgTimeout = 'ibc.core.channel.v1.MsgTimeout',
  IbcCoreClientV1MsgCreateClient = 'ibc.core.client.v1.MsgCreateClient',
  IbcCoreClientV1MsgUpdateClient = 'ibc.core.client.v1.MsgUpdateClient',
  IbcCoreConnectionV1MsgConnectionOpenConfirm = 'ibc.core.connection.v1.MsgConnectionOpenConfirm',
  OsmosisConcentratedLiquidityPoolModelConcentratedV1beta1MsgCreateConcentratedPool = 'osmosis.concentratedliquidity.poolmodel.concentrated.v1beta1.MsgCreateConcentratedPool',
  OsmosisConcentratedLiquidityV1beta1MsgAddToPosition = 'osmosis.concentratedliquidity.v1beta1.MsgAddToPosition',
  OsmosisConcentratedLiquidityV1beta1MsgCollectIncentives = 'osmosis.concentratedliquidity.v1beta1.MsgCollectIncentives',
  OsmosisConcentratedLiquidityV1beta1MsgCollectSpreadRewards = 'osmosis.concentratedliquidity.v1beta1.MsgCollectSpreadRewards',
  OsmosisConcentratedLiquidityV1beta1MsgCreatePosition = 'osmosis.concentratedliquidity.v1beta1.MsgCreatePosition',
  OsmosisConcentratedLiquidityV1beta1MsgFungifyChargedPositions = 'osmosis.concentratedliquidity.v1beta1.MsgFungifyChargedPositions',
  OsmosisConcentratedLiquidityV1beta1MsgWithdrawPosition = 'osmosis.concentratedliquidity.v1beta1.MsgWithdrawPosition',
  OsmosisCosmwasmPoolV1beta1MsgCreateCosmWasmPool = 'osmosis.cosmwasmpool.v1beta1.MsgCreateCosmWasmPool',
  OsmosisGammPoolModelsBalancerV1beta1MsgCreateBalancerPool = 'osmosis.gamm.poolmodels.balancer.v1beta1.MsgCreateBalancerPool',
  OsmosisGammPoolModelsStableSwapV1beta1MsgCreateStableSwapPool = 'osmosis.gamm.poolmodels.stableswap.v1beta1.MsgCreateStableswapPool',
  OsmosisGammPoolModelsStableSwapV1beta1MsgStableSwapAdjustScalingFactors = 'osmosis.gamm.poolmodels.stableswap.v1beta1.MsgStableSwapAdjustScalingFactors',
  OsmosisGammV1beta1MsgExitPool = 'osmosis.gamm.v1beta1.MsgExitPool',
  OsmosisGammV1beta1MsgJoinPool = 'osmosis.gamm.v1beta1.MsgJoinPool',
  OsmosisGammV1beta1MsgJoinSwapExternAmountIn = 'osmosis.gamm.v1beta1.MsgJoinSwapExternAmountIn',
  OsmosisGammV1beta1MsgSwapExactAmountIn = 'osmosis.gamm.v1beta1.MsgSwapExactAmountIn',
  OsmosisGammV1beta1MsgSwapExactAmountOut = 'osmosis.gamm.v1beta1.MsgSwapExactAmountOut',
  OsmosisIncentivesMsgAddToGauge = 'osmosis.incentives.MsgAddToGauge',
  OsmosisIncentivesMsgCreateGauge = 'osmosis.incentives.MsgCreateGauge',
  OsmosisLockupMsgBeginUnlocking = 'osmosis.lockup.MsgBeginUnlocking',
  OsmosisLockupMsgLockTokens = 'osmosis.lockup.MsgLockTokens',
  OsmosisPoolManagerV1beta1MsgSplitRouteSwapExactAmountIn = 'osmosis.poolmanager.v1beta1.MsgSplitRouteSwapExactAmountIn',
  OsmosisPoolManagerV1beta1MsgSwapExactAmountIn = 'osmosis.poolmanager.v1beta1.MsgSwapExactAmountIn',
  OsmosisPoolManagerV1beta1MsgSwapExactAmountOut = 'osmosis.poolmanager.v1beta1.MsgSwapExactAmountOut',
  OsmosisSuperfluidMsgAddToConcentratedLiquiditySuperfluidPosition = 'osmosis.superfluid.MsgAddToConcentratedLiquiditySuperfluidPosition',
  OsmosisSuperfluidMsgCreateFullRangePositionAndSuperfluidDelegate = 'osmosis.superfluid.MsgCreateFullRangePositionAndSuperfluidDelegate',
  OsmosisSuperfluidMsgLockAndSuperfluidDelegate = 'osmosis.superfluid.MsgLockAndSuperfluidDelegate',
  OsmosisSuperfluidMsgSuperfluidDelegate = 'osmosis.superfluid.MsgSuperfluidDelegate',
  OsmosisSuperfluidMsgSuperfluidUnbondLock = 'osmosis.superfluid.MsgSuperfluidUnbondLock',
  OsmosisSuperfluidMsgSuperfluidUndelegate = 'osmosis.superfluid.MsgSuperfluidUndelegate',
  OsmosisSuperfluidMsgUnbondConvertAndStake = 'osmosis.superfluid.MsgUnbondConvertAndStake',
  OsmosisSuperfluidMsgUnlockAndMigrateSharesToFullRangeConcentratedPosition = 'osmosis.superfluid.MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition',
  OsmosisTokenFactoryV1beta1MsgCreateDenom = 'osmosis.tokenfactory.v1beta1.MsgCreateDenom',
  OsmosisTokenFactoryV1beta1MsgMint = 'osmosis.tokenfactory.v1beta1.MsgMint',
  OsmosisValsetprefV1beta1MsgWithdrawDelegationRewards = 'osmosis.valsetpref.v1beta1.MsgWithdrawDelegationRewards',
}

export type OsmosisTrxMsg =
  | OsmosisTrxMsgCosmosAuthzV1beta1MsgExec
  | OsmosisTrxMsgCosmosAuthzV1beta1MsgGrant
  | OsmosisTrxMsgCosmosAuthzV1beta1MsgRevoke
  | OsmosisTrxMsgCosmosBankV1beta1MsgSend
  | OsmosisTrxMsgCosmosDistributionV1beta1MsgSetWithdrawAddress
  | OsmosisTrxMsgCosmosDistributionV1beta1MsgWithdrawDelegatorReward
  | OsmosisTrxMsgCosmosDistributionV1beta1MsgWithdrawValidatorCommission
  | OsmosisTrxMsgCosmosGovV1beta1MsgDeposit
  | OsmosisTrxMsgCosmosGovV1beta1MsgSubmitProposal
  | OsmosisTrxMsgCosmosGovV1beta1MsgVote
  | OsmosisTrxMsgCosmosSlashingV1beta1MsgUnjail
  | OsmosisTrxMsgCosmosStakingV1beta1MsgBeginRedelegate
  | OsmosisTrxMsgCosmosStakingV1beta1MsgDelegate
  | OsmosisTrxMsgCosmosStakingV1beta1MsgEditValidator
  | OsmosisTrxMsgCosmosStakingV1beta1MsgUndelegate
  | OsmosisTrxMsgCosmosVestingV1beta1MsgCreateVestingAccount
  | OsmosisTrxMsgCosmwasmWasmV1MsgExecuteContract
  | OsmosisTrxMsgCosmwasmWasmV1MsgInstantiateContract
  | OsmosisTrxMsgCosmwasmWasmV1MsgMigrateContract
  | OsmosisTrxMsgCosmwasmWasmV1MsgStoreCode
  | OsmosisTrxMsgIbcApplicationsTransferV1MsgTransfer
  | OsmosisTrxMsgIbcCoreChannelV1MsgAcknowledgement
  | OsmosisTrxMsgIbcCoreChannelV1MsgChannelCloseConfirm
  | OsmosisTrxMsgIbcCoreChannelV1MsgChannelOpenConfirm
  | OsmosisTrxMsgIbcCoreChannelV1MsgChannelOpenTry
  | OsmosisTrxMsgIbcCoreChannelV1MsgRecvPacket
  | OsmosisTrxMsgIbcCoreChannelV1MsgTimeout
  | OsmosisTrxMsgIbcCoreClientV1MsgCreateClient
  | OsmosisTrxMsgIbcCoreClientV1MsgUpdateClient
  | OsmosisTrxMsgIbcCoreConnectionV1MsgConnectionOpenConfirm
  | OsmosisTrxMsgOsmosisConcentratedLiquidityPoolModelConcentratedV1beta1MsgCreateConcentratedPool
  | OsmosisTrxMsgOsmosisConcentratedLiquidityV1beta1MsgAddToPosition
  | OsmosisTrxMsgOsmosisConcentratedLiquidityV1beta1MsgCollectIncentives
  | OsmosisTrxMsgOsmosisConcentratedLiquidityV1beta1MsgCollectSpreadRewards
  | OsmosisTrxMsgOsmosisConcentratedLiquidityV1beta1MsgCreatePosition
  | OsmosisTrxMsgOsmosisConcentratedLiquidityV1beta1MsgFungifyChargedPositions
  | OsmosisTrxMsgOsmosisConcentratedLiquidityV1beta1MsgWithdrawPosition
  | OsmosisTrxMsgOsmosisCosmwasmPoolV1beta1MsgCreateCosmWasmPool
  | OsmosisTrxMsgOsmosisGammPoolModelsBalancerV1beta1MsgCreateBalancerPool
  | OsmosisTrxMsgOsmosisGammPoolModelsStableSwapV1beta1MsgCreateStableSwapPool
  | OsmosisTrxMsgOsmosisGammPoolModelsStableSwapV1beta1MsgStableSwapAdjustScalingFactors
  | OsmosisTrxMsgOsmosisGammV1beta1MsgExitPool
  | OsmosisTrxMsgOsmosisGammV1beta1MsgJoinPool
  | OsmosisTrxMsgOsmosisGammV1beta1MsgJoinSwapExternAmountIn
  | OsmosisTrxMsgOsmosisGammV1beta1MsgSwapExactAmountIn
  | OsmosisTrxMsgOsmosisGammV1beta1MsgSwapExactAmountOut
  | OsmosisTrxMsgOsmosisIncentivesMsgAddToGauge
  | OsmosisTrxMsgOsmosisIncentivesMsgCreateGauge
  | OsmosisTrxMsgOsmosisLockupMsgBeginUnlocking
  | OsmosisTrxMsgOsmosisLockupMsgLockTokens
  | OsmosisTrxMsgOsmosisPoolManagerV1beta1MsgSplitRouteSwapExactAmountIn
  | OsmosisTrxMsgOsmosisPoolManagerV1beta1MsgSwapExactAmountIn
  | OsmosisTrxMsgOsmosisPoolManagerV1beta1MsgSwapExactAmountOut
  | OsmosisTrxMsgOsmosisSuperfluidMsgAddToConcentratedLiquiditySuperfluidPosition
  | OsmosisTrxMsgOsmosisSuperfluidMsgCreateFullRangePositionAndSuperfluidDelegate
  | OsmosisTrxMsgOsmosisSuperfluidMsgLockAndSuperfluidDelegate
  | OsmosisTrxMsgOsmosisSuperfluidMsgSuperfluidDelegate
  | OsmosisTrxMsgOsmosisSuperfluidMsgSuperfluidUnbondLock
  | OsmosisTrxMsgOsmosisSuperfluidMsgSuperfluidUndelegate
  | OsmosisTrxMsgOsmosisSuperfluidMsgUnbondConvertAndStake
  | OsmosisTrxMsgOsmosisSuperfluidMsgUnlockAndMigrateSharesToFullRangeConcentratedPosition
  | OsmosisTrxMsgOsmosisTokenFactoryV1beta1MsgCreateDenom
  | OsmosisTrxMsgOsmosisTokenFactoryV1beta1MsgMint
  | OsmosisTrxMsgOsmosisValsetprefV1beta1MsgWithdrawDelegationRewards;

// types for mgs type:: /cosmos.authz.v1beta1.MsgExec
interface OsmosisTrxMsgCosmosAuthzV1beta1MsgExec extends IRangeMessage {
  type: OsmosisTrxMsgTypes.CosmosAuthzV1beta1MsgExec;
  data: {
    msgs: {
      '@type': string;
      amount: {
        denom: string;
        amount: string;
      };
      delegator_address: string;
      validator_address: string;
    }[];
    '@type': string;
    grantee: string;
  };
}

// types for mgs type:: /cosmos.authz.v1beta1.MsgGrant
interface OsmosisTrxMsgCosmosAuthzV1beta1MsgGrant extends IRangeMessage {
  type: OsmosisTrxMsgTypes.CosmosAuthzV1beta1MsgGrant;
  data: {
    '@type': string;
    grant: {
      expiration: string;
      authorization: {
        '@type': string;
        allow_list: {
          address: string[];
        };
        max_tokens?: any;
        authorization_type: string;
      };
    };
    grantee: string;
    granter: string;
  };
}

// types for mgs type:: /cosmos.authz.v1beta1.MsgRevoke
interface OsmosisTrxMsgCosmosAuthzV1beta1MsgRevoke extends IRangeMessage {
  type: OsmosisTrxMsgTypes.CosmosAuthzV1beta1MsgRevoke;
  data: {
    grantee: string;
    granter: string;
    msgTypeUrl: string;
  };
}

// types for mgs type:: /cosmos.bank.v1beta1.MsgSend
interface OsmosisTrxMsgCosmosBankV1beta1MsgSend extends IRangeMessage {
  type: OsmosisTrxMsgTypes.CosmosBankV1beta1MsgSend;
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
interface OsmosisTrxMsgCosmosDistributionV1beta1MsgSetWithdrawAddress
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.CosmosDistributionV1beta1MsgSetWithdrawAddress;
  data: {
    withdrawAddress: string;
    delegatorAddress: string;
  };
}

// types for mgs type:: /cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward
interface OsmosisTrxMsgCosmosDistributionV1beta1MsgWithdrawDelegatorReward
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.CosmosDistributionV1beta1MsgWithdrawDelegatorReward;
  data: {
    delegatorAddress: string;
    validatorAddress: string;
  };
}

// types for mgs type:: /cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission
interface OsmosisTrxMsgCosmosDistributionV1beta1MsgWithdrawValidatorCommission
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.CosmosDistributionV1beta1MsgWithdrawValidatorCommission;
  data: {
    validatorAddress: string;
  };
}

// types for mgs type:: /cosmos.gov.v1beta1.MsgDeposit
interface OsmosisTrxMsgCosmosGovV1beta1MsgDeposit extends IRangeMessage {
  type: OsmosisTrxMsgTypes.CosmosGovV1beta1MsgDeposit;
  data: {
    amount: {
      denom: string;
      amount: string;
    }[];
    depositor: string;
    proposalId: string;
  };
}

// types for mgs type:: /cosmos.gov.v1beta1.MsgSubmitProposal
interface OsmosisTrxMsgCosmosGovV1beta1MsgSubmitProposal extends IRangeMessage {
  type: OsmosisTrxMsgTypes.CosmosGovV1beta1MsgSubmitProposal;
  data: {
    '@type': string;
    content: {
      '@type': string;
      title: string;
      amount: {
        denom: string;
        amount: string;
      }[];
      recipient: string;
      description: string;
    };
    proposer: string;
    initial_deposit: {
      denom: string;
      amount: string;
    }[];
  };
}

// types for mgs type:: /cosmos.gov.v1beta1.MsgVote
interface OsmosisTrxMsgCosmosGovV1beta1MsgVote extends IRangeMessage {
  type: OsmosisTrxMsgTypes.CosmosGovV1beta1MsgVote;
  data: {
    voter: string;
    option: string;
    proposalId: string;
  };
}

// types for mgs type:: /cosmos.slashing.v1beta1.MsgUnjail
interface OsmosisTrxMsgCosmosSlashingV1beta1MsgUnjail extends IRangeMessage {
  type: OsmosisTrxMsgTypes.CosmosSlashingV1beta1MsgUnjail;
  data: {
    validatorAddr: string;
  };
}

// types for mgs type:: /cosmos.staking.v1beta1.MsgBeginRedelegate
interface OsmosisTrxMsgCosmosStakingV1beta1MsgBeginRedelegate
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.CosmosStakingV1beta1MsgBeginRedelegate;
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

// types for mgs type:: /cosmos.staking.v1beta1.MsgDelegate
interface OsmosisTrxMsgCosmosStakingV1beta1MsgDelegate extends IRangeMessage {
  type: OsmosisTrxMsgTypes.CosmosStakingV1beta1MsgDelegate;
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
interface OsmosisTrxMsgCosmosStakingV1beta1MsgEditValidator
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.CosmosStakingV1beta1MsgEditValidator;
  data: {
    description: {
      details: string;
      moniker: string;
      website: string;
      identity: string;
      securityContact: string;
    };
    validatorAddress: string;
  };
}

// types for mgs type:: /cosmos.staking.v1beta1.MsgUndelegate
interface OsmosisTrxMsgCosmosStakingV1beta1MsgUndelegate extends IRangeMessage {
  type: OsmosisTrxMsgTypes.CosmosStakingV1beta1MsgUndelegate;
  data: {
    amount: {
      denom: string;
      amount: string;
    };
    delegatorAddress: string;
    validatorAddress: string;
  };
}

// types for mgs type:: /cosmos.vesting.v1beta1.MsgCreateVestingAccount
interface OsmosisTrxMsgCosmosVestingV1beta1MsgCreateVestingAccount
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.CosmosVestingV1beta1MsgCreateVestingAccount;
  data: {
    amount: {
      denom: string;
      amount: string;
    }[];
    delayed: boolean;
    endTime: string;
    toAddress: string;
    fromAddress: string;
  };
}

// types for mgs type:: /cosmwasm.wasm.v1.MsgExecuteContract
interface OsmosisTrxMsgCosmwasmWasmV1MsgExecuteContract extends IRangeMessage {
  type: OsmosisTrxMsgTypes.CosmwasmWasmV1MsgExecuteContract;
  data: {
    msg: string;
    funds: {
      denom: string;
      amount: string;
    }[];
    sender: string;
    contract: string;
  };
}

// types for mgs type:: /cosmwasm.wasm.v1.MsgInstantiateContract
interface OsmosisTrxMsgCosmwasmWasmV1MsgInstantiateContract
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.CosmwasmWasmV1MsgInstantiateContract;
  data: {
    msg: string;
    label: string;
    codeId: string;
    sender: string;
  };
}

// types for mgs type:: /cosmwasm.wasm.v1.MsgMigrateContract
interface OsmosisTrxMsgCosmwasmWasmV1MsgMigrateContract extends IRangeMessage {
  type: OsmosisTrxMsgTypes.CosmwasmWasmV1MsgMigrateContract;
  data: {
    msg: string;
    codeId: string;
    sender: string;
    contract: string;
  };
}

// types for mgs type:: /cosmwasm.wasm.v1.MsgStoreCode
interface OsmosisTrxMsgCosmwasmWasmV1MsgStoreCode extends IRangeMessage {
  type: OsmosisTrxMsgTypes.CosmwasmWasmV1MsgStoreCode;
  data: {
    sender: string;
    wasmByteCode: string;
  };
}

// types for mgs type:: /ibc.applications.transfer.v1.MsgTransfer
interface OsmosisTrxMsgIbcApplicationsTransferV1MsgTransfer
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.IbcApplicationsTransferV1MsgTransfer;
  data: {
    token: {
      denom: string;
      amount: string;
    };
    sender: string;
    receiver: string;
    sourcePort: string;
    sourceChannel: string;
    timeoutTimestamp: string;
  };
}

// types for mgs type:: /ibc.core.channel.v1.MsgAcknowledgement
interface OsmosisTrxMsgIbcCoreChannelV1MsgAcknowledgement
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.IbcCoreChannelV1MsgAcknowledgement;
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
    proofAcked: string;
    proofHeight: {
      revisionHeight: string;
      revisionNumber: string;
    };
    acknowledgement: string;
  };
}

// types for mgs type:: /ibc.core.channel.v1.MsgChannelCloseConfirm
interface OsmosisTrxMsgIbcCoreChannelV1MsgChannelCloseConfirm
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.IbcCoreChannelV1MsgChannelCloseConfirm;
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

// types for mgs type:: /ibc.core.channel.v1.MsgChannelOpenConfirm
interface OsmosisTrxMsgIbcCoreChannelV1MsgChannelOpenConfirm
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.IbcCoreChannelV1MsgChannelOpenConfirm;
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

// types for mgs type:: /ibc.core.channel.v1.MsgChannelOpenTry
interface OsmosisTrxMsgIbcCoreChannelV1MsgChannelOpenTry extends IRangeMessage {
  type: OsmosisTrxMsgTypes.IbcCoreChannelV1MsgChannelOpenTry;
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
interface OsmosisTrxMsgIbcCoreChannelV1MsgRecvPacket extends IRangeMessage {
  type: OsmosisTrxMsgTypes.IbcCoreChannelV1MsgRecvPacket;
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
interface OsmosisTrxMsgIbcCoreChannelV1MsgTimeout extends IRangeMessage {
  type: OsmosisTrxMsgTypes.IbcCoreChannelV1MsgTimeout;
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
interface OsmosisTrxMsgIbcCoreClientV1MsgCreateClient extends IRangeMessage {
  type: OsmosisTrxMsgTypes.IbcCoreClientV1MsgCreateClient;
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

// types for mgs type:: /ibc.core.client.v1.MsgUpdateClient
interface OsmosisTrxMsgIbcCoreClientV1MsgUpdateClient extends IRangeMessage {
  type: OsmosisTrxMsgTypes.IbcCoreClientV1MsgUpdateClient;
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

// types for mgs type:: /ibc.core.connection.v1.MsgConnectionOpenConfirm
interface OsmosisTrxMsgIbcCoreConnectionV1MsgConnectionOpenConfirm
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.IbcCoreConnectionV1MsgConnectionOpenConfirm;
  data: {
    signer: string;
    proofAck: string;
    proofHeight: {
      revisionHeight: string;
    };
    connectionId: string;
  };
}

// types for mgs type:: /osmosis.concentratedliquidity.poolmodel.concentrated.v1beta1.MsgCreateConcentratedPool
interface OsmosisTrxMsgOsmosisConcentratedLiquidityPoolModelConcentratedV1beta1MsgCreateConcentratedPool
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisConcentratedLiquidityPoolModelConcentratedV1beta1MsgCreateConcentratedPool;
  data: {
    denom0: string;
    denom1: string;
    sender: string;
    tickSpacing: string;
    spreadFactor: string;
  };
}

// types for mgs type:: /osmosis.concentratedliquidity.v1beta1.MsgAddToPosition
interface OsmosisTrxMsgOsmosisConcentratedLiquidityV1beta1MsgAddToPosition
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisConcentratedLiquidityV1beta1MsgAddToPosition;
  data: {
    sender: string;
    amount0: string;
    amount1: string;
    positionId: string;
    tokenMinAmount0: string;
    tokenMinAmount1: string;
  };
}

// types for mgs type:: /osmosis.concentratedliquidity.v1beta1.MsgCollectIncentives
interface OsmosisTrxMsgOsmosisConcentratedLiquidityV1beta1MsgCollectIncentives
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisConcentratedLiquidityV1beta1MsgCollectIncentives;
  data: {
    sender: string;
    positionIds: string[];
  };
}

// types for mgs type:: /osmosis.concentratedliquidity.v1beta1.MsgCollectSpreadRewards
interface OsmosisTrxMsgOsmosisConcentratedLiquidityV1beta1MsgCollectSpreadRewards
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisConcentratedLiquidityV1beta1MsgCollectSpreadRewards;
  data: {
    sender: string;
    positionIds: string[];
  };
}

// types for mgs type:: /osmosis.concentratedliquidity.v1beta1.MsgCreatePosition
interface OsmosisTrxMsgOsmosisConcentratedLiquidityV1beta1MsgCreatePosition
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisConcentratedLiquidityV1beta1MsgCreatePosition;
  data: {
    poolId: string;
    sender: string;
    lowerTick: string;
    upperTick: string;
    tokensProvided: {
      denom: string;
      amount: string;
    }[];
    tokenMinAmount0: string;
    tokenMinAmount1: string;
  };
}

// types for mgs type:: /osmosis.concentratedliquidity.v1beta1.MsgFungifyChargedPositions
interface OsmosisTrxMsgOsmosisConcentratedLiquidityV1beta1MsgFungifyChargedPositions
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisConcentratedLiquidityV1beta1MsgFungifyChargedPositions;
  data: {
    sender: string;
    positionIds: string[];
  };
  status: string;
  block_number: string;
  addresses: any[];
  contract_addresses?: any;
}

// types for mgs type:: /osmosis.concentratedliquidity.v1beta1.MsgWithdrawPosition
interface OsmosisTrxMsgOsmosisConcentratedLiquidityV1beta1MsgWithdrawPosition
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisConcentratedLiquidityV1beta1MsgWithdrawPosition;
  data: {
    sender: string;
    positionId: string;
    liquidityAmount: string;
  };
}

// types for mgs type:: /osmosis.cosmwasmpool.v1beta1.MsgCreateCosmWasmPool
interface OsmosisTrxMsgOsmosisCosmwasmPoolV1beta1MsgCreateCosmWasmPool
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisCosmwasmPoolV1beta1MsgCreateCosmWasmPool;
  data: {
    codeId: string;
    sender: string;
    instantiateMsg: string;
  };
}

// types for mgs type:: /osmosis.gamm.poolmodels.balancer.v1beta1.MsgCreateBalancerPool
interface OsmosisTrxMsgOsmosisGammPoolModelsBalancerV1beta1MsgCreateBalancerPool
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisGammPoolModelsBalancerV1beta1MsgCreateBalancerPool;
  data: {
    sender: string;
    poolAssets: {
      token: {
        denom: string;
        amount: string;
      };
      weight: string;
    }[];
    poolParams: {
      exitFee: string;
      swapFee: string;
    };
    futurePoolGovernor: string;
  };
}

// types for mgs type:: /osmosis.gamm.poolmodels.stableswap.v1beta1.MsgCreateStableswapPool
interface OsmosisTrxMsgOsmosisGammPoolModelsStableSwapV1beta1MsgCreateStableSwapPool
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisGammPoolModelsStableSwapV1beta1MsgCreateStableSwapPool;
  data: {
    sender: string;
    poolParams: {
      exitFee: string;
      swapFee: string;
    };
    scalingFactors: string[];
    futurePoolGovernor: string;
    initialPoolLiquidity: {
      denom: string;
      amount: string;
    }[];
  };
}

// types for mgs type:: /osmosis.gamm.poolmodels.stableswap.v1beta1.MsgStableSwapAdjustScalingFactors
interface OsmosisTrxMsgOsmosisGammPoolModelsStableSwapV1beta1MsgStableSwapAdjustScalingFactors
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisGammPoolModelsStableSwapV1beta1MsgStableSwapAdjustScalingFactors;
  data: {
    poolId: string;
    sender: string;
    scalingFactors: string[];
  };
}

// types for mgs type:: /osmosis.gamm.v1beta1.MsgExitPool
interface OsmosisTrxMsgOsmosisGammV1beta1MsgExitPool extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisGammV1beta1MsgExitPool;
  data: {
    poolId: string;
    sender: string;
    tokenOutMins: {
      denom: string;
      amount: string;
    }[];
    shareInAmount: string;
  };
}

// types for mgs type:: /osmosis.gamm.v1beta1.MsgJoinPool
interface OsmosisTrxMsgOsmosisGammV1beta1MsgJoinPool extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisGammV1beta1MsgJoinPool;
  data: {
    poolId: string;
    sender: string;
    tokenInMaxs: {
      denom: string;
      amount: string;
    }[];
    shareOutAmount: string;
  };
}

// types for mgs type:: /osmosis.gamm.v1beta1.MsgJoinSwapExternAmountIn
interface OsmosisTrxMsgOsmosisGammV1beta1MsgJoinSwapExternAmountIn
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisGammV1beta1MsgJoinSwapExternAmountIn;
  data: {
    poolId: string;
    sender: string;
    tokenIn: {
      denom: string;
      amount: string;
    };
    shareOutMinAmount: string;
  };
}

// types for mgs type:: /osmosis.gamm.v1beta1.MsgSwapExactAmountIn
interface OsmosisTrxMsgOsmosisGammV1beta1MsgSwapExactAmountIn
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisGammV1beta1MsgSwapExactAmountIn;
  data: {
    routes: {
      poolId: string;
      tokenOutDenom: string;
    }[];
    sender: string;
    tokenIn: {
      denom: string;
      amount: string;
    };
    tokenOutMinAmount: string;
  };
}

// types for mgs type:: /osmosis.gamm.v1beta1.MsgSwapExactAmountOut
interface OsmosisTrxMsgOsmosisGammV1beta1MsgSwapExactAmountOut
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisGammV1beta1MsgSwapExactAmountOut;
  data: {
    routes: {
      poolId: string;
      tokenInDenom: string;
    }[];
    sender: string;
    tokenOut: {
      denom: string;
      amount: string;
    };
    tokenInMaxAmount: string;
  };
}

// types for mgs type:: /osmosis.incentives.MsgAddToGauge
interface OsmosisTrxMsgOsmosisIncentivesMsgAddToGauge extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisIncentivesMsgAddToGauge;
  data: {
    owner: string;
    gaugeId: string;
    rewards: {
      denom: string;
      amount: string;
    }[];
  };
}

// types for mgs type:: /osmosis.incentives.MsgCreateGauge
interface OsmosisTrxMsgOsmosisIncentivesMsgCreateGauge extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisIncentivesMsgCreateGauge;
  data: {
    coins: {
      denom: string;
      amount: string;
    }[];
    owner: string;
    startTime: string;
    distributeTo: {
      denom: string;
      duration: string;
      timestamp: string;
    };
    numEpochsPaidOver: string;
  };
}

// types for mgs type:: /osmosis.lockup.MsgBeginUnlocking
interface OsmosisTrxMsgOsmosisLockupMsgBeginUnlocking extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisLockupMsgBeginUnlocking;
  data: {
    ID: string;
    owner: string;
  };
}

// types for mgs type:: /osmosis.lockup.MsgLockTokens
interface OsmosisTrxMsgOsmosisLockupMsgLockTokens extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisLockupMsgLockTokens;
  data: {
    coins: {
      denom: string;
      amount: string;
    }[];
    owner: string;
    duration: string;
  };
}

// types for mgs type:: /osmosis.poolmanager.v1beta1.MsgSplitRouteSwapExactAmountIn
interface OsmosisTrxMsgOsmosisPoolManagerV1beta1MsgSplitRouteSwapExactAmountIn
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisPoolManagerV1beta1MsgSplitRouteSwapExactAmountIn;
  data: {
    routes: {
      pools: {
        poolId: string;
        tokenOutDenom: string;
      }[];
      tokenInAmount: string;
    }[];
    sender: string;
    tokenInDenom: string;
    tokenOutMinAmount: string;
  };
}

// types for mgs type:: /osmosis.poolmanager.v1beta1.MsgSwapExactAmountIn
interface OsmosisTrxMsgOsmosisPoolManagerV1beta1MsgSwapExactAmountIn
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisPoolManagerV1beta1MsgSwapExactAmountIn;
  data: {
    routes: {
      poolId: string;
      tokenOutDenom: string;
    }[];
    sender: string;
    tokenIn: {
      denom: string;
      amount: string;
    };
    tokenOutMinAmount: string;
  };
}

// types for mgs type:: /osmosis.poolmanager.v1beta1.MsgSwapExactAmountOut
interface OsmosisTrxMsgOsmosisPoolManagerV1beta1MsgSwapExactAmountOut
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisPoolManagerV1beta1MsgSwapExactAmountOut;
  data: {
    routes: {
      poolId: string;
      tokenInDenom: string;
    }[];
    sender: string;
    tokenOut: {
      denom: string;
      amount: string;
    };
    tokenInMaxAmount: string;
  };
}

// types for mgs type:: /osmosis.superfluid.MsgAddToConcentratedLiquiditySuperfluidPosition
interface OsmosisTrxMsgOsmosisSuperfluidMsgAddToConcentratedLiquiditySuperfluidPosition
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisSuperfluidMsgAddToConcentratedLiquiditySuperfluidPosition;
  data: {
    sender: string;
    positionId: string;
    tokenDesired0: {
      denom: string;
      amount: string;
    };
    tokenDesired1: {
      denom: string;
      amount: string;
    };
  };
}

// types for mgs type:: /osmosis.superfluid.MsgCreateFullRangePositionAndSuperfluidDelegate
interface OsmosisTrxMsgOsmosisSuperfluidMsgCreateFullRangePositionAndSuperfluidDelegate
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisSuperfluidMsgCreateFullRangePositionAndSuperfluidDelegate;
  data: {
    coins: {
      denom: string;
      amount: string;
    }[];
    poolId: string;
    sender: string;
    valAddr: string;
  };
}

// types for mgs type:: /osmosis.superfluid.MsgLockAndSuperfluidDelegate
interface OsmosisTrxMsgOsmosisSuperfluidMsgLockAndSuperfluidDelegate
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisSuperfluidMsgLockAndSuperfluidDelegate;
  data: {
    coins: {
      denom: string;
      amount: string;
    }[];
    sender: string;
    valAddr: string;
  };
}

// types for mgs type:: /osmosis.superfluid.MsgSuperfluidDelegate
interface OsmosisTrxMsgOsmosisSuperfluidMsgSuperfluidDelegate
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisSuperfluidMsgSuperfluidDelegate;
  data: {
    lockId: string;
    sender: string;
    valAddr: string;
  };
}

// types for mgs type:: /osmosis.superfluid.MsgSuperfluidUnbondLock
interface OsmosisTrxMsgOsmosisSuperfluidMsgSuperfluidUnbondLock
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisSuperfluidMsgSuperfluidUnbondLock;
  data: {
    lockId: string;
    sender: string;
  };
}

// types for mgs type:: /osmosis.superfluid.MsgSuperfluidUndelegate
interface OsmosisTrxMsgOsmosisSuperfluidMsgSuperfluidUndelegate
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisSuperfluidMsgSuperfluidUndelegate;
  data: {
    lockId: string;
    sender: string;
  };
}

// types for mgs type:: /osmosis.superfluid.MsgUnbondConvertAndStake
interface OsmosisTrxMsgOsmosisSuperfluidMsgUnbondConvertAndStake
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisSuperfluidMsgUnbondConvertAndStake;
  data: {
    lockId: string;
    sender: string;
    valAddr: string;
    minAmtToStake: string;
    sharesToConvert: {
      denom: string;
      amount: string;
    };
  };
}

// types for mgs type:: /osmosis.superfluid.MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition
interface OsmosisTrxMsgOsmosisSuperfluidMsgUnlockAndMigrateSharesToFullRangeConcentratedPosition
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisSuperfluidMsgUnlockAndMigrateSharesToFullRangeConcentratedPosition;
  data: {
    lockId: string;
    sender: string;
    tokenOutMins: {
      denom: string;
      amount: string;
    }[];
    sharesToMigrate: {
      denom: string;
      amount: string;
    };
  };
}

// types for mgs type:: /osmosis.tokenfactory.v1beta1.MsgCreateDenom
interface OsmosisTrxMsgOsmosisTokenFactoryV1beta1MsgCreateDenom
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisTokenFactoryV1beta1MsgCreateDenom;
  data: {
    sender: string;
    subdenom: string;
  };
}

// types for mgs type:: /osmosis.tokenfactory.v1beta1.MsgMint
interface OsmosisTrxMsgOsmosisTokenFactoryV1beta1MsgMint extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisTokenFactoryV1beta1MsgMint;
  data: {
    amount: {
      denom: string;
      amount: string;
    };
    sender: string;
    mintToAddress: string;
  };
}

// types for mgs type:: /osmosis.valsetpref.v1beta1.MsgWithdrawDelegationRewards
interface OsmosisTrxMsgOsmosisValsetprefV1beta1MsgWithdrawDelegationRewards
  extends IRangeMessage {
  type: OsmosisTrxMsgTypes.OsmosisValsetprefV1beta1MsgWithdrawDelegationRewards;
  data: {
    delegator: string;
  };
}
