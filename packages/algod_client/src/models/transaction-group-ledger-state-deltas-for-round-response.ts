import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  ArrayCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { LedgerStateDeltaForTransactionGroup } from './ledger-state-delta-for-transaction-group'
import { LedgerStateDeltaForTransactionGroupMeta } from './ledger-state-delta-for-transaction-group'

export type TransactionGroupLedgerStateDeltasForRoundResponse = {
  deltas: LedgerStateDeltaForTransactionGroup[]
}

export const TransactionGroupLedgerStateDeltasForRoundResponseMeta: ObjectModelMetadata<TransactionGroupLedgerStateDeltasForRoundResponse> =
  {
    name: 'TransactionGroupLedgerStateDeltasForRoundResponse',
    kind: 'object',
    fields: [
      {
        name: 'deltas',
        wireKey: 'Deltas',
        optional: false,
        codec: new ArrayCodec(new ObjectModelCodec(LedgerStateDeltaForTransactionGroupMeta)),
      },
    ],
  }
