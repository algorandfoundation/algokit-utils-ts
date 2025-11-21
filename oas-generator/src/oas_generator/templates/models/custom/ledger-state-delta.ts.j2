import type { ObjectModelMetadata } from '../core/model-runtime'
import type { Block } from './block'
import { BlockMeta } from './block'
import {
  numberCodec,
  numberWithNoDefaultCodec,
  bigIntCodec,
  booleanCodec,
  stringCodec,
  bytesCodec,
  addressCodec,
  ArrayCodec,
  MapCodec,
  ModelCodec,
} from '@algorandfoundation/algokit-common'

/**
 * Contains type information and a value, representing a value in a TEAL program.
 */
export type LedgerTealValue = {
  /**
   * Type determines the type of the value.
   * * 1 represents the type of a byte slice in a TEAL program
   * * 2 represents the type of an unsigned integer in a TEAL program
   */
  type: number
  /** bytes value. */
  bytes?: Uint8Array
  /** uint value. */
  uint?: bigint
}

export const LedgerTealValueMeta: ObjectModelMetadata = {
  name: 'LedgerTealValue',
  kind: 'object',
  fields: [
    { name: 'type', wireKey: 'tt', optional: false, nullable: false, codec: numberCodec },
    { name: 'bytes', wireKey: 'tb', optional: true, nullable: false, codec: bytesCodec },
    { name: 'uint', wireKey: 'ui', optional: true, nullable: false, codec: bigIntCodec },
  ],
}

/**
 * Sets maximums on the number of each type that may be stored.
 */
export type LedgerStateSchema = {
  /** Number of uints in state. */
  numUints?: bigint
  /** Number of byte slices in state. */
  numByteSlices?: bigint
}

export const LedgerStateSchemaMeta: ObjectModelMetadata = {
  name: 'LedgerStateSchema',
  kind: 'object',
  fields: [
    { name: 'numUints', wireKey: 'nui', optional: true, nullable: false, codec: bigIntCodec },
    { name: 'numByteSlices', wireKey: 'nbs', optional: true, nullable: false, codec: bigIntCodec },
  ],
}

/**
 * Stores the global information associated with an application.
 */
export type LedgerAppParams = {
  approvalProgram: Uint8Array
  clearStateProgram: Uint8Array
  localStateSchema: LedgerStateSchema
  globalStateSchema: LedgerStateSchema
  extraProgramPages: number
  version?: number
  sizeSponsor?: string
  globalState?: Map<Uint8Array, LedgerTealValue>
}

export const LedgerAppParamsMeta: ObjectModelMetadata = {
  name: 'LedgerAppParams',
  kind: 'object',
  fields: [
    { name: 'approvalProgram', wireKey: 'approv', optional: false, nullable: false, codec: bytesCodec },
    { name: 'clearStateProgram', wireKey: 'clearp', optional: false, nullable: false, codec: bytesCodec },
    { name: 'localStateSchema', wireKey: 'lsch', optional: false, nullable: false, codec: new ModelCodec(LedgerStateSchemaMeta) },
    { name: 'globalStateSchema', wireKey: 'gsch', optional: false, nullable: false, codec: new ModelCodec(LedgerStateSchemaMeta) },
    { name: 'extraProgramPages', wireKey: 'epp', optional: false, nullable: false, codec: numberCodec },
    { name: 'version', wireKey: 'v', optional: true, nullable: false, codec: numberCodec },
    { name: 'sizeSponsor', wireKey: 'ss', optional: true, nullable: false, codec: addressCodec },
    {
      name: 'globalState',
      wireKey: 'gs',
      optional: true,
      nullable: false,
      codec: new MapCodec(bytesCodec, new ModelCodec(LedgerTealValueMeta)),
    },
  ],
}

/**
 * Stores the LocalState associated with an application.
 */
export type LedgerAppLocalState = {
  schema: LedgerStateSchema
  keyValue?: Map<Uint8Array, LedgerTealValue>
}

