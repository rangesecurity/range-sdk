import { IRangeMessage } from '../IRangeMessage';

export enum Osmosis1TrxMsgTypes {
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

export type Osmosis1TrxMsg =
  | Osmosis1TrxMsgCosmosAuthzV1beta1MsgExec
  | Osmosis1TrxMsgCosmosAuthzV1beta1MsgGrant
  | Osmosis1TrxMsgCosmosAuthzV1beta1MsgRevoke
  | Osmosis1TrxMsgCosmosBankV1beta1MsgSend
  | Osmosis1TrxMsgCosmosDistributionV1beta1MsgSetWithdrawAddress
  | Osmosis1TrxMsgCosmosDistributionV1beta1MsgWithdrawDelegatorReward
  | Osmosis1TrxMsgCosmosDistributionV1beta1MsgWithdrawValidatorCommission
  | Osmosis1TrxMsgCosmosGovV1beta1MsgDeposit
  | Osmosis1TrxMsgCosmosGovV1beta1MsgSubmitProposal
  | Osmosis1TrxMsgCosmosGovV1beta1MsgVote
  | Osmosis1TrxMsgCosmosSlashingV1beta1MsgUnjail
  | Osmosis1TrxMsgCosmosStakingV1beta1MsgBeginRedelegate
  | Osmosis1TrxMsgCosmosStakingV1beta1MsgDelegate
  | Osmosis1TrxMsgCosmosStakingV1beta1MsgEditValidator
  | Osmosis1TrxMsgCosmosStakingV1beta1MsgUndelegate
  | Osmosis1TrxMsgCosmosVestingV1beta1MsgCreateVestingAccount
  | Osmosis1TrxMsgCosmwasmWasmV1MsgExecuteContract
  | Osmosis1TrxMsgCosmwasmWasmV1MsgInstantiateContract
  | Osmosis1TrxMsgCosmwasmWasmV1MsgMigrateContract
  | Osmosis1TrxMsgCosmwasmWasmV1MsgStoreCode
  | Osmosis1TrxMsgIbcApplicationsTransferV1MsgTransfer
  | Osmosis1TrxMsgIbcCoreChannelV1MsgAcknowledgement
  | Osmosis1TrxMsgIbcCoreChannelV1MsgChannelCloseConfirm
  | Osmosis1TrxMsgIbcCoreChannelV1MsgChannelOpenConfirm
  | Osmosis1TrxMsgIbcCoreChannelV1MsgChannelOpenTry
  | Osmosis1TrxMsgIbcCoreChannelV1MsgRecvPacket
  | Osmosis1TrxMsgIbcCoreChannelV1MsgTimeout
  | Osmosis1TrxMsgIbcCoreClientV1MsgCreateClient
  | Osmosis1TrxMsgIbcCoreClientV1MsgUpdateClient
  | Osmosis1TrxMsgIbcCoreConnectionV1MsgConnectionOpenConfirm
  | Osmosis1TrxMsgOsmosisConcentratedLiquidityPoolModelConcentratedV1beta1MsgCreateConcentratedPool
  | Osmosis1TrxMsgOsmosisConcentratedLiquidityV1beta1MsgAddToPosition
  | Osmosis1TrxMsgOsmosisConcentratedLiquidityV1beta1MsgCollectIncentives
  | Osmosis1TrxMsgOsmosisConcentratedLiquidityV1beta1MsgCollectSpreadRewards
  | Osmosis1TrxMsgOsmosisConcentratedLiquidityV1beta1MsgCreatePosition
  | Osmosis1TrxMsgOsmosisConcentratedLiquidityV1beta1MsgFungifyChargedPositions
  | Osmosis1TrxMsgOsmosisConcentratedLiquidityV1beta1MsgWithdrawPosition
  | Osmosis1TrxMsgOsmosisCosmwasmPoolV1beta1MsgCreateCosmWasmPool
  | Osmosis1TrxMsgOsmosisGammPoolModelsBalancerV1beta1MsgCreateBalancerPool
  | Osmosis1TrxMsgOsmosisGammPoolModelsStableSwapV1beta1MsgCreateStableSwapPool
  | Osmosis1TrxMsgOsmosisGammPoolModelsStableSwapV1beta1MsgStableSwapAdjustScalingFactors
  | Osmosis1TrxMsgOsmosisGammV1beta1MsgExitPool
  | Osmosis1TrxMsgOsmosisGammV1beta1MsgJoinPool
  | Osmosis1TrxMsgOsmosisGammV1beta1MsgJoinSwapExternAmountIn
  | Osmosis1TrxMsgOsmosisGammV1beta1MsgSwapExactAmountIn
  | Osmosis1TrxMsgOsmosisGammV1beta1MsgSwapExactAmountOut
  | Osmosis1TrxMsgOsmosisIncentivesMsgAddToGauge
  | Osmosis1TrxMsgOsmosisIncentivesMsgCreateGauge
  | Osmosis1TrxMsgOsmosisLockupMsgBeginUnlocking
  | Osmosis1TrxMsgOsmosisLockupMsgLockTokens
  | Osmosis1TrxMsgOsmosisPoolManagerV1beta1MsgSplitRouteSwapExactAmountIn
  | Osmosis1TrxMsgOsmosisPoolManagerV1beta1MsgSwapExactAmountIn
  | Osmosis1TrxMsgOsmosisPoolManagerV1beta1MsgSwapExactAmountOut
  | Osmosis1TrxMsgOsmosisSuperfluidMsgAddToConcentratedLiquiditySuperfluidPosition
  | Osmosis1TrxMsgOsmosisSuperfluidMsgCreateFullRangePositionAndSuperfluidDelegate
  | Osmosis1TrxMsgOsmosisSuperfluidMsgLockAndSuperfluidDelegate
  | Osmosis1TrxMsgOsmosisSuperfluidMsgSuperfluidDelegate
  | Osmosis1TrxMsgOsmosisSuperfluidMsgSuperfluidUnbondLock
  | Osmosis1TrxMsgOsmosisSuperfluidMsgSuperfluidUndelegate
  | Osmosis1TrxMsgOsmosisSuperfluidMsgUnbondConvertAndStake
  | Osmosis1TrxMsgOsmosisSuperfluidMsgUnlockAndMigrateSharesToFullRangeConcentratedPosition
  | Osmosis1TrxMsgOsmosisTokenFactoryV1beta1MsgCreateDenom
  | Osmosis1TrxMsgOsmosisTokenFactoryV1beta1MsgMint
  | Osmosis1TrxMsgOsmosisValsetprefV1beta1MsgWithdrawDelegationRewards;

// types for mgs type:: /cosmos.authz.v1beta1.MsgExec
interface Osmosis1TrxMsgCosmosAuthzV1beta1MsgExec extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.CosmosAuthzV1beta1MsgExec;
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
interface Osmosis1TrxMsgCosmosAuthzV1beta1MsgGrant extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.CosmosAuthzV1beta1MsgGrant;
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
interface Osmosis1TrxMsgCosmosAuthzV1beta1MsgRevoke extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.CosmosAuthzV1beta1MsgRevoke;
  data: {
    grantee: string;
    granter: string;
    msgTypeUrl: string;
  };
}

