import type { ModelMetadata } from '../core/model-runtime'
import type { SignedTxnInBlock } from './signed-txn-in-block'
import { SignedTxnInBlockMeta } from './signed-txn-in-block'
import type { BlockStateProofTrackingData } from './block_state_proof_tracking_data'
import { BlockStateProofTrackingDataMeta } from './block_state_proof_tracking_data'

/**
 * Block contains the BlockHeader and the list of transactions (Payset).
 */
export type Block = {
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
  /** [partupdrmv] Expired participation accounts. */
  expiredParticipationAccounts?: Uint8Array[]
  /** [partupdabs] Absent participation accounts. */
  absentParticipationAccounts?: Uint8Array[]
  /** [txns] Block transactions (Payset). */
  transactions?: SignedTxnInBlock[]
}

export const BlockMeta: ModelMetadata = {
  name: 'Block',
  kind: 'object',
  fields: [
    { name: 'round', wireKey: 'rnd', optional: true, nullable: false, type: { kind: 'scalar', isBigint: true } },
    { name: 'previousBlockHash', wireKey: 'prev', optional: true, nullable: false, type: { kind: 'scalar', isBytes: true } },
    { name: 'previousBlockHash512', wireKey: 'prev512', optional: true, nullable: false, type: { kind: 'scalar', isBytes: true } },
    { name: 'seed', wireKey: 'seed', optional: true, nullable: false, type: { kind: 'scalar', isBytes: true } },
    { name: 'transactionsRoot', wireKey: 'txn', optional: true, nullable: false, type: { kind: 'scalar', isBytes: true } },
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
      name: 'expiredParticipationAccounts',
      wireKey: 'partupdrmv',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar', isBytes: true } },
    },
    {
      name: 'absentParticipationAccounts',
      wireKey: 'partupdabs',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar', isBytes: true } },
    },
    {
      name: 'transactions',
      wireKey: 'txns',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: SignedTxnInBlockMeta } },
    },
  ],
}