export const LedgerAppLocalStateMeta: ObjectModelMetadata = {
  name: 'LedgerAppLocalState',
  kind: 'object',
  fields: [
    { name: 'schema', wireKey: 'hsch', optional: false, nullable: false, codec: new ModelCodec(LedgerStateSchemaMeta) },
    {
      name: 'keyValue',
      wireKey: 'tkv',
      optional: true,
      nullable: false,
      codec: new MapCodec(bytesCodec, new ModelCodec(LedgerTealValueMeta)),
    },
  ],
}

/**
 * Tracks a changed AppLocalState, and whether it was deleted.
 */
export type LedgerAppLocalStateDelta = {
  deleted: boolean
  localState?: LedgerAppLocalState
}

export const LedgerAppLocalStateDeltaMeta: ObjectModelMetadata = {
  name: 'LedgerAppLocalStateDelta',
  kind: 'object',
  fields: [
    { name: 'deleted', wireKey: 'Deleted', optional: false, nullable: false, codec: booleanCodec },
    { name: 'localState', wireKey: 'LocalState', optional: true, nullable: false, codec: new ModelCodec(LedgerAppLocalStateMeta) },
  ],
}

/**
 * Tracks a changed AppParams, and whether it was deleted.
 */
export type LedgerAppParamsDelta = {
  deleted: boolean
  params?: LedgerAppParams
}

export const LedgerAppParamsDeltaMeta: ObjectModelMetadata = {
  name: 'LedgerAppParamsDelta',
  kind: 'object',
  fields: [
    { name: 'deleted', wireKey: 'Deleted', optional: false, nullable: false, codec: booleanCodec },
    { name: 'params', wireKey: 'Params', optional: true, nullable: false, codec: new ModelCodec(LedgerAppParamsMeta) },
  ],
}

/**
 * Represents AppParams and AppLocalState in deltas.
 */
export type LedgerAppResourceRecord = {
  appId: bigint
  address: string
  params: LedgerAppParamsDelta
  state: LedgerAppLocalStateDelta
}

export const LedgerAppResourceRecordMeta: ObjectModelMetadata = {
  name: 'LedgerAppResourceRecord',
  kind: 'object',
  fields: [
    { name: 'appId', wireKey: 'Aidx', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'address', wireKey: 'Addr', optional: false, nullable: false, codec: addressCodec },
    { name: 'params', wireKey: 'Params', optional: false, nullable: false, codec: new ModelCodec(LedgerAppParamsDeltaMeta) },
    { name: 'state', wireKey: 'State', optional: false, nullable: false, codec: new ModelCodec(LedgerAppLocalStateDeltaMeta) },
  ],
}

/**
 * Describes an asset held by an account.
 */
export type LedgerAssetHolding = {
  amount: bigint
  frozen: boolean
}

export const LedgerAssetHoldingMeta: ObjectModelMetadata = {
  name: 'LedgerAssetHolding',
  kind: 'object',
  fields: [
    { name: 'amount', wireKey: 'a', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'frozen', wireKey: 'f', optional: false, nullable: false, codec: booleanCodec },
  ],
}

/**
 * Records a changed AssetHolding, and whether it was deleted.
 */
export type LedgerAssetHoldingDelta = {
  deleted: boolean
  holding?: LedgerAssetHolding
}

export const LedgerAssetHoldingDeltaMeta: ObjectModelMetadata = {
  name: 'LedgerAssetHoldingDelta',
  kind: 'object',
  fields: [
    { name: 'deleted', wireKey: 'Deleted', optional: false, nullable: false, codec: booleanCodec },
    { name: 'holding', wireKey: 'Holding', optional: true, nullable: false, codec: new ModelCodec(LedgerAssetHoldingMeta) },
  ],
}

/**
 * Describes the parameters of an asset.
 */
