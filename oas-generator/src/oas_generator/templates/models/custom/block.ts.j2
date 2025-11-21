import { SignedTransaction } from '@algorandfoundation/algokit-transact'
import type { ModelMetadata } from '../core/model-runtime'

/** BlockEvalDelta represents a TEAL value delta (block/msgpack wire keys). */
export type BlockEvalDelta = {
  /** [at] delta action. */
  action: number
  /** [bs] bytes value. */
  bytes?: string
  /** [ui] uint value. */
  uint?: bigint
}

export const BlockEvalDeltaMeta: ModelMetadata = {
  name: 'BlockEvalDelta',
  kind: 'object',
  fields: [
    { name: 'action', wireKey: 'at', optional: false, nullable: false, type: { kind: 'scalar' } },
    { name: 'bytes', wireKey: 'bs', optional: true, nullable: false, type: { kind: 'scalar' } },
    { name: 'uint', wireKey: 'ui', optional: true, nullable: false, type: { kind: 'scalar', isBigint: true } },
  ],
}

/**
 * State changes from application execution, including inner transactions and logs.
 */
export type BlockAppEvalDelta = {
  /** [gd] Global state delta for the application. */
  globalDelta?: Map<Uint8Array, BlockEvalDelta>
  /** [ld] Local state deltas keyed by address index. */
  localDeltas?: Map<number, Map<Uint8Array, BlockEvalDelta>>
  /** [itx] Inner transactions produced by this application execution. */
  innerTxns?: SignedTxnInBlock[]
  /** [sa] Shared accounts referenced by local deltas. */
  sharedAccounts?: string[]
  /** [lg] Application log outputs. */
  logs?: Uint8Array[]
}

export const BlockAppEvalDeltaMeta: ModelMetadata = {
  name: 'BlockAppEvalDelta',
  kind: 'object',
  fields: [
    {
      name: 'globalDelta',
      wireKey: 'gd',
      optional: true,
      nullable: false,
      type: { kind: 'map', keyType: 'bytes', value: { kind: 'model', meta: BlockEvalDeltaMeta } },
    },
    {
      name: 'localDeltas',
      wireKey: 'ld',
      optional: true,
      nullable: false,
      type: {
        kind: 'map',
        keyType: 'number',
        value: { kind: 'map', keyType: 'bytes', value: { kind: 'model', meta: BlockEvalDeltaMeta } },
      },
    },
    {
      name: 'innerTxns',
      wireKey: 'itx',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => SignedTxnInBlockMeta } },
    },
    {
      name: 'sharedAccounts',
      wireKey: 'sa',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar', isAddress: true } },
    },
    { name: 'logs', wireKey: 'lg', optional: true, nullable: false, type: { kind: 'array', item: { kind: 'scalar', isBytes: true } } },
  ],
}

/** Tracking metadata for a specific StateProofType. */
export type BlockStateProofTrackingData = {
  /** [v] Vector commitment root of state proof voters. */
  stateProofVotersCommitment?: Uint8Array
  /** [t] Online total weight during state proof round. */
  stateProofOnlineTotalWeight?: bigint
  /** [n] Next round for which state proofs are accepted. */
  stateProofNextRound?: bigint
}

export const BlockStateProofTrackingDataMeta: ModelMetadata = {
  name: 'BlockStateProofTrackingData',
  kind: 'object',
  fields: [
    { name: 'stateProofVotersCommitment', wireKey: 'v', optional: true, nullable: false, type: { kind: 'scalar', isBytes: true } },
    { name: 'stateProofOnlineTotalWeight', wireKey: 't', optional: true, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'stateProofNextRound', wireKey: 'n', optional: true, nullable: false, type: { kind: 'scalar', isBigint: true } },
  ],
}

export type ApplyData = {
  closingAmount?: bigint
  assetClosingAmount?: bigint
  senderRewards?: bigint
  receiverRewards?: bigint
  closeRewards?: bigint
  evalDelta?: BlockAppEvalDelta
  configAsset?: bigint
  applicationId?: bigint
}

export const ApplyDataMeta: ModelMetadata = {
  name: 'SignedTxnInBlock',
  kind: 'object',
  fields: [
    { name: 'closingAmount', wireKey: 'ca', optional: true, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'assetClosingAmount', wireKey: 'aca', optional: true, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'senderRewards', wireKey: 'rs', optional: true, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'receiverRewards', wireKey: 'rr', optional: true, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'closeRewards', wireKey: 'rc', optional: true, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'evalDelta', wireKey: 'dt', optional: true, nullable: false, type: { kind: 'model', meta: BlockAppEvalDeltaMeta } },
    { name: 'configAsset', wireKey: 'caid', optional: true, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'applicationId', wireKey: 'apid', optional: true, nullable: false, type: { kind: 'scalar', isBigint: true } },
  ],
}

