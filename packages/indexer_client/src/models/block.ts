import type { ModelMetadata } from '../core/model-runtime'
import type { BlockRewards } from './block-rewards'
import { BlockRewardsMeta } from './block-rewards'
import type { BlockUpgradeState } from './block-upgrade-state'
import { BlockUpgradeStateMeta } from './block-upgrade-state'
import type { BlockUpgradeVote } from './block-upgrade-vote'
import { BlockUpgradeVoteMeta } from './block-upgrade-vote'
import type { ParticipationUpdates } from './participation-updates'
import { ParticipationUpdatesMeta } from './participation-updates'
import type { StateProofTracking } from './state-proof-tracking'
import { StateProofTrackingMeta } from './state-proof-tracking'
import type { Transaction } from './transaction'
import { TransactionMeta } from './transaction'

/**
 * Block information.
 *
 * Definition:
 * data/bookkeeping/block.go : Block
 */
export type Block = {
  /**
   * the proposer of this block.
   */
  proposer?: string

  /**
   * the sum of all fees paid by transactions in this block.
   */
  feesCollected?: bigint

  /**
   * the potential bonus payout for this block.
   */
  bonus?: bigint

  /**
   * the actual amount transferred to the proposer from the fee sink.
   */
  proposerPayout?: bigint

  /**
   * \[gh\] hash to which this block belongs.
   */
  genesisHash: Uint8Array

  /**
   * \[gen\] ID to which this block belongs.
   */
  genesisId: string

  /**
   * \[prev\] Previous block hash.
   */
  previousBlockHash: Uint8Array

  /**
   * \[prev512\] Previous block hash, using SHA-512.
   */
  previousBlockHash512?: Uint8Array
  rewards?: BlockRewards

  /**
   * \[rnd\] Current round on which this block was appended to the chain.
   */
  round: bigint

  /**
   * \[seed\] Sortition seed.
   */
  seed: Uint8Array

  /**
   * Tracks the status of state proofs.
   */
  stateProofTracking?: StateProofTracking[]

  /**
   * \[ts\] Block creation timestamp in seconds since epoch
   */
  timestamp: bigint

  /**
   * \[txns\] list of transactions corresponding to a given round.
   */
  transactions?: Transaction[]

  /**
   * \[txn\] TransactionsRoot authenticates the set of transactions appearing in the block. More specifically, it's the root of a merkle tree whose leaves are the block's Txids, in lexicographic order. For the empty block, it's 0. Note that the TxnRoot does not authenticate the signatures on the transactions, only the transactions themselves. Two blocks with the same transactions but in a different order and with different signatures will have the same TxnRoot.
   */
  transactionsRoot: Uint8Array

  /**
   * \[txn256\] TransactionsRootSHA256 is an auxiliary TransactionRoot, built using a vector commitment instead of a merkle tree, and SHA256 hash function instead of the default SHA512_256. This commitment can be used on environments where only the SHA256 function exists.
   */
  transactionsRootSha256: Uint8Array

  /**
   * \[txn512\] TransactionsRootSHA512 is an auxiliary TransactionRoot, built using a vector commitment instead of a merkle tree, and SHA512 hash function instead of the default SHA512_256.
   */
  transactionsRootSha512?: Uint8Array

  /**
   * \[tc\] TxnCounter counts the number of transactions committed in the ledger, from the time at which support for this feature was introduced.
   *
   * Specifically, TxnCounter is the number of the next transaction that will be committed after this block.  It is 0 when no transactions have ever been committed (since TxnCounter started being supported).
   */
  txnCounter?: bigint
  upgradeState?: BlockUpgradeState
  upgradeVote?: BlockUpgradeVote
  participationUpdates?: ParticipationUpdates
}

export const BlockMeta: ModelMetadata = {
  name: 'Block',
  kind: 'object',
  fields: [
    {
      name: 'proposer',
      wireKey: 'proposer',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'feesCollected',
      wireKey: 'fees-collected',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'bonus',
      wireKey: 'bonus',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'proposerPayout',
      wireKey: 'proposer-payout',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'genesisHash',
      wireKey: 'genesis-hash',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'genesisId',
      wireKey: 'genesis-id',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'previousBlockHash',
      wireKey: 'previous-block-hash',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'previousBlockHash512',
      wireKey: 'previous-block-hash-512',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'rewards',
      wireKey: 'rewards',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => BlockRewardsMeta },
    },
    {
      name: 'round',
      wireKey: 'round',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'seed',
      wireKey: 'seed',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'stateProofTracking',
      wireKey: 'state-proof-tracking',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => StateProofTrackingMeta } },
    },
    {
      name: 'timestamp',
      wireKey: 'timestamp',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'transactions',
      wireKey: 'transactions',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => TransactionMeta } },
    },
    {
      name: 'transactionsRoot',
      wireKey: 'transactions-root',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'transactionsRootSha256',
      wireKey: 'transactions-root-sha256',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'transactionsRootSha512',
      wireKey: 'transactions-root-sha512',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'txnCounter',
      wireKey: 'txn-counter',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'upgradeState',
      wireKey: 'upgrade-state',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => BlockUpgradeStateMeta },
    },
    {
      name: 'upgradeVote',
      wireKey: 'upgrade-vote',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => BlockUpgradeVoteMeta },
    },
    {
      name: 'participationUpdates',
      wireKey: 'participation-updates',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => ParticipationUpdatesMeta },
    },
  ],
}