export type LedgerAssetParams = {
  /**
   * Specifies the total number of units of this asset created.
   */
  total: bigint
  /**
   * Specifies the number of digits to display after the decimal place when displaying this asset.
   * A value of 0 represents an asset that is not divisible, a value of 1 represents an asset divisible into tenths, and so on.
   * This value must be between 0 and 19 (inclusive).
   */
  decimals: number
  /**
   * Specifies whether slots for this asset in user accounts are frozen by default or not.
   */
  defaultFrozen: boolean
  /**
   * Specifies a hint for the name of a unit of this asset.
   */
  unitName?: string
  /**
   * Specifies a hint for the name of the asset.
   */
  assetName?: string
  /**
   * Specifies a URL where more information about the asset can be retrieved.
   */
  url?: string
  /**
   * Specifies a commitment to some unspecified asset metadata. The format of this
   * metadata is up to the application.
   */
  metadataHash?: Uint8Array
  /**
   * Manager specifies an account that is allowed to change the non-zero addresses in this AssetParams.
   */
  manager?: string
  /**
   * Specifies an account whose holdings of this asset should be reported as "not minted".
   */
  reserve?: string
  /**
   * Specifies an account that is allowed to change the frozen state of holdings of this asset.
   */
  freeze?: string
  /**
   * Specifies an account that is allowed to take units of this asset from any account.
   */
  clawback?: string
}

export const LedgerAssetParamsMeta: ObjectModelMetadata = {
  name: 'LedgerAssetParams',
  kind: 'object',
  fields: [
    { name: 'total', wireKey: 't', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'decimals', wireKey: 'dc', optional: false, nullable: false, codec: numberCodec },
    { name: 'defaultFrozen', wireKey: 'df', optional: false, nullable: false, codec: booleanCodec },
    { name: 'unitName', wireKey: 'un', optional: true, nullable: false, codec: stringCodec },
    { name: 'assetName', wireKey: 'an', optional: true, nullable: false, codec: stringCodec },
    { name: 'url', wireKey: 'au', optional: true, nullable: false, codec: stringCodec },
    { name: 'metadataHash', wireKey: 'am', optional: true, nullable: false, codec: bytesCodec },
    { name: 'manager', wireKey: 'm', optional: true, nullable: false, codec: addressCodec },
    { name: 'reserve', wireKey: 'r', optional: true, nullable: false, codec: addressCodec },
    { name: 'freeze', wireKey: 'f', optional: true, nullable: false, codec: addressCodec },
    { name: 'clawback', wireKey: 'c', optional: true, nullable: false, codec: addressCodec },
  ],
}

/**
 * Tracks a changed asset params, and whether it was deleted.
 */
export type LedgerAssetParamsDelta = {
  deleted: boolean
  params?: LedgerAssetParams
}

export const LedgerAssetParamsDeltaMeta: ObjectModelMetadata = {
  name: 'LedgerAssetParamsDelta',
  kind: 'object',
  fields: [
    { name: 'deleted', wireKey: 'Deleted', optional: false, nullable: false, codec: booleanCodec },
    { name: 'params', wireKey: 'Params', optional: true, nullable: false, codec: new ModelCodec(LedgerAssetParamsMeta) },
  ],
}

/**
 * Represents asset params and asset holding in deltas.
 */
export type LedgerAssetResourceRecord = {
  assetId: bigint
  address: string
  params: LedgerAssetParamsDelta
  holding: LedgerAssetHoldingDelta
}

export const LedgerAssetResourceRecordMeta: ObjectModelMetadata = {
  name: 'LedgerAssetResourceRecord',
  kind: 'object',
  fields: [
    { name: 'assetId', wireKey: 'Aidx', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'address', wireKey: 'Addr', optional: false, nullable: false, codec: addressCodec },
    { name: 'params', wireKey: 'Params', optional: false, nullable: false, codec: new ModelCodec(LedgerAssetParamsDeltaMeta) },
    { name: 'holding', wireKey: 'Holding', optional: false, nullable: false, codec: new ModelCodec(LedgerAssetHoldingDeltaMeta) },
  ],
}

/**
 * Holds participation information.
 */
export type LedgerVotingData = {
  voteId: Uint8Array
  selectionId: Uint8Array
  stateProofId: Uint8Array
  voteFirstValid: bigint
  voteLastValid: bigint
  voteKeyDilution: bigint
}

