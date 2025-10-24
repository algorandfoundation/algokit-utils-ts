import type { ModelMetadata } from '../core/model-runtime'
import type { HbProofFields } from './hb-proof-fields'
import { HbProofFieldsMeta } from './hb-proof-fields'

/**
 * Fields for a heartbeat transaction.
 *
 * Definition:
 * data/transactions/heartbeat.go : HeartbeatTxnFields
 */
export type TransactionHeartbeat = {
  /**
   * \[hbad\] HbAddress is the account this txn is proving onlineness for.
   */
  hbAddress: string
  hbProof: HbProofFields

  /**
   * \[hbsd\] HbSeed must be the block seed for the this transaction's firstValid block.
   */
  hbSeed: Uint8Array

  /**
   * \[hbvid\] HbVoteID must match the HbAddress account's current VoteID.
   */
  hbVoteId: Uint8Array

  /**
   * \[hbkd\] HbKeyDilution must match HbAddress account's current KeyDilution.
   */
  hbKeyDilution: bigint
}

export const TransactionHeartbeatMeta: ModelMetadata = {
  name: 'TransactionHeartbeat',
  kind: 'object',
  fields: [
    {
      name: 'hbAddress',
      wireKey: 'hb-address',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'hbProof',
      wireKey: 'hb-proof',
      optional: false,
      nullable: false,
      type: { kind: 'model', meta: () => HbProofFieldsMeta },
    },
    {
      name: 'hbSeed',
      wireKey: 'hb-seed',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'hbVoteId',
      wireKey: 'hb-vote-id',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'hbKeyDilution',
      wireKey: 'hb-key-dilution',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
  ],
}