// types for mgs type:: /cosmos.bank.v1beta1.MsgSend
interface Osmosis1TrxMsgCosmosBankV1beta1MsgSend extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.CosmosBankV1beta1MsgSend;
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
interface Osmosis1TrxMsgCosmosDistributionV1beta1MsgSetWithdrawAddress
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.CosmosDistributionV1beta1MsgSetWithdrawAddress;
  data: {
    withdrawAddress: string;
    delegatorAddress: string;
  };
}

// types for mgs type:: /cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward
interface Osmosis1TrxMsgCosmosDistributionV1beta1MsgWithdrawDelegatorReward
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.CosmosDistributionV1beta1MsgWithdrawDelegatorReward;
  data: {
    delegatorAddress: string;
    validatorAddress: string;
  };
}

// types for mgs type:: /cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission
interface Osmosis1TrxMsgCosmosDistributionV1beta1MsgWithdrawValidatorCommission
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.CosmosDistributionV1beta1MsgWithdrawValidatorCommission;
  data: {
    validatorAddress: string;
  };
}

// types for mgs type:: /cosmos.gov.v1beta1.MsgDeposit
interface Osmosis1TrxMsgCosmosGovV1beta1MsgDeposit extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.CosmosGovV1beta1MsgDeposit;
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
interface Osmosis1TrxMsgCosmosGovV1beta1MsgSubmitProposal
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.CosmosGovV1beta1MsgSubmitProposal;
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
interface Osmosis1TrxMsgCosmosGovV1beta1MsgVote extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.CosmosGovV1beta1MsgVote;
  data: {
    voter: string;
    option: string;
    proposalId: string;
  };
}