export const LedgerVotingDataMeta: ObjectModelMetadata = {
  name: 'LedgerVotingData',
  kind: 'object',
  fields: [
    { name: 'voteId', wireKey: 'VoteID', optional: false, nullable: false, codec: bytesCodec },
    { name: 'selectionId', wireKey: 'SelectionID', optional: false, nullable: false, codec: bytesCodec },
    { name: 'stateProofId', wireKey: 'StateProofID', optional: false, nullable: false, codec: bytesCodec },
    { name: 'voteFirstValid', wireKey: 'VoteFirstValid', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'voteLastValid', wireKey: 'VoteLastValid', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'voteKeyDilution', wireKey: 'VoteKeyDilution', optional: false, nullable: false, codec: bigIntCodec },
  ],
}

/**
 * Contains base account info like balance, status and total number of resources.
 */
export type LedgerAccountBaseData = {
  /**
   * Account status. Values are:
   * * 0: Offline
   * * 1: Online
   * * 2: NotParticipating
   */
  status: number
  microAlgos: bigint
  rewardsBase: bigint
  rewardedMicroAlgos: bigint
  authAddress: string
  incentiveEligible: boolean
  /**
   * Totals across created globals, and opted in locals.
   */
  totalAppSchema: LedgerStateSchema
  /**
   * Total number of extra pages across all created apps.
   */
  totalExtraAppPages: number
  /**
   * Total number of apps this account has created.
   */
  totalAppParams: number
  /**
   * Total number of apps this account is opted into.
   */
  totalAppLocalStates: number
  /**
   * Total number of assets created by this account.
   */
  totalAssetParams: number
  /**
   * Total of asset creations and optins (i.e. number of holdings).
   */
  totalAssets: number
  /**
   * Total number of boxes associated to this account.
   */
  totalBoxes: bigint
  /**
   * Total bytes for this account's boxes. keys and values count.
   */
  totalBoxBytes: bigint
  /**
   * The last round that this account proposed the winning block.
   */
  lastProposed: bigint
  /**
   * The last round that this account sent a heartbeat to show it was online.
   */
  lastHeartbeat: bigint
}

export const LedgerAccountBaseDataMeta: ObjectModelMetadata = {
  name: 'LedgerAccountBaseData',
  kind: 'object',
  fields: [
    { name: 'status', wireKey: 'Status', optional: false, nullable: false, codec: numberCodec },
    { name: 'microAlgos', wireKey: 'MicroAlgos', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'rewardsBase', wireKey: 'RewardsBase', optional: false, nullable: false, codec: bigIntCodec },
    {
      name: 'rewardedMicroAlgos',
      wireKey: 'RewardedMicroAlgos',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
    { name: 'authAddress', wireKey: 'AuthAddr', optional: false, nullable: false, codec: addressCodec },
    { name: 'incentiveEligible', wireKey: 'IncentiveEligible', optional: false, nullable: false, codec: booleanCodec },
    {
      name: 'totalAppSchema',
      wireKey: 'TotalAppSchema',
      optional: false,
      nullable: false,
      codec: new ModelCodec(LedgerStateSchemaMeta),
    },
    { name: 'totalExtraAppPages', wireKey: 'TotalExtraAppPages', optional: false, nullable: false, codec: numberCodec },
    { name: 'totalAppParams', wireKey: 'TotalAppParams', optional: false, nullable: false, codec: numberCodec },
    { name: 'totalAppLocalStates', wireKey: 'TotalAppLocalStates', optional: false, nullable: false, codec: numberCodec },
    { name: 'totalAssetParams', wireKey: 'TotalAssetParams', optional: false, nullable: false, codec: numberCodec },
    { name: 'totalAssets', wireKey: 'TotalAssets', optional: false, nullable: false, codec: numberCodec },
    { name: 'totalBoxes', wireKey: 'TotalBoxes', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'totalBoxBytes', wireKey: 'TotalBoxBytes', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'lastProposed', wireKey: 'LastProposed', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'lastHeartbeat', wireKey: 'LastHeartbeat', optional: false, nullable: false, codec: bigIntCodec },
  ],
}

/**
 * Provides per-account data.
 */
export type LedgerAccountData = {
  accountBaseData: LedgerAccountBaseData
  votingData: LedgerVotingData
}

export const LedgerAccountDataMeta: ObjectModelMetadata = {
  name: 'LedgerAccountData',
  kind: 'object',
  fields: [
    {
      name: 'accountBaseData',
      flattened: true,
      optional: false,
      nullable: false,
      codec: new ModelCodec(LedgerAccountBaseDataMeta),
    },
    { name: 'votingData', flattened: true, optional: false, nullable: false, codec: new ModelCodec(LedgerVotingDataMeta) },
  ],
}

export type LedgerBalanceRecord = {
  address: string
  accountData: LedgerAccountData
}

export const LedgerBalanceRecordMeta: ObjectModelMetadata = {
  name: 'LedgerBalanceRecord',
  kind: 'object',
  fields: [
    { name: 'address', wireKey: 'Addr', optional: false, nullable: false, codec: addressCodec },
    { name: 'accountData', flattened: true, optional: false, nullable: false, codec: new ModelCodec(LedgerAccountDataMeta) },
  ],
}

export type LedgerAccountDeltas = {
  accounts?: LedgerBalanceRecord[]
  appResources?: LedgerAppResourceRecord[]
  assetResources?: LedgerAssetResourceRecord[]
}

export const LedgerAccountDeltasMeta: ObjectModelMetadata = {
  name: 'LedgerAccountDeltas',
  kind: 'object',
  fields: [
    {
      name: 'accounts',
      wireKey: 'Accts',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(LedgerBalanceRecordMeta)),
    },
    {
      name: 'appResources',
      wireKey: 'AppResources',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(LedgerAppResourceRecordMeta)),
    },
    {
      name: 'assetResources',
      wireKey: 'AssetResources',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(LedgerAssetResourceRecordMeta)),
    },
  ],
}

