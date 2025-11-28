import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  bigIntCodec,
  bytesCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
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

export const TransactionHeartbeatMeta: ObjectModelMetadata<TransactionHeartbeat> = {
  name: 'TransactionHeartbeat',
  kind: 'object',
  fields: [
    {
      name: 'hbAddress',
      wireKey: 'hb-address',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'hbProof',
      wireKey: 'hb-proof',
      optional: false,
      codec: new ObjectModelCodec(HbProofFieldsMeta),
    },
    {
      name: 'hbSeed',
      wireKey: 'hb-seed',
      optional: false,
      codec: bytesCodec,
    },
    {
      name: 'hbVoteId',
      wireKey: 'hb-vote-id',
      optional: false,
      codec: bytesCodec,
    },
    {
      name: 'hbKeyDilution',
      wireKey: 'hb-key-dilution',
      optional: false,
      codec: bigIntCodec,
    },
  ],
}