// types for mgs type:: /cosmos.slashing.v1beta1.MsgUnjail
interface Osmosis1TrxMsgCosmosSlashingV1beta1MsgUnjail extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.CosmosSlashingV1beta1MsgUnjail;
  data: {
    validatorAddr: string;
  };
}

// types for mgs type:: /cosmos.staking.v1beta1.MsgBeginRedelegate
interface Osmosis1TrxMsgCosmosStakingV1beta1MsgBeginRedelegate
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.CosmosStakingV1beta1MsgBeginRedelegate;
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
interface Osmosis1TrxMsgCosmosStakingV1beta1MsgDelegate extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.CosmosStakingV1beta1MsgDelegate;
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
interface Osmosis1TrxMsgCosmosStakingV1beta1MsgEditValidator
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.CosmosStakingV1beta1MsgEditValidator;
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
interface Osmosis1TrxMsgCosmosStakingV1beta1MsgUndelegate
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.CosmosStakingV1beta1MsgUndelegate;
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
interface Osmosis1TrxMsgCosmosVestingV1beta1MsgCreateVestingAccount
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.CosmosVestingV1beta1MsgCreateVestingAccount;
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
interface Osmosis1TrxMsgCosmwasmWasmV1MsgExecuteContract extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.CosmwasmWasmV1MsgExecuteContract;
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
interface Osmosis1TrxMsgCosmwasmWasmV1MsgInstantiateContract
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.CosmwasmWasmV1MsgInstantiateContract;
  data: {
    msg: string;
    label: string;
    codeId: string;
    sender: string;
  };
}

// types for mgs type:: /cosmwasm.wasm.v1.MsgMigrateContract
interface Osmosis1TrxMsgCosmwasmWasmV1MsgMigrateContract extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.CosmwasmWasmV1MsgMigrateContract;
  data: {
    msg: string;
    codeId: string;
    sender: string;
    contract: string;
  };
}

// types for mgs type:: /cosmwasm.wasm.v1.MsgStoreCode
interface Osmosis1TrxMsgCosmwasmWasmV1MsgStoreCode extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.CosmwasmWasmV1MsgStoreCode;
  data: {
    sender: string;
    wasmByteCode: string;
  };
}

// types for mgs type:: /ibc.applications.transfer.v1.MsgTransfer
interface Osmosis1TrxMsgIbcApplicationsTransferV1MsgTransfer
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.IbcApplicationsTransferV1MsgTransfer;
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
interface Osmosis1TrxMsgIbcCoreChannelV1MsgAcknowledgement
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.IbcCoreChannelV1MsgAcknowledgement;
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
interface Osmosis1TrxMsgIbcCoreChannelV1MsgChannelCloseConfirm
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.IbcCoreChannelV1MsgChannelCloseConfirm;
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
interface Osmosis1TrxMsgIbcCoreChannelV1MsgChannelOpenConfirm
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.IbcCoreChannelV1MsgChannelOpenConfirm;
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
interface Osmosis1TrxMsgIbcCoreChannelV1MsgChannelOpenTry
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.IbcCoreChannelV1MsgChannelOpenTry;
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
interface Osmosis1TrxMsgIbcCoreChannelV1MsgRecvPacket extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.IbcCoreChannelV1MsgRecvPacket;
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
interface Osmosis1TrxMsgIbcCoreChannelV1MsgTimeout extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.IbcCoreChannelV1MsgTimeout;
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
interface Osmosis1TrxMsgIbcCoreClientV1MsgCreateClient extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.IbcCoreClientV1MsgCreateClient;
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
interface Osmosis1TrxMsgIbcCoreClientV1MsgUpdateClient extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.IbcCoreClientV1MsgUpdateClient;
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
interface Osmosis1TrxMsgIbcCoreConnectionV1MsgConnectionOpenConfirm
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.IbcCoreConnectionV1MsgConnectionOpenConfirm;
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
interface Osmosis1TrxMsgOsmosisConcentratedLiquidityPoolModelConcentratedV1beta1MsgCreateConcentratedPool
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisConcentratedLiquidityPoolModelConcentratedV1beta1MsgCreateConcentratedPool;
  data: {
    denom0: string;
    denom1: string;
    sender: string;
    tickSpacing: string;
    spreadFactor: string;
  };
}