/**
 * Shows how the data associated with a key in the kvstore has changed.
 */
export type LedgerKvValueDelta = {
  /**
   * Stores the most recent value (undefined means deleted).
   */
  data?: Uint8Array
  /**
   * Stores the previous value (undefined means didn't exist).
   */
  oldData?: Uint8Array
}

export const LedgerKvValueDeltaMeta: ObjectModelMetadata = {
  name: 'LedgerKvValueDelta',
  kind: 'object',
  fields: [
    { name: 'data', wireKey: 'Data', optional: true, nullable: false, codec: bytesCodec },
    { name: 'oldData', wireKey: 'OldData', optional: true, nullable: false, codec: bytesCodec },
  ],
}

/**
 * Defines the transactions included in a block, their index and last valid round.
 */
export type LedgerIncludedTransactions = {
  lastValid: bigint
  /**
   * The index of the transaction in the block.
   */
  intra: number
}

export const LedgerIncludedTransactionsMeta: ObjectModelMetadata = {
  name: 'LedgerIncludedTransactions',
  kind: 'object',
  fields: [
    { name: 'lastValid', wireKey: 'LastValid', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'intra', wireKey: 'Intra', optional: false, nullable: false, codec: numberCodec },
  ],
}

/**
 * Represents a change to a single creatable state.
 */
export type LedgerModifiedCreatable = {
  /**
   * Type of the creatable. The values are:
   * * 0: Asset
   * * 1: Application
   */
  creatableType: number
  /**
   * Created if true, deleted if false.
   */
  created: boolean
  /**
   * Creator of the app/asset.
   */
  creator: string
  /**
   * Keeps track of how many times this app/asset appears in accountUpdates.creatableDeltas.
   */
  nDeltas: number
}

export const LedgerModifiedCreatableMeta: ObjectModelMetadata = {
  name: 'LedgerModifiedCreatable',
  kind: 'object',
  fields: [
    { name: 'creatableType', wireKey: 'Ctype', optional: false, nullable: false, codec: numberCodec },
    { name: 'created', wireKey: 'Created', optional: false, nullable: false, codec: booleanCodec },
    { name: 'creator', wireKey: 'Creator', optional: false, nullable: false, codec: addressCodec },
    { name: 'ndeltas', wireKey: 'Ndeltas', optional: false, nullable: false, codec: numberCodec },
  ],
}

/**
 * Represents a total of algos of a certain class of accounts (split up by their Status value).
 */
