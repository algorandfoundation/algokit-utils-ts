import type { Block } from './block'
import { blockCodec } from './block'
import {
  numberCodec,
  bigIntCodec,
  booleanCodec,
  stringCodec,
  bytesCodec,
  addressCodec,
  Address,
  ArrayCodec,
  MapCodec,
  ObjectModelCodec,
  type ObjectModelMetadata,
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

export const LedgerTealValueMeta: ObjectModelMetadata<LedgerTealValue> = {
  name: 'LedgerTealValue',
  kind: 'object',
  fields: [
    { name: 'type', wireKey: 'tt', optional: false, codec: numberCodec },
    { name: 'bytes', wireKey: 'tb', optional: true, codec: bytesCodec },
    { name: 'uint', wireKey: 'ui', optional: true, codec: bigIntCodec },
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

export const LedgerStateSchemaMeta: ObjectModelMetadata<LedgerStateSchema> = {
  name: 'LedgerStateSchema',
  kind: 'object',
  fields: [
    { name: 'numUints', wireKey: 'nui', optional: true, codec: bigIntCodec },
    { name: 'numByteSlices', wireKey: 'nbs', optional: true, codec: bigIntCodec },
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
  sizeSponsor?: Address
  globalState?: Map<Uint8Array, LedgerTealValue>
}

export const LedgerAppParamsMeta: ObjectModelMetadata<LedgerAppParams> = {
  name: 'LedgerAppParams',
  kind: 'object',
  fields: [
    { name: 'approvalProgram', wireKey: 'approv', optional: false, codec: bytesCodec },
    { name: 'clearStateProgram', wireKey: 'clearp', optional: false, codec: bytesCodec },
    { name: 'localStateSchema', wireKey: 'lsch', optional: false, codec: new ObjectModelCodec(LedgerStateSchemaMeta) },
    { name: 'globalStateSchema', wireKey: 'gsch', optional: false, codec: new ObjectModelCodec(LedgerStateSchemaMeta) },
    { name: 'extraProgramPages', wireKey: 'epp', optional: false, codec: numberCodec },
    { name: 'version', wireKey: 'v', optional: true, codec: numberCodec },
    { name: 'sizeSponsor', wireKey: 'ss', optional: true, codec: addressCodec },
    {
      name: 'globalState',
      wireKey: 'gs',
      optional: true,
      codec: new MapCodec(bytesCodec, new ObjectModelCodec(LedgerTealValueMeta)),
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

export const LedgerAppLocalStateMeta: ObjectModelMetadata<LedgerAppLocalState> = {
  name: 'LedgerAppLocalState',
  kind: 'object',
  fields: [
    { name: 'schema', wireKey: 'hsch', optional: false, codec: new ObjectModelCodec(LedgerStateSchemaMeta) },
    {
      name: 'keyValue',
      wireKey: 'tkv',
      optional: true,
      codec: new MapCodec(bytesCodec, new ObjectModelCodec(LedgerTealValueMeta)),
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

export const LedgerAppLocalStateDeltaMeta: ObjectModelMetadata<LedgerAppLocalStateDelta> = {
  name: 'LedgerAppLocalStateDelta',
  kind: 'object',
  fields: [
    { name: 'deleted', wireKey: 'Deleted', optional: false, codec: booleanCodec },
    { name: 'localState', wireKey: 'LocalState', optional: true, codec: new ObjectModelCodec(LedgerAppLocalStateMeta) },
  ],
}

/**
 * Tracks a changed AppParams, and whether it was deleted.
 */
export type LedgerAppParamsDelta = {
  deleted: boolean
  params?: LedgerAppParams
}

export const LedgerAppParamsDeltaMeta: ObjectModelMetadata<LedgerAppParamsDelta> = {
  name: 'LedgerAppParamsDelta',
  kind: 'object',
  fields: [
    { name: 'deleted', wireKey: 'Deleted', optional: false, codec: booleanCodec },
    { name: 'params', wireKey: 'Params', optional: true, codec: new ObjectModelCodec(LedgerAppParamsMeta) },
  ],
}

/**
 * Represents AppParams and AppLocalState in deltas.
 */
export type LedgerAppResourceRecord = {
  appId: bigint
  address: Address
  params: LedgerAppParamsDelta
  state: LedgerAppLocalStateDelta
}

export const LedgerAppResourceRecordMeta: ObjectModelMetadata<LedgerAppResourceRecord> = {
  name: 'LedgerAppResourceRecord',
  kind: 'object',
  fields: [
    { name: 'appId', wireKey: 'Aidx', optional: false, codec: bigIntCodec },
    { name: 'address', wireKey: 'Addr', optional: false, codec: addressCodec },
    { name: 'params', wireKey: 'Params', optional: false, codec: new ObjectModelCodec(LedgerAppParamsDeltaMeta) },
    { name: 'state', wireKey: 'State', optional: false, codec: new ObjectModelCodec(LedgerAppLocalStateDeltaMeta) },
  ],
}

/**
 * Describes an asset held by an account.
 */
export type LedgerAssetHolding = {
  amount: bigint
  frozen: boolean
}

export const LedgerAssetHoldingMeta: ObjectModelMetadata<LedgerAssetHolding> = {
  name: 'LedgerAssetHolding',
  kind: 'object',
  fields: [
    { name: 'amount', wireKey: 'a', optional: false, codec: bigIntCodec },
    { name: 'frozen', wireKey: 'f', optional: false, codec: booleanCodec },
  ],
}

/**
 * Records a changed AssetHolding, and whether it was deleted.
 */
export type LedgerAssetHoldingDelta = {
  deleted: boolean
  holding?: LedgerAssetHolding
}

export const LedgerAssetHoldingDeltaMeta: ObjectModelMetadata<LedgerAssetHoldingDelta> = {
  name: 'LedgerAssetHoldingDelta',
  kind: 'object',
  fields: [
    { name: 'deleted', wireKey: 'Deleted', optional: false, codec: booleanCodec },
    { name: 'holding', wireKey: 'Holding', optional: true, codec: new ObjectModelCodec(LedgerAssetHoldingMeta) },
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
  manager?: Address
  /**
   * Specifies an account whose holdings of this asset should be reported as "not minted".
   */
  reserve?: Address
  /**
   * Specifies an account that is allowed to change the frozen state of holdings of this asset.
   */
  freeze?: Address
  /**
   * Specifies an account that is allowed to take units of this asset from any account.
   */
  clawback?: Address
}

export const LedgerAssetParamsMeta: ObjectModelMetadata<LedgerAssetParams> = {
  name: 'LedgerAssetParams',
  kind: 'object',
  fields: [
    { name: 'total', wireKey: 't', optional: false, codec: bigIntCodec },
    { name: 'decimals', wireKey: 'dc', optional: false, codec: numberCodec },
    { name: 'defaultFrozen', wireKey: 'df', optional: false, codec: booleanCodec },
    { name: 'unitName', wireKey: 'un', optional: true, codec: stringCodec },
    { name: 'assetName', wireKey: 'an', optional: true, codec: stringCodec },
    { name: 'url', wireKey: 'au', optional: true, codec: stringCodec },
    { name: 'metadataHash', wireKey: 'am', optional: true, codec: bytesCodec },
    { name: 'manager', wireKey: 'm', optional: true, codec: addressCodec },
    { name: 'reserve', wireKey: 'r', optional: true, codec: addressCodec },
    { name: 'freeze', wireKey: 'f', optional: true, codec: addressCodec },
    { name: 'clawback', wireKey: 'c', optional: true, codec: addressCodec },
  ],
}

/**
 * Tracks a changed asset params, and whether it was deleted.
 */
export type LedgerAssetParamsDelta = {
  deleted: boolean
  params?: LedgerAssetParams
}

export const LedgerAssetParamsDeltaMeta: ObjectModelMetadata<LedgerAssetParamsDelta> = {
  name: 'LedgerAssetParamsDelta',
  kind: 'object',
  fields: [
    { name: 'deleted', wireKey: 'Deleted', optional: false, codec: booleanCodec },
    { name: 'params', wireKey: 'Params', optional: true, codec: new ObjectModelCodec(LedgerAssetParamsMeta) },
  ],
}

/**
 * Represents asset params and asset holding in deltas.
 */
export type LedgerAssetResourceRecord = {
  assetId: bigint
  address: Address
  params: LedgerAssetParamsDelta
  holding: LedgerAssetHoldingDelta
}

export const LedgerAssetResourceRecordMeta: ObjectModelMetadata<LedgerAssetResourceRecord> = {
  name: 'LedgerAssetResourceRecord',
  kind: 'object',
  fields: [
    { name: 'assetId', wireKey: 'Aidx', optional: false, codec: bigIntCodec },
    { name: 'address', wireKey: 'Addr', optional: false, codec: addressCodec },
    { name: 'params', wireKey: 'Params', optional: false, codec: new ObjectModelCodec(LedgerAssetParamsDeltaMeta) },
    { name: 'holding', wireKey: 'Holding', optional: false, codec: new ObjectModelCodec(LedgerAssetHoldingDeltaMeta) },
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

export const LedgerVotingDataMeta: ObjectModelMetadata<LedgerVotingData> = {
  name: 'LedgerVotingData',
  kind: 'object',
  fields: [
    { name: 'voteId', wireKey: 'VoteID', optional: false, codec: bytesCodec },
    { name: 'selectionId', wireKey: 'SelectionID', optional: false, codec: bytesCodec },
    { name: 'stateProofId', wireKey: 'StateProofID', optional: false, codec: bytesCodec },
    { name: 'voteFirstValid', wireKey: 'VoteFirstValid', optional: false, codec: bigIntCodec },
    { name: 'voteLastValid', wireKey: 'VoteLastValid', optional: false, codec: bigIntCodec },
    { name: 'voteKeyDilution', wireKey: 'VoteKeyDilution', optional: false, codec: bigIntCodec },
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
  authAddress: Address
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

export const LedgerAccountBaseDataMeta: ObjectModelMetadata<LedgerAccountBaseData> = {
  name: 'LedgerAccountBaseData',
  kind: 'object',
  fields: [
    { name: 'status', wireKey: 'Status', optional: false, codec: numberCodec },
    { name: 'microAlgos', wireKey: 'MicroAlgos', optional: false, codec: bigIntCodec },
    { name: 'rewardsBase', wireKey: 'RewardsBase', optional: false, codec: bigIntCodec },
    {
      name: 'rewardedMicroAlgos',
      wireKey: 'RewardedMicroAlgos',
      optional: false,
      codec: bigIntCodec,
    },
    { name: 'authAddress', wireKey: 'AuthAddr', optional: false, codec: addressCodec },
    { name: 'incentiveEligible', wireKey: 'IncentiveEligible', optional: false, codec: booleanCodec },
    {
      name: 'totalAppSchema',
      wireKey: 'TotalAppSchema',
      optional: false,
      codec: new ObjectModelCodec(LedgerStateSchemaMeta),
    },
    { name: 'totalExtraAppPages', wireKey: 'TotalExtraAppPages', optional: false, codec: numberCodec },
    { name: 'totalAppParams', wireKey: 'TotalAppParams', optional: false, codec: numberCodec },
    { name: 'totalAppLocalStates', wireKey: 'TotalAppLocalStates', optional: false, codec: numberCodec },
    { name: 'totalAssetParams', wireKey: 'TotalAssetParams', optional: false, codec: numberCodec },
    { name: 'totalAssets', wireKey: 'TotalAssets', optional: false, codec: numberCodec },
    { name: 'totalBoxes', wireKey: 'TotalBoxes', optional: false, codec: bigIntCodec },
    { name: 'totalBoxBytes', wireKey: 'TotalBoxBytes', optional: false, codec: bigIntCodec },
    { name: 'lastProposed', wireKey: 'LastProposed', optional: false, codec: bigIntCodec },
    { name: 'lastHeartbeat', wireKey: 'LastHeartbeat', optional: false, codec: bigIntCodec },
  ],
}

/**
 * Provides per-account data.
 */
export type LedgerAccountData = {
  accountBaseData: LedgerAccountBaseData
  votingData: LedgerVotingData
}

export const LedgerAccountDataMeta: ObjectModelMetadata<LedgerAccountData> = {
  name: 'LedgerAccountData',
  kind: 'object',
  fields: [
    {
      name: 'accountBaseData',
      flattened: true,
      optional: false,
      codec: new ObjectModelCodec(LedgerAccountBaseDataMeta),
    },
    { name: 'votingData', flattened: true, optional: false, codec: new ObjectModelCodec(LedgerVotingDataMeta) },
  ],
}

export type LedgerBalanceRecord = {
  address: Address
  accountData: LedgerAccountData
}

export const LedgerBalanceRecordMeta: ObjectModelMetadata<LedgerBalanceRecord> = {
  name: 'LedgerBalanceRecord',
  kind: 'object',
  fields: [
    { name: 'address', wireKey: 'Addr', optional: false, codec: addressCodec },
    { name: 'accountData', flattened: true, optional: false, codec: new ObjectModelCodec(LedgerAccountDataMeta) },
  ],
}

export type LedgerAccountDeltas = {
  accounts?: LedgerBalanceRecord[]
  appResources?: LedgerAppResourceRecord[]
  assetResources?: LedgerAssetResourceRecord[]
}

export const LedgerAccountDeltasMeta: ObjectModelMetadata<LedgerAccountDeltas> = {
  name: 'LedgerAccountDeltas',
  kind: 'object',
  fields: [
    {
      name: 'accounts',
      wireKey: 'Accts',
      optional: true,
      codec: new ArrayCodec(new ObjectModelCodec(LedgerBalanceRecordMeta)),
    },
    {
      name: 'appResources',
      wireKey: 'AppResources',
      optional: true,
      codec: new ArrayCodec(new ObjectModelCodec(LedgerAppResourceRecordMeta)),
    },
    {
      name: 'assetResources',
      wireKey: 'AssetResources',
      optional: true,
      codec: new ArrayCodec(new ObjectModelCodec(LedgerAssetResourceRecordMeta)),
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

export const LedgerKvValueDeltaMeta: ObjectModelMetadata<LedgerKvValueDelta> = {
  name: 'LedgerKvValueDelta',
  kind: 'object',
  fields: [
    { name: 'data', wireKey: 'Data', optional: true, codec: bytesCodec },
    { name: 'oldData', wireKey: 'OldData', optional: true, codec: bytesCodec },
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

export const LedgerIncludedTransactionsMeta: ObjectModelMetadata<LedgerIncludedTransactions> = {
  name: 'LedgerIncludedTransactions',
  kind: 'object',
  fields: [
    { name: 'lastValid', wireKey: 'LastValid', optional: false, codec: bigIntCodec },
    { name: 'intra', wireKey: 'Intra', optional: false, codec: numberCodec },
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
  creator: Address
  /**
   * Keeps track of how many times this app/asset appears in accountUpdates.creatableDeltas.
   */
  nDeltas: number
}

export const LedgerModifiedCreatableMeta: ObjectModelMetadata<LedgerModifiedCreatable> = {
  name: 'LedgerModifiedCreatable',
  kind: 'object',
  fields: [
    { name: 'creatableType', wireKey: 'Ctype', optional: false, codec: numberCodec },
    { name: 'created', wireKey: 'Created', optional: false, codec: booleanCodec },
    { name: 'creator', wireKey: 'Creator', optional: false, codec: addressCodec },
    { name: 'ndeltas', wireKey: 'Ndeltas', optional: false, codec: numberCodec },
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

export const LedgerAlgoCountMeta: ObjectModelMetadata<LedgerAlgoCount> = {
  name: 'LedgerAlgoCount',
  kind: 'object',
  fields: [
    { name: 'money', wireKey: 'mon', optional: false, codec: bigIntCodec },
    { name: 'rewardUnits', wireKey: 'rwd', optional: false, codec: bigIntCodec },
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

export const LedgerAccountTotalsMeta: ObjectModelMetadata<LedgerAccountTotals> = {
  name: 'LedgerAccountTotals',
  kind: 'object',
  fields: [
    { name: 'online', wireKey: 'online', optional: false, codec: new ObjectModelCodec(LedgerAlgoCountMeta) },
    { name: 'offline', wireKey: 'offline', optional: false, codec: new ObjectModelCodec(LedgerAlgoCountMeta) },
    { name: 'notParticipating', wireKey: 'notpart', optional: false, codec: new ObjectModelCodec(LedgerAlgoCountMeta) },
    { name: 'rewardsLevel', wireKey: 'rwdlvl', optional: false, codec: bigIntCodec },
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

export const LedgerStateDeltaMeta: ObjectModelMetadata<LedgerStateDelta> = {
  name: 'LedgerStateDelta',
  kind: 'object',
  fields: [
    { name: 'accounts', wireKey: 'Accts', optional: false, codec: new ObjectModelCodec(LedgerAccountDeltasMeta) },
    { name: 'block', wireKey: 'Hdr', optional: false, codec: blockCodec },
    { name: 'stateProofNext', wireKey: 'StateProofNext', optional: false, codec: bigIntCodec },
    { name: 'prevTimestamp', wireKey: 'PrevTimestamp', optional: false, codec: bigIntCodec },
    { name: 'totals', wireKey: 'Totals', optional: false, codec: new ObjectModelCodec(LedgerAccountTotalsMeta) },
    {
      name: 'kvMods',
      wireKey: 'KvMods',
      optional: true,
      codec: new MapCodec(bytesCodec, new ObjectModelCodec(LedgerKvValueDeltaMeta)),
    },
    {
      name: 'txIds',
      wireKey: 'Txids',
      optional: true,
      codec: new MapCodec(bytesCodec, new ObjectModelCodec(LedgerIncludedTransactionsMeta)),
    },
    {
      name: 'creatables',
      wireKey: 'Creatables',
      optional: true,
      codec: new MapCodec(numberCodec, new ObjectModelCodec(LedgerModifiedCreatableMeta)),
    },
  ],
}