// types for mgs type:: /osmosis.concentratedliquidity.v1beta1.MsgAddToPosition
interface Osmosis1TrxMsgOsmosisConcentratedLiquidityV1beta1MsgAddToPosition
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisConcentratedLiquidityV1beta1MsgAddToPosition;
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
interface Osmosis1TrxMsgOsmosisConcentratedLiquidityV1beta1MsgCollectIncentives
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisConcentratedLiquidityV1beta1MsgCollectIncentives;
  data: {
    sender: string;
    positionIds: string[];
  };
}

// types for mgs type:: /osmosis.concentratedliquidity.v1beta1.MsgCollectSpreadRewards
interface Osmosis1TrxMsgOsmosisConcentratedLiquidityV1beta1MsgCollectSpreadRewards
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisConcentratedLiquidityV1beta1MsgCollectSpreadRewards;
  data: {
    sender: string;
    positionIds: string[];
  };
}

// types for mgs type:: /osmosis.concentratedliquidity.v1beta1.MsgCreatePosition
interface Osmosis1TrxMsgOsmosisConcentratedLiquidityV1beta1MsgCreatePosition
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisConcentratedLiquidityV1beta1MsgCreatePosition;
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
interface Osmosis1TrxMsgOsmosisConcentratedLiquidityV1beta1MsgFungifyChargedPositions
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisConcentratedLiquidityV1beta1MsgFungifyChargedPositions;
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
interface Osmosis1TrxMsgOsmosisConcentratedLiquidityV1beta1MsgWithdrawPosition
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisConcentratedLiquidityV1beta1MsgWithdrawPosition;
  data: {
    sender: string;
    positionId: string;
    liquidityAmount: string;
  };
}

// types for mgs type:: /osmosis.cosmwasmpool.v1beta1.MsgCreateCosmWasmPool
interface Osmosis1TrxMsgOsmosisCosmwasmPoolV1beta1MsgCreateCosmWasmPool
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisCosmwasmPoolV1beta1MsgCreateCosmWasmPool;
  data: {
    codeId: string;
    sender: string;
    instantiateMsg: string;
  };
}

// types for mgs type:: /osmosis.gamm.poolmodels.balancer.v1beta1.MsgCreateBalancerPool
interface Osmosis1TrxMsgOsmosisGammPoolModelsBalancerV1beta1MsgCreateBalancerPool
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisGammPoolModelsBalancerV1beta1MsgCreateBalancerPool;
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
interface Osmosis1TrxMsgOsmosisGammPoolModelsStableSwapV1beta1MsgCreateStableSwapPool
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisGammPoolModelsStableSwapV1beta1MsgCreateStableSwapPool;
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
interface Osmosis1TrxMsgOsmosisGammPoolModelsStableSwapV1beta1MsgStableSwapAdjustScalingFactors
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisGammPoolModelsStableSwapV1beta1MsgStableSwapAdjustScalingFactors;
  data: {
    poolId: string;
    sender: string;
    scalingFactors: string[];
  };
}

// types for mgs type:: /osmosis.gamm.v1beta1.MsgExitPool
interface Osmosis1TrxMsgOsmosisGammV1beta1MsgExitPool extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisGammV1beta1MsgExitPool;
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
interface Osmosis1TrxMsgOsmosisGammV1beta1MsgJoinPool extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisGammV1beta1MsgJoinPool;
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
interface Osmosis1TrxMsgOsmosisGammV1beta1MsgJoinSwapExternAmountIn
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisGammV1beta1MsgJoinSwapExternAmountIn;
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
interface Osmosis1TrxMsgOsmosisGammV1beta1MsgSwapExactAmountIn
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisGammV1beta1MsgSwapExactAmountIn;
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
interface Osmosis1TrxMsgOsmosisGammV1beta1MsgSwapExactAmountOut
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisGammV1beta1MsgSwapExactAmountOut;
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
interface Osmosis1TrxMsgOsmosisIncentivesMsgAddToGauge extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisIncentivesMsgAddToGauge;
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
interface Osmosis1TrxMsgOsmosisIncentivesMsgCreateGauge extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisIncentivesMsgCreateGauge;
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
interface Osmosis1TrxMsgOsmosisLockupMsgBeginUnlocking extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisLockupMsgBeginUnlocking;
  data: {
    ID: string;
    owner: string;
  };
}