/**
 * SignedTxnWithAD is a SignedTransaction with additional ApplyData.
 */
export type SignedTxnWithAD = {
  /** The signed transaction. */
  signedTxn: SignedTransaction
  /** Apply data containing transaction execution information. */
  applyData: ApplyData
}

export const SignedTxnWithADMeta: ModelMetadata = {
  name: 'SignedTxnWithAD',
  kind: 'object',
  fields: [
    {
      name: 'signedTransaction',
      flattened: true,
      optional: false,
      nullable: false,
      type: { kind: 'codec', codecKey: 'SignedTransaction' },
    },
    {
      name: 'applyData',
      flattened: true,
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: ApplyDataMeta },
    },
  ],
}

/**
 * SignedTxnInBlock is a SignedTransaction with additional ApplyData and block-specific metadata.
 */
export type SignedTxnInBlock = {
  signedTransaction: SignedTxnWithAD
  hasGenesisId?: boolean
  hasGenesisHash?: boolean
}

export const SignedTxnInBlockMeta: ModelMetadata = {
  name: 'SignedTxnInBlock',
  kind: 'object',
  fields: [
    {
      name: 'signedTransaction',
      flattened: true,
      optional: false,
      nullable: false,
      type: { kind: 'model', meta: SignedTxnWithADMeta },
    },
    { name: 'hasGenesisId', wireKey: 'hgi', optional: true, nullable: false, type: { kind: 'scalar' } },
    { name: 'hasGenesisHash', wireKey: 'hgh', optional: true, nullable: false, type: { kind: 'scalar' } },
  ],
}

export type ParticipationUpdates = {
  /** [partupdrmv] Expired participation accounts. */
  expiredParticipationAccounts?: string[]
  /** [partupdabs] Absent participation accounts. */
  absentParticipationAccounts?: string[]
}

export const ParticipationUpdatesMeta: ModelMetadata = {
  name: 'ParticipationUpdates',
  kind: 'object',
  fields: [
    {
      name: 'expiredParticipationAccounts',
      wireKey: 'partupdrmv',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar', isAddress: true } },
    },
    {
      name: 'absentParticipationAccounts',
      wireKey: 'partupdabs',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar', isAddress: true } },
    },
  ],
}

export type BlockHeader = {
  /** [rnd] Round number. */
  round?: bigint
  /** [prev] Previous block hash. */
  previousBlockHash?: Uint8Array
  /** [prev512] Previous block hash using SHA-512. */
  previousBlockHash512?: Uint8Array
  /** [seed] Sortition seed. */
  seed?: Uint8Array
  /** [txn] Root of transaction merkle tree using SHA512_256. */
  transactionsRoot?: Uint8Array
  /** [txn256] Root of transaction vector commitment using SHA256. */
  transactionsRootSha256?: Uint8Array
  /** [txn512] Root of transaction vector commitment using SHA512. */
  transactionsRootSha512?: Uint8Array
  /** [ts] Block timestamp in seconds since epoch. */
  timestamp?: bigint
  /** [gen] Genesis ID. */
  genesisId?: string
  /** [gh] Genesis hash. */
  genesisHash?: Uint8Array
  /** [prp] Proposer address. */
  proposer?: string
  /** [fc] Fees collected in this block. */
  feesCollected?: bigint
  /** [bi] Bonus incentive for block proposal. */
  bonus?: bigint
  /** [pp] Proposer payout. */
  proposerPayout?: bigint
  /** [fees] FeeSink address. */
  feeSink?: string
  /** [rwd] RewardsPool address. */
  rewardsPool?: string
  /** [earn] Rewards level. */
  rewardsLevel?: bigint
  /** [rate] Rewards rate. */
  rewardsRate?: bigint
  /** [frac] Rewards residue. */
  rewardsResidue?: bigint
  /** [rwcalr] Rewards recalculation round. */
  rewardsRecalculationRound?: bigint
  /** [proto] Current consensus protocol. */
  currentProtocol?: string
  /** [nextproto] Next proposed protocol. */
  nextProtocol?: string
  /** [nextyes] Next protocol approvals. */
  nextProtocolApprovals?: bigint
  /** [nextbefore] Next protocol vote deadline. */
  nextProtocolVoteBefore?: bigint
  /** [nextswitch] Next protocol switch round. */
  nextProtocolSwitchOn?: bigint
  /** [upgradeprop] Upgrade proposal. */
  upgradePropose?: string
  /** [upgradedelay] Upgrade delay in rounds. */
  upgradeDelay?: bigint
  /** [upgradeyes] Upgrade approval flag. */
  upgradeApprove?: boolean
  /** [tc] Transaction counter. */
  txnCounter?: bigint
  /** [spt] State proof tracking data keyed by state proof type. */
  stateProofTracking?: Map<number, BlockStateProofTrackingData>
  /** Represents participation account data that needs to be checked/acted on by the network */
  participationUpdates?: ParticipationUpdates
}

