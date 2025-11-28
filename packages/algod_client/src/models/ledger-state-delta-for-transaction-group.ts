import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringArrayCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { LedgerStateDelta } from './ledger-state-delta'
import { LedgerStateDeltaMeta } from './ledger-state-delta'

/**
 * Contains a ledger delta for a single transaction group
 */
export type LedgerStateDeltaForTransactionGroup = {
  delta: LedgerStateDelta
  ids: string[]
}

export const LedgerStateDeltaForTransactionGroupMeta: ObjectModelMetadata<LedgerStateDeltaForTransactionGroup> = {
  name: 'LedgerStateDeltaForTransactionGroup',
  kind: 'object',
  fields: [
    {
      name: 'delta',
      wireKey: 'Delta',
      optional: false,
      codec: new ObjectModelCodec(LedgerStateDeltaMeta),
    },
    {
      name: 'ids',
      wireKey: 'Ids',
      optional: false,
      codec: stringArrayCodec,
    },
  ],
}
