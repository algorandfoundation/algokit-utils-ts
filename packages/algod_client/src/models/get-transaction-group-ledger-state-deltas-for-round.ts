import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  ArrayCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { LedgerStateDeltaForTransactionGroup } from './ledger-state-delta-for-transaction-group'
import { LedgerStateDeltaForTransactionGroupMeta } from './ledger-state-delta-for-transaction-group'

export type GetTransactionGroupLedgerStateDeltasForRound = {
  deltas: LedgerStateDeltaForTransactionGroup[]
}

export const GetTransactionGroupLedgerStateDeltasForRoundMeta: ObjectModelMetadata<GetTransactionGroupLedgerStateDeltasForRound> = {
  name: 'GetTransactionGroupLedgerStateDeltasForRound',
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
