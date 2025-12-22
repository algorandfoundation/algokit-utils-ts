import {
  Address,
  ArrayCodec,
  MapCodec,
  ObjectModelCodec,
  type EncodingFormat,
  type ObjectModelMetadata,
  type WireObject,
  addressArrayCodec,
  addressCodec,
  bigIntCodec,
  booleanCodec,
  bytesArrayCodec,
  bytesCodec,
  fixedBytes32Codec,
  fixedBytes64Codec,
  numberCodec,
  stringCodec,
} from '@algorandfoundation/algokit-common'
import { type SignedTransaction, SignedTransactionMeta } from '@algorandfoundation/algokit-transact'

/** BlockEvalDelta represents a TEAL value delta (block/msgpack wire keys). */
export type BlockEvalDelta = {
  /** [at] delta action. */
  action: number
  /** [bs] bytes value. */
  bytes?: Uint8Array
  /** [ui] uint value. */
  uint?: bigint
}

const BlockEvalDeltaMeta: ObjectModelMetadata<BlockEvalDelta> = {
  name: 'BlockEvalDelta',
  kind: 'object',
  fields: [
    { name: 'action', wireKey: 'at', optional: false, codec: numberCodec },
    { name: 'bytes', wireKey: 'bs', optional: true, codec: bytesCodec },
    { name: 'uint', wireKey: 'ui', optional: true, codec: bigIntCodec },
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
  innerTxns?: SignedTxnWithAD[]
  /** [sa] Shared accounts referenced by local deltas. */
  sharedAccounts?: Address[]
  /** [lg] Application log outputs. */
  logs?: Uint8Array[]
}

const BlockAppEvalDeltaMeta: ObjectModelMetadata<BlockAppEvalDelta> = {
  name: 'BlockAppEvalDelta',
  kind: 'object',
  fields: [
    {
      name: 'globalDelta',
      wireKey: 'gd',
      optional: true,
      codec: new MapCodec(bytesCodec, new ObjectModelCodec(BlockEvalDeltaMeta)),
    },
    {
      name: 'localDeltas',
      wireKey: 'ld',
      optional: true,
      codec: new MapCodec(numberCodec, new MapCodec(bytesCodec, new ObjectModelCodec(BlockEvalDeltaMeta))),
    },
    {
      name: 'innerTxns',
      wireKey: 'itx',
      optional: true,
      codec: new ArrayCodec(new ObjectModelCodec(() => SignedTxnWithADMeta)),
    },
    {
      name: 'sharedAccounts',
      wireKey: 'sa',
      optional: true,
      codec: addressArrayCodec,
    },
    { name: 'logs', wireKey: 'lg', optional: true, codec: bytesArrayCodec },
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

const BlockStateProofTrackingDataMeta: ObjectModelMetadata<BlockStateProofTrackingData> = {
  name: 'BlockStateProofTrackingData',
  kind: 'object',
  fields: [
    { name: 'stateProofVotersCommitment', wireKey: 'v', optional: true, codec: bytesCodec },
    { name: 'stateProofOnlineTotalWeight', wireKey: 't', optional: true, codec: bigIntCodec },
    { name: 'stateProofNextRound', wireKey: 'n', optional: true, codec: bigIntCodec },
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

const ApplyDataMeta: ObjectModelMetadata<ApplyData> = {
  name: 'SignedTxnInBlock',
  kind: 'object',
  fields: [
    { name: 'closingAmount', wireKey: 'ca', optional: true, codec: bigIntCodec },
    { name: 'assetClosingAmount', wireKey: 'aca', optional: true, codec: bigIntCodec },
    { name: 'senderRewards', wireKey: 'rs', optional: true, codec: bigIntCodec },
    { name: 'receiverRewards', wireKey: 'rr', optional: true, codec: bigIntCodec },
    { name: 'closeRewards', wireKey: 'rc', optional: true, codec: bigIntCodec },
    { name: 'evalDelta', wireKey: 'dt', optional: true, codec: new ObjectModelCodec(BlockAppEvalDeltaMeta) },
    { name: 'configAsset', wireKey: 'caid', optional: true, codec: bigIntCodec },
    { name: 'applicationId', wireKey: 'apid', optional: true, codec: bigIntCodec },
  ],
}

/**
 * SignedTxnWithAD is a SignedTransaction with additional ApplyData.
 */
export type SignedTxnWithAD = {
  /** The signed transaction. */
  signedTxn: SignedTransaction
  /** Apply data containing transaction execution information. */
  applyData?: ApplyData
}

const SignedTxnWithADMeta: ObjectModelMetadata<SignedTxnWithAD> = {
  name: 'SignedTxnWithAD',
  kind: 'object',
  fields: [
    {
      name: 'signedTxn',
      flattened: true,
      optional: false,
      codec: new ObjectModelCodec(SignedTransactionMeta),
    },
    {
      name: 'applyData',
      flattened: true,
      optional: true,
      codec: new ObjectModelCodec(ApplyDataMeta),
    },
  ],
}

/**
 * SignedTxnInBlock is a SignedTransaction with additional ApplyData and block-specific metadata.
 */
export type SignedTxnInBlock = {
  signedTxn: SignedTxnWithAD
  hasGenesisId?: boolean
  hasGenesisHash?: boolean
}

const SignedTxnInBlockMeta: ObjectModelMetadata<SignedTxnInBlock> = {
  name: 'SignedTxnInBlock',
  kind: 'object',
  fields: [
    {
      name: 'signedTxn',
      flattened: true,
      optional: false,
      codec: new ObjectModelCodec(SignedTxnWithADMeta),
    },
    { name: 'hasGenesisId', wireKey: 'hgi', optional: true, codec: booleanCodec },
    { name: 'hasGenesisHash', wireKey: 'hgh', optional: true, codec: booleanCodec },
  ],
}

export type ParticipationUpdates = {
  /** [partupdrmv] Expired participation accounts. */
  expiredParticipationAccounts: string[]
  /** [partupdabs] Absent participation accounts. */
  absentParticipationAccounts: string[]
}

const ParticipationUpdatesMeta: ObjectModelMetadata<ParticipationUpdates> = {
  name: 'ParticipationUpdates',
  kind: 'object',
  fields: [
    {
      name: 'expiredParticipationAccounts',
      wireKey: 'partupdrmv',
      optional: false,
      codec: addressArrayCodec,
    },
    {
      name: 'absentParticipationAccounts',
      wireKey: 'partupdabs',
      optional: false,
      codec: addressArrayCodec,
    },
  ],
}

/** Transaction commitment hashes for the block. */
export type TxnCommitments = {
  /** [txn] Root of transaction merkle tree using SHA512_256. */
  nativeSha512_256Commitment: Uint8Array
  /** [txn256] Root of transaction vector commitment using SHA256. */
  sha256Commitment?: Uint8Array
  /** [txn512] Root of transaction vector commitment using SHA512. */
  sha512Commitment?: Uint8Array
}

const TxnCommitmentsMeta: ObjectModelMetadata<TxnCommitments> = {
  name: 'TxnCommitments',
  kind: 'object',
  fields: [
    { name: 'nativeSha512_256Commitment', wireKey: 'txn', optional: false, codec: fixedBytes32Codec },
    { name: 'sha256Commitment', wireKey: 'txn256', optional: true, codec: fixedBytes32Codec },
    { name: 'sha512Commitment', wireKey: 'txn512', optional: true, codec: fixedBytes64Codec },
  ],
}

/** Reward distribution state for the block. */
export type RewardState = {
  /** [fees] FeeSink address. */
  feeSink: Address
  /** [rwd] RewardsPool address. */
  rewardsPool: Address
  /** [earn] Rewards level. */
  rewardsLevel: bigint
  /** [rate] Rewards rate. */
  rewardsRate: bigint
  /** [frac] Rewards residue. */
  rewardsResidue: bigint
  /** [rwcalr] Rewards recalculation round. */
  rewardsRecalculationRound: bigint
}

const RewardStateMeta: ObjectModelMetadata<RewardState> = {
  name: 'RewardState',
  kind: 'object',
  fields: [
    { name: 'feeSink', wireKey: 'fees', optional: false, codec: addressCodec },
    { name: 'rewardsPool', wireKey: 'rwd', optional: false, codec: addressCodec },
    { name: 'rewardsLevel', wireKey: 'earn', optional: false, codec: bigIntCodec },
    { name: 'rewardsRate', wireKey: 'rate', optional: false, codec: bigIntCodec },
    { name: 'rewardsResidue', wireKey: 'frac', optional: false, codec: bigIntCodec },
    { name: 'rewardsRecalculationRound', wireKey: 'rwcalr', optional: false, codec: bigIntCodec },
  ],
}

/** Protocol upgrade state for the block. */
export type UpgradeState = {
  /** [proto] Current consensus protocol. */
  currentProtocol: string
  /** [nextproto] Next proposed protocol. */
  nextProtocol?: string
  /** [nextyes] Next protocol approvals. */
  nextProtocolApprovals?: bigint
  /** [nextbefore] Next protocol vote deadline. */
  nextProtocolVoteBefore?: bigint
  /** [nextswitch] Next protocol switch round. */
  nextProtocolSwitchOn?: bigint
}

const UpgradeStateMeta: ObjectModelMetadata<UpgradeState> = {
  name: 'UpgradeState',
  kind: 'object',
  fields: [
    { name: 'currentProtocol', wireKey: 'proto', optional: false, codec: stringCodec },
    { name: 'nextProtocol', wireKey: 'nextproto', optional: true, codec: stringCodec },
    { name: 'nextProtocolApprovals', wireKey: 'nextyes', optional: true, codec: bigIntCodec },
    { name: 'nextProtocolVoteBefore', wireKey: 'nextbefore', optional: true, codec: bigIntCodec },
    { name: 'nextProtocolSwitchOn', wireKey: 'nextswitch', optional: true, codec: bigIntCodec },
  ],
}

/** Protocol upgrade vote parameters for the block. */
export type UpgradeVote = {
  /** [upgradeprop] Upgrade proposal. */
  upgradePropose?: string
  /** [upgradedelay] Upgrade delay in rounds. */
  upgradeDelay?: bigint
  /** [upgradeyes] Upgrade approval flag. */
  upgradeApprove?: boolean
}

const UpgradeVoteMeta: ObjectModelMetadata<UpgradeVote> = {
  name: 'UpgradeVote',
  kind: 'object',
  fields: [
    { name: 'upgradePropose', wireKey: 'upgradeprop', optional: true, codec: stringCodec },
    { name: 'upgradeDelay', wireKey: 'upgradedelay', optional: true, codec: bigIntCodec },
    { name: 'upgradeApprove', wireKey: 'upgradeyes', optional: true, codec: booleanCodec },
  ],
}

export type BlockHeader = {
  /** [rnd] Round number. */
  round: bigint
  /** [prev] Previous block hash. */
  previousBlockHash: Uint8Array
  /** [prev512] Previous block hash using SHA-512. */
  previousBlockHash512?: Uint8Array
  /** [seed] Sortition seed. */
  seed: Uint8Array
  /** Authenticates the set of transactions appearing in the block. */
  txnCommitments: TxnCommitments
  /** [ts] Block timestamp in seconds since epoch. */
  timestamp: bigint
  /** [gen] Genesis ID. */
  genesisId: string
  /** [gh] Genesis hash. */
  genesisHash: Uint8Array
  /** [prp] Proposer address. */
  proposer?: Address
  /** [fc] Fees collected in this block. */
  feesCollected?: bigint
  /** [bi] Bonus incentive for block proposal. */
  bonus?: bigint
  /** [pp] Proposer payout. */
  proposerPayout?: bigint
  /** Reward distribution state. */
  rewardState: RewardState
  /** Protocol upgrade state. */
  upgradeState: UpgradeState
  /** Protocol upgrade vote parameters. */
  upgradeVote: UpgradeVote
  /** [tc] Transaction counter. */
  txnCounter?: bigint
  /** [spt] State proof tracking data keyed by state proof type. */
  stateProofTracking?: Map<number, BlockStateProofTrackingData>
  /** Represents participation account data that needs to be checked/acted on by the network */
  participationUpdates: ParticipationUpdates
}

const BlockHeaderMeta: ObjectModelMetadata<BlockHeader> = {
  name: 'BlockHeader',
  kind: 'object',
  fields: [
    { name: 'round', wireKey: 'rnd', optional: false, codec: bigIntCodec },
    { name: 'previousBlockHash', wireKey: 'prev', optional: false, codec: fixedBytes32Codec },
    { name: 'previousBlockHash512', wireKey: 'prev512', optional: true, codec: fixedBytes64Codec },
    { name: 'seed', wireKey: 'seed', optional: false, codec: bytesCodec },
    {
      name: 'txnCommitments',
      flattened: true,
      optional: false,
      codec: new ObjectModelCodec(TxnCommitmentsMeta),
    },
    { name: 'timestamp', wireKey: 'ts', optional: false, codec: bigIntCodec },
    { name: 'genesisId', wireKey: 'gen', optional: false, codec: stringCodec },
    { name: 'genesisHash', wireKey: 'gh', optional: false, codec: fixedBytes32Codec },
    { name: 'proposer', wireKey: 'prp', optional: true, codec: addressCodec },
    { name: 'feesCollected', wireKey: 'fc', optional: true, codec: bigIntCodec },
    { name: 'bonus', wireKey: 'bi', optional: true, codec: bigIntCodec },
    { name: 'proposerPayout', wireKey: 'pp', optional: true, codec: bigIntCodec },
    {
      name: 'rewardState',
      flattened: true,
      optional: false,
      codec: new ObjectModelCodec(RewardStateMeta),
    },
    {
      name: 'upgradeState',
      flattened: true,
      optional: false,
      codec: new ObjectModelCodec(UpgradeStateMeta),
    },
    {
      name: 'upgradeVote',
      flattened: true,
      optional: true,
      codec: new ObjectModelCodec(UpgradeVoteMeta),
    },
    { name: 'txnCounter', wireKey: 'tc', optional: true, codec: bigIntCodec },
    {
      name: 'stateProofTracking',
      wireKey: 'spt',
      optional: true,
      codec: new MapCodec(numberCodec, new ObjectModelCodec(BlockStateProofTrackingDataMeta)),
    },
    {
      name: 'participationUpdates',
      flattened: true,
      optional: false,
      codec: new ObjectModelCodec(ParticipationUpdatesMeta),
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
  payset: SignedTxnInBlock[]
}

const BlockMeta: ObjectModelMetadata<Block> = {
  name: 'Block',
  kind: 'object',
  fields: [
    { name: 'header', flattened: true, optional: false, codec: new ObjectModelCodec(BlockHeaderMeta) },
    {
      name: 'payset',
      wireKey: 'txns',
      optional: false,
      codec: new ArrayCodec(new ObjectModelCodec(SignedTxnInBlockMeta)),
    },
  ],
}

/**
 * Custom codec for Block that populates genesis information on transactions after decoding.
 *
 * When blocks are returned from algod, transactions may not include the genesisId
 * and genesisHash fields even though they are required for correct transaction ID calculation.
 * The block contains `hasGenesisId` and `hasGenesisHash` flags that indicate whether these
 * fields should be populated from the block header.
 *
 * This codec automatically populates these fields after decoding to ensure transaction IDs
 * can be calculated correctly.
 */
class BlockCodec extends ObjectModelCodec<Block> {
  constructor() {
    super(BlockMeta)
  }

  protected fromEncoded(value: WireObject, format: EncodingFormat): Block {
    const block = super.fromEncoded(value, format)

    // Populate genesis id and hash on transactions if required to ensure tx id's are correct
    const genesisId = block.header.genesisId
    const genesisHash = block.header.genesisHash

    for (const txnInBlock of block.payset ?? []) {
      const txn = txnInBlock.signedTxn.signedTxn.txn

      if (txnInBlock.hasGenesisId && txn.genesisId === undefined) {
        txn.genesisId = genesisId
      }

      // The following assumes that Consensus.RequireGenesisHash is true
      // so assigns genesis hash unless explicitly set to false
      if (txnInBlock.hasGenesisHash !== false && txn.genesisHash === undefined) {
        txn.genesisHash = genesisHash
      }
    }

    return block
  }
}

export const blockCodec = new BlockCodec()