export type LedgerAlgoCount = {
  /**
   * Sum of algos of all accounts in this scope.
   */
  money: bigint
  /**
   * Total number of whole reward units in accounts.
   */
  rewardUnits: bigint
}

export const LedgerAlgoCountMeta: ObjectModelMetadata = {
  name: 'LedgerAlgoCount',
  kind: 'object',
  fields: [
    { name: 'money', wireKey: 'mon', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'rewardUnits', wireKey: 'rwd', optional: false, nullable: false, codec: bigIntCodec },
  ],
}

/**
 * Represents the totals of algos in the system grouped by different account status values.
 */
export type LedgerAccountTotals = {
  online: LedgerAlgoCount
  offline: LedgerAlgoCount
  notParticipating: LedgerAlgoCount
  /**
   * Total number of algos received per reward unit since genesis.
   */
  rewardsLevel: bigint
}

export const LedgerAccountTotalsMeta: ObjectModelMetadata = {
  name: 'LedgerAccountTotals',
  kind: 'object',
  fields: [
    { name: 'online', wireKey: 'online', optional: false, nullable: false, codec: new ModelCodec(LedgerAlgoCountMeta) },
    { name: 'offline', wireKey: 'offline', optional: false, nullable: false, codec: new ModelCodec(LedgerAlgoCountMeta) },
    { name: 'notParticipating', wireKey: 'notpart', optional: false, nullable: false, codec: new ModelCodec(LedgerAlgoCountMeta) },
    { name: 'rewardsLevel', wireKey: 'rwdlvl', optional: false, nullable: false, codec: bigIntCodec },
  ],
}

/**
 * Describes the delta between a given round to the previous round.
 */
export type LedgerStateDelta = {
  /**
   * Modified new accounts.
   */
  accounts: LedgerAccountDeltas
  /**
   * Block header.
   */
  block: Block
  /**
   * Represents modification on StateProofNextRound field in the block header. If the block contains
   * a valid state proof transaction, this field will contain the next round for state proof.
   * otherwise it will be set to 0.
   */
  stateProofNext: bigint
  /**
   * Previous block timestamp
   */
  prevTimestamp: bigint
  /**
   * The account totals reflecting the changes in this StateDelta object.
   */
  totals: LedgerAccountTotals
  /**
   * Modified kv pairs.
   */
  kvMods?: Map<Uint8Array, LedgerKvValueDelta>
  /**
   * New Txids for the txtail and TxnCounter, mapped to txn.LastValid.
   */
  txIds?: Map<Uint8Array, LedgerIncludedTransactions>
  /**
   * New creatables creator lookup table.
   */
  creatables?: Map<number, LedgerModifiedCreatable>
}

export const LedgerStateDeltaMeta: ObjectModelMetadata = {
  name: 'LedgerStateDelta',
  kind: 'object',
  fields: [
    { name: 'accounts', wireKey: 'Accts', optional: false, nullable: false, codec: new ModelCodec(LedgerAccountDeltasMeta) },
    { name: 'block', wireKey: 'Hdr', optional: false, nullable: false, codec: new ModelCodec(BlockMeta) },
    { name: 'stateProofNext', wireKey: 'StateProofNext', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'prevTimestamp', wireKey: 'PrevTimestamp', optional: false, nullable: false, codec: bigIntCodec },
    { name: 'totals', wireKey: 'Totals', optional: false, nullable: false, codec: new ModelCodec(LedgerAccountTotalsMeta) },
    {
      name: 'kvMods',
      wireKey: 'KvMods',
      optional: true,
      nullable: false,
      codec: new MapCodec(bytesCodec, new ModelCodec(LedgerKvValueDeltaMeta)),
    },
    {
      name: 'txIds',
      wireKey: 'Txids',
      optional: true,
      nullable: false,
      codec: new MapCodec(bytesCodec, new ModelCodec(LedgerIncludedTransactionsMeta)),
    },
    {
      name: 'creatables',
      wireKey: 'Creatables',
      optional: true,
      nullable: false,
      codec: new MapCodec(numberWithNoDefaultCodec, new ModelCodec(LedgerModifiedCreatableMeta)),
    },
  ],
}