export const BlockHeaderMeta: ModelMetadata = {
  name: 'BlockHeader',
  kind: 'object',
  fields: [
    { name: 'round', wireKey: 'rnd', optional: true, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'previousBlockHash', wireKey: 'prev', optional: true, nullable: false, type: { kind: 'scalar', isBytes: true } },
    { name: 'previousBlockHash512', wireKey: 'prev512', optional: true, nullable: false, type: { kind: 'scalar', isBytes: true } },
    { name: 'seed', wireKey: 'seed', optional: true, nullable: false, type: { kind: 'scalar', isBytes: true } },
    { name: 'transactionsRoot', wireKey: 'txn', optional: false, nullable: false, type: { kind: 'scalar', isBytes: true } },
    { name: 'transactionsRootSha256', wireKey: 'txn256', optional: true, nullable: false, type: { kind: 'scalar', isBytes: true } },
    { name: 'transactionsRootSha512', wireKey: 'txn512', optional: true, nullable: false, type: { kind: 'scalar', isBytes: true } },
    { name: 'timestamp', wireKey: 'ts', optional: true, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'genesisId', wireKey: 'gen', optional: true, nullable: false, type: { kind: 'scalar' } },
    { name: 'genesisHash', wireKey: 'gh', optional: true, nullable: false, type: { kind: 'scalar', isBytes: true } },
    { name: 'proposer', wireKey: 'prp', optional: true, nullable: false, type: { kind: 'scalar', isAddress: true } },
    { name: 'feesCollected', wireKey: 'fc', optional: true, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'bonus', wireKey: 'bi', optional: true, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'proposerPayout', wireKey: 'pp', optional: true, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'feeSink', wireKey: 'fees', optional: true, nullable: false, type: { kind: 'scalar', isAddress: true } },
    { name: 'rewardsPool', wireKey: 'rwd', optional: true, nullable: false, type: { kind: 'scalar', isAddress: true } },
    { name: 'rewardsLevel', wireKey: 'earn', optional: true, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'rewardsRate', wireKey: 'rate', optional: true, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'rewardsResidue', wireKey: 'frac', optional: true, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'rewardsRecalculationRound', wireKey: 'rwcalr', optional: true, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'currentProtocol', wireKey: 'proto', optional: true, nullable: false, type: { kind: 'scalar' } },
    { name: 'nextProtocol', wireKey: 'nextproto', optional: true, nullable: false, type: { kind: 'scalar' } },
    { name: 'nextProtocolApprovals', wireKey: 'nextyes', optional: true, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'nextProtocolVoteBefore', wireKey: 'nextbefore', optional: true, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'nextProtocolSwitchOn', wireKey: 'nextswitch', optional: true, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'upgradePropose', wireKey: 'upgradeprop', optional: true, nullable: false, type: { kind: 'scalar' } },
    { name: 'upgradeDelay', wireKey: 'upgradedelay', optional: true, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'upgradeApprove', wireKey: 'upgradeyes', optional: true, nullable: false, type: { kind: 'scalar' } },
    { name: 'txnCounter', wireKey: 'tc', optional: true, nullable: false, type: { kind: 'scalar', isBigint: true } },
    {
      name: 'stateProofTracking',
      wireKey: 'spt',
      optional: true,
      nullable: false,
      type: { kind: 'map', keyType: 'number', value: { kind: 'model', meta: BlockStateProofTrackingDataMeta } },
    },
    {
      name: 'participationUpdates',
      flattened: true,
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: ParticipationUpdatesMeta },
    },
  ],
}

/**
 * Block contains the BlockHeader and the list of transactions (Payset).
 */
export type Block = {
  /** The block information (Header) */
  header: BlockHeader

  /** [txns] Block transactions (Payset). */
  payset?: SignedTxnInBlock[]
}

export const BlockMeta: ModelMetadata = {
  name: 'Block',
  kind: 'object',
  fields: [
    { name: 'header', flattened: true, optional: false, nullable: false, type: { kind: 'model', meta: BlockHeaderMeta } },
    {
      name: 'payset',
      wireKey: 'txns',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: SignedTxnInBlockMeta } },
    },
  ],
}
