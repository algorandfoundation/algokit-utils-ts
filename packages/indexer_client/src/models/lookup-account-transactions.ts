import type { ModelMetadata } from '../core/model-runtime'
import type { Transaction } from './transaction'
import { TransactionMeta } from './transaction'

export type LookupAccountTransactions = {
  /**
   * Round at which the results were computed.
   */
  currentRound: bigint

  /**
   * Used for pagination, when making another request provide this token with the next parameter.
   */
  nextToken?: string
  transactions: Transaction[]
}

export const LookupAccountTransactionsMeta: ModelMetadata = {
  name: 'LookupAccountTransactions',
  kind: 'object',
  fields: [
    {
      name: 'currentRound',
      wireKey: 'current-round',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'nextToken',
      wireKey: 'next-token',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'transactions',
      wireKey: 'transactions',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => TransactionMeta } },
    },
  ],
}
