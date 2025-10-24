import type { ModelMetadata } from '../core/model-runtime'
import type { Transaction } from './transaction'
import { TransactionMeta } from './transaction'

export type LookupTransaction = {
  transaction: Transaction

  /**
   * Round at which the results were computed.
   */
  currentRound: bigint
}

export const LookupTransactionMeta: ModelMetadata = {
  name: 'LookupTransaction',
  kind: 'object',
  fields: [
    {
      name: 'transaction',
      wireKey: 'transaction',
      optional: false,
      nullable: false,
      type: { kind: 'model', meta: () => TransactionMeta },
    },
    {
      name: 'currentRound',
      wireKey: 'current-round',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
