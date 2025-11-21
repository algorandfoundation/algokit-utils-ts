import { type SignedTransaction, SignedTransactionMeta } from '@algorandfoundation/algokit-transact'
import type { ObjectModelMetadata } from '../core/model-runtime'
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

/** BlockEvalDelta represents a TEAL value delta (block/msgpack wire keys). */
export type BlockEvalDelta = {
  /** [at] delta action. */
  action: number
  /** [bs] bytes value. */
  bytes?: Uint8Array
  /** [ui] uint value. */
  uint?: bigint
}

export const BlockEvalDeltaMeta: ObjectModelMetadata = {
  name: 'BlockEvalDelta',
  kind: 'object',
  fields: [
    { name: 'action', wireKey: 'at', optional: false, nullable: false, codec: numberCodec },
    { name: 'bytes', wireKey: 'bs', optional: true, nullable: false, codec: bytesCodec },
    { name: 'uint', wireKey: 'ui', optional: true, nullable: false, codec: bigIntCodec },
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

export const BlockAppEvalDeltaMeta: ObjectModelMetadata = {
  name: 'BlockAppEvalDelta',
  kind: 'object',
  fields: [
    {
      name: 'globalDelta',
      wireKey: 'gd',
      optional: true,
      nullable: false,
      codec: new MapCodec(bytesCodec, new ModelCodec(BlockEvalDeltaMeta)),
    },
    {
      name: 'localDeltas',
      wireKey: 'ld',
      optional: true,
      nullable: false,
      codec: new MapCodec(numberWithNoDefaultCodec, new MapCodec(bytesCodec, new ModelCodec(BlockEvalDeltaMeta))),
    },
    {
      name: 'innerTxns',
      wireKey: 'itx',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(() => SignedTxnInBlockMeta)),
    },
    {
      name: 'sharedAccounts',
      wireKey: 'sa',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(addressCodec),
    },
    { name: 'logs', wireKey: 'lg', optional: true, nullable: false, codec: new ArrayCodec(bytesCodec) },
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

export const BlockStateProofTrackingDataMeta: ObjectModelMetadata = {
  name: 'BlockStateProofTrackingData',
  kind: 'object',
  fields: [
    { name: 'stateProofVotersCommitment', wireKey: 'v', optional: true, nullable: false, codec: bytesCodec },
    { name: 'stateProofOnlineTotalWeight', wireKey: 't', optional: true, nullable: false, codec: bigIntCodec },
    { name: 'stateProofNextRound', wireKey: 'n', optional: true, nullable: false, codec: bigIntCodec },
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

export const ApplyDataMeta: ObjectModelMetadata = {
  name: 'SignedTxnInBlock',
  kind: 'object',
  fields: [
    { name: 'closingAmount', wireKey: 'ca', optional: true, nullable: false, codec: bigIntCodec },
    { name: 'assetClosingAmount', wireKey: 'aca', optional: true, nullable: false, codec: bigIntCodec },
    { name: 'senderRewards', wireKey: 'rs', optional: true, nullable: false, codec: bigIntCodec },
    { name: 'receiverRewards', wireKey: 'rr', optional: true, nullable: false, codec: bigIntCodec },
    { name: 'closeRewards', wireKey: 'rc', optional: true, nullable: false, codec: bigIntCodec },
    { name: 'evalDelta', wireKey: 'dt', optional: true, nullable: false, codec: new ModelCodec(BlockAppEvalDeltaMeta) },
    { name: 'configAsset', wireKey: 'caid', optional: true, nullable: false, codec: bigIntCodec },
    { name: 'applicationId', wireKey: 'apid', optional: true, nullable: false, codec: bigIntCodec },
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

export const SignedTxnWithADMeta: ObjectModelMetadata = {
  name: 'SignedTxnWithAD',
  kind: 'object',
  fields: [
    {
      name: 'signedTransaction',
      flattened: true,
      optional: false,
      nullable: false,
      codec: new ModelCodec(SignedTransactionMeta),
    },
    {
      name: 'applyData',
      flattened: true,
      optional: true,
      nullable: false,
      codec: new ModelCodec(ApplyDataMeta),
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

export const SignedTxnInBlockMeta: ObjectModelMetadata = {
  name: 'SignedTxnInBlock',
  kind: 'object',
  fields: [
    {
      name: 'signedTransaction',
      flattened: true,
      optional: false,
      nullable: false,
      codec: new ModelCodec(SignedTxnWithADMeta),
    },
    { name: 'hasGenesisId', wireKey: 'hgi', optional: true, nullable: false, codec: booleanCodec },
    { name: 'hasGenesisHash', wireKey: 'hgh', optional: true, nullable: false, codec: booleanCodec },
  ],
}

export type ParticipationUpdates = {
  /** [partupdrmv] Expired participation accounts. */
  expiredParticipationAccounts?: string[]
  /** [partupdabs] Absent participation accounts. */
  absentParticipationAccounts?: string[]
}

export const ParticipationUpdatesMeta: ObjectModelMetadata = {
  name: 'ParticipationUpdates',
  kind: 'object',
  fields: [
    {
      name: 'expiredParticipationAccounts',
      wireKey: 'partupdrmv',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(addressCodec),
    },
    {
      name: 'absentParticipationAccounts',
      wireKey: 'partupdabs',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(addressCodec),
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

export const BlockHeaderMeta: ObjectModelMetadata = {
  name: 'BlockHeader',
  kind: 'object',
  fields: [
    { name: 'round', wireKey: 'rnd', optional: true, nullable: false, codec: bigIntCodec },
    { name: 'previousBlockHash', wireKey: 'prev', optional: true, nullable: false, codec: bytesCodec },
    { name: 'previousBlockHash512', wireKey: 'prev512', optional: true, nullable: false, codec: bytesCodec },
    { name: 'seed', wireKey: 'seed', optional: true, nullable: false, codec: bytesCodec },
    { name: 'transactionsRoot', wireKey: 'txn', optional: false, nullable: false, codec: bytesCodec },
    { name: 'transactionsRootSha256', wireKey: 'txn256', optional: true, nullable: false, codec: bytesCodec },
    { name: 'transactionsRootSha512', wireKey: 'txn512', optional: true, nullable: false, codec: bytesCodec },
    { name: 'timestamp', wireKey: 'ts', optional: true, nullable: false, codec: bigIntCodec },
    { name: 'genesisId', wireKey: 'gen', optional: true, nullable: false, codec: stringCodec },
    { name: 'genesisHash', wireKey: 'gh', optional: true, nullable: false, codec: bytesCodec },
    { name: 'proposer', wireKey: 'prp', optional: true, nullable: false, codec: addressCodec },
    { name: 'feesCollected', wireKey: 'fc', optional: true, nullable: false, codec: bigIntCodec },
    { name: 'bonus', wireKey: 'bi', optional: true, nullable: false, codec: bigIntCodec },
    { name: 'proposerPayout', wireKey: 'pp', optional: true, nullable: false, codec: bigIntCodec },
    { name: 'feeSink', wireKey: 'fees', optional: true, nullable: false, codec: addressCodec },
    { name: 'rewardsPool', wireKey: 'rwd', optional: true, nullable: false, codec: addressCodec },
    { name: 'rewardsLevel', wireKey: 'earn', optional: true, nullable: false, codec: bigIntCodec },
    { name: 'rewardsRate', wireKey: 'rate', optional: true, nullable: false, codec: bigIntCodec },
    { name: 'rewardsResidue', wireKey: 'frac', optional: true, nullable: false, codec: bigIntCodec },
    { name: 'rewardsRecalculationRound', wireKey: 'rwcalr', optional: true, nullable: false, codec: bigIntCodec },
    { name: 'currentProtocol', wireKey: 'proto', optional: true, nullable: false, codec: stringCodec },
    { name: 'nextProtocol', wireKey: 'nextproto', optional: true, nullable: false, codec: stringCodec },
    { name: 'nextProtocolApprovals', wireKey: 'nextyes', optional: true, nullable: false, codec: bigIntCodec },
    { name: 'nextProtocolVoteBefore', wireKey: 'nextbefore', optional: true, nullable: false, codec: bigIntCodec },
    { name: 'nextProtocolSwitchOn', wireKey: 'nextswitch', optional: true, nullable: false, codec: bigIntCodec },
    { name: 'upgradePropose', wireKey: 'upgradeprop', optional: true, nullable: false, codec: stringCodec },
    { name: 'upgradeDelay', wireKey: 'upgradedelay', optional: true, nullable: false, codec: bigIntCodec },
    { name: 'upgradeApprove', wireKey: 'upgradeyes', optional: true, nullable: false, codec: booleanCodec },
    { name: 'txnCounter', wireKey: 'tc', optional: true, nullable: false, codec: bigIntCodec },
    {
      name: 'stateProofTracking',
      wireKey: 'spt',
      optional: true,
      nullable: false,
      codec: new MapCodec(numberWithNoDefaultCodec, new ModelCodec(BlockStateProofTrackingDataMeta)),
    },
    {
      name: 'participationUpdates',
      flattened: true,
      optional: true,
      nullable: false,
      codec: new ModelCodec(ParticipationUpdatesMeta),
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

export const BlockMeta: ObjectModelMetadata = {
  name: 'Block',
  kind: 'object',
  fields: [
    { name: 'header', flattened: true, optional: false, nullable: false, codec: new ModelCodec(BlockHeaderMeta) },
    {
      name: 'payset',
      wireKey: 'txns',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(SignedTxnInBlockMeta)),
    },
  ],
}
