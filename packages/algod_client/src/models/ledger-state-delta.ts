import type { ModelMetadata } from '../core/model-runtime'
import type { Block } from './block'
import { BlockMeta } from './block'

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

export const LedgerTealValueMeta: ModelMetadata = {
  name: 'LedgerTealValue',
  kind: 'object',
  fields: [
    { name: 'type', wireKey: 'tt', optional: false, nullable: false, type: { kind: 'scalar' } },
    { name: 'bytes', wireKey: 'tb', optional: true, nullable: false, type: { kind: 'scalar', isBytes: true } },
    { name: 'uint', wireKey: 'ui', optional: true, nullable: false, type: { kind: 'scalar', isBigint: true } },
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

export const LedgerStateSchemaMeta: ModelMetadata = {
  name: 'LedgerStateSchema',
  kind: 'object',
  fields: [
    { name: 'numUints', wireKey: 'nui', optional: true, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'numByteSlices', wireKey: 'nbs', optional: true, nullable: false, type: { kind: 'scalar', isBigint: true } },
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

export const LedgerAppParamsMeta: ModelMetadata = {
  name: 'LedgerAppParams',
  kind: 'object',
  fields: [
    { name: 'approvalProgram', wireKey: 'approv', optional: false, nullable: false, type: { kind: 'scalar', isBytes: true } },
    { name: 'clearStateProgram', wireKey: 'clearp', optional: false, nullable: false, type: { kind: 'scalar', isBytes: true } },
    { name: 'localStateSchema', wireKey: 'lsch', optional: false, nullable: false, type: { kind: 'model', meta: LedgerStateSchemaMeta } },
    { name: 'globalStateSchema', wireKey: 'gsch', optional: false, nullable: false, type: { kind: 'model', meta: LedgerStateSchemaMeta } },
    { name: 'extraProgramPages', wireKey: 'epp', optional: false, nullable: false, type: { kind: 'scalar' } },
    { name: 'version', wireKey: 'v', optional: true, nullable: false, type: { kind: 'scalar' } },
    { name: 'sizeSponsor', wireKey: 'ss', optional: true, nullable: false, type: { kind: 'scalar', isAddress: true } },
    {
      name: 'globalState',
      wireKey: 'gs',
      optional: true,
      nullable: false,
      type: { kind: 'map', keyType: 'bytes', value: { kind: 'model', meta: LedgerTealValueMeta } },
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

export const LedgerAppLocalStateMeta: ModelMetadata = {
  name: 'LedgerAppLocalState',
  kind: 'object',
  fields: [
    { name: 'schema', wireKey: 'hsch', optional: false, nullable: false, type: { kind: 'model', meta: LedgerStateSchemaMeta } },
    {
      name: 'keyValue',
      wireKey: 'tkv',
      optional: true,
      nullable: false,
      type: { kind: 'map', keyType: 'bytes', value: { kind: 'model', meta: LedgerTealValueMeta } },
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

export const LedgerAppLocalStateDeltaMeta: ModelMetadata = {
  name: 'LedgerAppLocalStateDelta',
  kind: 'object',
  fields: [
    { name: 'deleted', wireKey: 'Deleted', optional: false, nullable: false, type: { kind: 'scalar' } },
    { name: 'localState', wireKey: 'LocalState', optional: true, nullable: false, type: { kind: 'model', meta: LedgerAppLocalStateMeta } },
  ],
}

/**
 * Tracks a changed AppParams, and whether it was deleted.
 */
export type LedgerAppParamsDelta = {
  deleted: boolean
  params?: LedgerAppParams
}

export const LedgerAppParamsDeltaMeta: ModelMetadata = {
  name: 'LedgerAppParamsDelta',
  kind: 'object',
  fields: [
    { name: 'deleted', wireKey: 'Deleted', optional: false, nullable: false, type: { kind: 'scalar' } },
    { name: 'params', wireKey: 'Params', optional: true, nullable: false, type: { kind: 'model', meta: LedgerAppParamsMeta } },
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

export const LedgerAppResourceRecordMeta: ModelMetadata = {
  name: 'LedgerAppResourceRecord',
  kind: 'object',
  fields: [
    { name: 'appId', wireKey: 'Aidx', optional: false, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'address', wireKey: 'Addr', optional: false, nullable: false, type: { kind: 'scalar', isAddress: true } },
    { name: 'params', wireKey: 'Params', optional: false, nullable: false, type: { kind: 'model', meta: LedgerAppParamsDeltaMeta } },
    { name: 'state', wireKey: 'State', optional: false, nullable: false, type: { kind: 'model', meta: LedgerAppLocalStateDeltaMeta } },
  ],
}

/**
 * Describes an asset held by an account.
 */
export type LedgerAssetHolding = {
  amount: bigint
  frozen: boolean
}

export const LedgerAssetHoldingMeta: ModelMetadata = {
  name: 'LedgerAssetHolding',
  kind: 'object',
  fields: [
    { name: 'amount', wireKey: 'a', optional: false, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'frozen', wireKey: 'f', optional: false, nullable: false, type: { kind: 'scalar' } },
  ],
}

/**
 * Records a changed AssetHolding, and whether it was deleted.
 */
export type LedgerAssetHoldingDelta = {
  deleted: boolean
  holding?: LedgerAssetHolding
}

export const LedgerAssetHoldingDeltaMeta: ModelMetadata = {
  name: 'LedgerAssetHoldingDelta',
  kind: 'object',
  fields: [
    { name: 'deleted', wireKey: 'Deleted', optional: false, nullable: false, type: { kind: 'scalar' } },
    { name: 'holding', wireKey: 'Holding', optional: true, nullable: false, type: { kind: 'model', meta: LedgerAssetHoldingMeta } },
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

export const LedgerAssetParamsMeta: ModelMetadata = {
  name: 'LedgerAssetParams',
  kind: 'object',
  fields: [
    { name: 'total', wireKey: 't', optional: false, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'decimals', wireKey: 'dc', optional: false, nullable: false, type: { kind: 'scalar' } },
    { name: 'defaultFrozen', wireKey: 'df', optional: false, nullable: false, type: { kind: 'scalar' } },
    { name: 'unitName', wireKey: 'un', optional: true, nullable: false, type: { kind: 'scalar' } },
    { name: 'assetName', wireKey: 'an', optional: true, nullable: false, type: { kind: 'scalar' } },
    { name: 'url', wireKey: 'au', optional: true, nullable: false, type: { kind: 'scalar' } },
    { name: 'metadataHash', wireKey: 'am', optional: true, nullable: false, type: { kind: 'scalar', isBytes: true } },
    { name: 'manager', wireKey: 'm', optional: true, nullable: false, type: { kind: 'scalar', isAddress: true } },
    { name: 'reserve', wireKey: 'r', optional: true, nullable: false, type: { kind: 'scalar', isAddress: true } },
    { name: 'freeze', wireKey: 'f', optional: true, nullable: false, type: { kind: 'scalar', isAddress: true } },
    { name: 'clawback', wireKey: 'c', optional: true, nullable: false, type: { kind: 'scalar', isAddress: true } },
  ],
}

/**
 * Tracks a changed asset params, and whether it was deleted.
 */
export type LedgerAssetParamsDelta = {
  deleted: boolean
  params?: LedgerAssetParams
}

export const LedgerAssetParamsDeltaMeta: ModelMetadata = {
  name: 'LedgerAssetParamsDelta',
  kind: 'object',
  fields: [
    { name: 'deleted', wireKey: 'Deleted', optional: false, nullable: false, type: { kind: 'scalar' } },
    { name: 'params', wireKey: 'Params', optional: true, nullable: false, type: { kind: 'model', meta: LedgerAssetParamsMeta } },
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

export const LedgerAssetResourceRecordMeta: ModelMetadata = {
  name: 'LedgerAssetResourceRecord',
  kind: 'object',
  fields: [
    { name: 'assetId', wireKey: 'Aidx', optional: false, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'address', wireKey: 'Addr', optional: false, nullable: false, type: { kind: 'scalar', isAddress: true } },
    { name: 'params', wireKey: 'Params', optional: false, nullable: false, type: { kind: 'model', meta: LedgerAssetParamsDeltaMeta } },
    { name: 'holding', wireKey: 'Holding', optional: false, nullable: false, type: { kind: 'model', meta: LedgerAssetHoldingDeltaMeta } },
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

export const LedgerVotingDataMeta: ModelMetadata = {
  name: 'LedgerVotingData',
  kind: 'object',
  fields: [
    { name: 'voteId', wireKey: 'VoteID', optional: false, nullable: false, type: { kind: 'scalar', isBytes: true } },
    { name: 'selectionId', wireKey: 'SelectionID', optional: false, nullable: false, type: { kind: 'scalar', isBytes: true } },
    { name: 'stateProofId', wireKey: 'StateProofID', optional: false, nullable: false, type: { kind: 'scalar', isBytes: true } },
    { name: 'voteFirstValid', wireKey: 'VoteFirstValid', optional: false, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'voteLastValid', wireKey: 'VoteLastValid', optional: false, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'voteKeyDilution', wireKey: 'VoteKeyDilution', optional: false, nullable: false, type: { kind: 'scalar', isBigint: true } },
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

export const LedgerAccountBaseDataMeta: ModelMetadata = {
  name: 'LedgerAccountBaseData',
  kind: 'object',
  fields: [
    { name: 'status', wireKey: 'Status', optional: false, nullable: false, type: { kind: 'scalar' } },
    { name: 'microAlgos', wireKey: 'MicroAlgos', optional: false, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'rewardsBase', wireKey: 'RewardsBase', optional: false, nullable: false, type: { kind: 'scalar', isBigint: true } },
    {
      name: 'rewardedMicroAlgos',
      wireKey: 'RewardedMicroAlgos',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    { name: 'authAddress', wireKey: 'AuthAddr', optional: false, nullable: false, type: { kind: 'scalar', isAddress: true } },
    { name: 'incentiveEligible', wireKey: 'IncentiveEligible', optional: false, nullable: false, type: { kind: 'scalar' } },
    {
      name: 'totalAppSchema',
      wireKey: 'TotalAppSchema',
      optional: false,
      nullable: false,
      type: { kind: 'model', meta: LedgerStateSchemaMeta },
    },
    { name: 'totalExtraAppPages', wireKey: 'TotalExtraAppPages', optional: false, nullable: false, type: { kind: 'scalar' } },
    { name: 'totalAppParams', wireKey: 'TotalAppParams', optional: false, nullable: false, type: { kind: 'scalar' } },
    { name: 'totalAppLocalStates', wireKey: 'TotalAppLocalStates', optional: false, nullable: false, type: { kind: 'scalar' } },
    { name: 'totalAssetParams', wireKey: 'TotalAssetParams', optional: false, nullable: false, type: { kind: 'scalar' } },
    { name: 'totalAssets', wireKey: 'TotalAssets', optional: false, nullable: false, type: { kind: 'scalar' } },
    { name: 'totalBoxes', wireKey: 'TotalBoxes', optional: false, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'totalBoxBytes', wireKey: 'TotalBoxBytes', optional: false, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'lastProposed', wireKey: 'LastProposed', optional: false, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'lastHeartbeat', wireKey: 'LastHeartbeat', optional: false, nullable: false, type: { kind: 'scalar', isBigint: true } },
  ],
}

/**
 * Provides per-account data.
 */
export type LedgerAccountData = {
  accountBaseData: LedgerAccountBaseData
  votingData: LedgerVotingData
}

export const LedgerAccountDataMeta: ModelMetadata = {
  name: 'LedgerAccountData',
  kind: 'object',
  fields: [
    {
      name: 'accountBaseData',
      flattened: true,
      optional: false,
      nullable: false,
      type: { kind: 'model', meta: LedgerAccountBaseDataMeta },
    },
    { name: 'votingData', flattened: true, optional: false, nullable: false, type: { kind: 'model', meta: LedgerVotingDataMeta } },
  ],
}

export type LedgerBalanceRecord = {
  address: string
  accountData: LedgerAccountData
}

export const LedgerBalanceRecordMeta: ModelMetadata = {
  name: 'LedgerBalanceRecord',
  kind: 'object',
  fields: [
    { name: 'address', wireKey: 'Addr', optional: false, nullable: false, type: { kind: 'scalar', isAddress: true } },
    { name: 'accountData', flattened: true, optional: false, nullable: false, type: { kind: 'model', meta: LedgerAccountDataMeta } },
  ],
}

export type LedgerAccountDeltas = {
  accounts?: LedgerBalanceRecord[]
  appResources?: LedgerAppResourceRecord[]
  assetResources?: LedgerAssetResourceRecord[]
}

export const LedgerAccountDeltasMeta: ModelMetadata = {
  name: 'LedgerAccountDeltas',
  kind: 'object',
  fields: [
    {
      name: 'accounts',
      wireKey: 'Accts',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: LedgerBalanceRecordMeta } },
    },
    {
      name: 'appResources',
      wireKey: 'AppResources',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: LedgerAppResourceRecordMeta } },
    },
    {
      name: 'assetResources',
      wireKey: 'AssetResources',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: LedgerAssetResourceRecordMeta } },
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

export const LedgerKvValueDeltaMeta: ModelMetadata = {
  name: 'LedgerKvValueDelta',
  kind: 'object',
  fields: [
    { name: 'data', wireKey: 'Data', optional: true, nullable: false, type: { kind: 'scalar', isBytes: true } },
    { name: 'oldData', wireKey: 'OldData', optional: true, nullable: false, type: { kind: 'scalar', isBytes: true } },
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

export const LedgerIncludedTransactionsMeta: ModelMetadata = {
  name: 'LedgerIncludedTransactions',
  kind: 'object',
  fields: [
    { name: 'lastValid', wireKey: 'LastValid', optional: false, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'intra', wireKey: 'Intra', optional: false, nullable: false, type: { kind: 'scalar' } },
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

export const LedgerModifiedCreatableMeta: ModelMetadata = {
  name: 'LedgerModifiedCreatable',
  kind: 'object',
  fields: [
    { name: 'creatableType', wireKey: 'Ctype', optional: false, nullable: false, type: { kind: 'scalar' } },
    { name: 'created', wireKey: 'Created', optional: false, nullable: false, type: { kind: 'scalar' } },
    { name: 'creator', wireKey: 'Creator', optional: false, nullable: false, type: { kind: 'scalar', isAddress: true } },
    { name: 'ndeltas', wireKey: 'Ndeltas', optional: false, nullable: false, type: { kind: 'scalar' } },
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

export const LedgerAlgoCountMeta: ModelMetadata = {
  name: 'LedgerAlgoCount',
  kind: 'object',
  fields: [
    { name: 'money', wireKey: 'mon', optional: false, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'rewardUnits', wireKey: 'rwd', optional: false, nullable: false, type: { kind: 'scalar', isBigint: true } },
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

export const LedgerAccountTotalsMeta: ModelMetadata = {
  name: 'LedgerAccountTotals',
  kind: 'object',
  fields: [
    { name: 'online', wireKey: 'online', optional: false, nullable: false, type: { kind: 'model', meta: LedgerAlgoCountMeta } },
    { name: 'offline', wireKey: 'offline', optional: false, nullable: false, type: { kind: 'model', meta: LedgerAlgoCountMeta } },
    { name: 'notParticipating', wireKey: 'notpart', optional: false, nullable: false, type: { kind: 'model', meta: LedgerAlgoCountMeta } },
    { name: 'rewardsLevel', wireKey: 'rwdlvl', optional: false, nullable: false, type: { kind: 'scalar', isBigint: true } },
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
   *  New txleases for the txtail mapped to expiration.
   */
  txLeases?: Record<string, unknown>
  /**
   * New creatables creator lookup table.
   */
  creatables?: Map<number, LedgerModifiedCreatable>
}

export const LedgerStateDeltaMeta: ModelMetadata = {
  name: 'LedgerStateDelta',
  kind: 'object',
  fields: [
    { name: 'accounts', wireKey: 'Accts', optional: false, nullable: false, type: { kind: 'model', meta: LedgerAccountDeltasMeta } },
    { name: 'block', wireKey: 'Hdr', optional: false, nullable: false, type: { kind: 'model', meta: BlockMeta } },
    { name: 'stateProofNext', wireKey: 'StateProofNext', optional: false, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'prevTimestamp', wireKey: 'PrevTimestamp', optional: false, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'totals', wireKey: 'Totals', optional: false, nullable: false, type: { kind: 'model', meta: LedgerAccountTotalsMeta } },
    {
      name: 'kvMods',
      wireKey: 'KvMods',
      optional: true,
      nullable: false,
      type: { kind: 'map', keyType: 'bytes', value: { kind: 'model', meta: LedgerKvValueDeltaMeta } },
    },
    {
      name: 'txIds',
      wireKey: 'Txids',
      optional: true,
      nullable: false,
      type: { kind: 'map', keyType: 'bytes', value: { kind: 'model', meta: LedgerIncludedTransactionsMeta } },
    },
    { name: 'txLeases', wireKey: 'Txleases', optional: true, nullable: false, type: { kind: 'scalar' } },
    {
      name: 'creatables',
      wireKey: 'Creatables',
      optional: true,
      nullable: false,
      type: { kind: 'map', keyType: 'number', value: { kind: 'model', meta: LedgerModifiedCreatableMeta } },
    },
  ],
}