// types for mgs type:: /osmosis.lockup.MsgLockTokens
interface Osmosis1TrxMsgOsmosisLockupMsgLockTokens extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisLockupMsgLockTokens;
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
interface Osmosis1TrxMsgOsmosisPoolManagerV1beta1MsgSplitRouteSwapExactAmountIn
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisPoolManagerV1beta1MsgSplitRouteSwapExactAmountIn;
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
interface Osmosis1TrxMsgOsmosisPoolManagerV1beta1MsgSwapExactAmountIn
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisPoolManagerV1beta1MsgSwapExactAmountIn;
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
interface Osmosis1TrxMsgOsmosisPoolManagerV1beta1MsgSwapExactAmountOut
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisPoolManagerV1beta1MsgSwapExactAmountOut;
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
interface Osmosis1TrxMsgOsmosisSuperfluidMsgAddToConcentratedLiquiditySuperfluidPosition
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisSuperfluidMsgAddToConcentratedLiquiditySuperfluidPosition;
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
interface Osmosis1TrxMsgOsmosisSuperfluidMsgCreateFullRangePositionAndSuperfluidDelegate
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisSuperfluidMsgCreateFullRangePositionAndSuperfluidDelegate;
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
interface Osmosis1TrxMsgOsmosisSuperfluidMsgLockAndSuperfluidDelegate
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisSuperfluidMsgLockAndSuperfluidDelegate;
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
interface Osmosis1TrxMsgOsmosisSuperfluidMsgSuperfluidDelegate
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisSuperfluidMsgSuperfluidDelegate;
  data: {
    lockId: string;
    sender: string;
    valAddr: string;
  };
}

// types for mgs type:: /osmosis.superfluid.MsgSuperfluidUnbondLock
interface Osmosis1TrxMsgOsmosisSuperfluidMsgSuperfluidUnbondLock
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisSuperfluidMsgSuperfluidUnbondLock;
  data: {
    lockId: string;
    sender: string;
  };
}

// types for mgs type:: /osmosis.superfluid.MsgSuperfluidUndelegate
interface Osmosis1TrxMsgOsmosisSuperfluidMsgSuperfluidUndelegate
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisSuperfluidMsgSuperfluidUndelegate;
  data: {
    lockId: string;
    sender: string;
  };
}

// types for mgs type:: /osmosis.superfluid.MsgUnbondConvertAndStake
interface Osmosis1TrxMsgOsmosisSuperfluidMsgUnbondConvertAndStake
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisSuperfluidMsgUnbondConvertAndStake;
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
interface Osmosis1TrxMsgOsmosisSuperfluidMsgUnlockAndMigrateSharesToFullRangeConcentratedPosition
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisSuperfluidMsgUnlockAndMigrateSharesToFullRangeConcentratedPosition;
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
interface Osmosis1TrxMsgOsmosisTokenFactoryV1beta1MsgCreateDenom
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisTokenFactoryV1beta1MsgCreateDenom;
  data: {
    sender: string;
    subdenom: string;
  };
}

// types for mgs type:: /osmosis.tokenfactory.v1beta1.MsgMint
interface Osmosis1TrxMsgOsmosisTokenFactoryV1beta1MsgMint
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisTokenFactoryV1beta1MsgMint;
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
interface Osmosis1TrxMsgOsmosisValsetprefV1beta1MsgWithdrawDelegationRewards
  extends IRangeMessage {
  type: Osmosis1TrxMsgTypes.OsmosisValsetprefV1beta1MsgWithdrawDelegationRewards;
  data: {
    delegator: string;
  };
}
