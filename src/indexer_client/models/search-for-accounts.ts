import type { ModelMetadata } from '../core/model-runtime'
import type { Account } from './account'
import { AccountMeta } from './account'

export type SearchForAccounts = {
  accounts: Account[]

  /**
   * Round at which the results were computed.
   */
  currentRound: bigint

  /**
   * Used for pagination, when making another request provide this token with the next parameter.
   */
  nextToken?: string
}

export const SearchForAccountsMeta: ModelMetadata = {
  name: 'SearchForAccounts',
  kind: 'object',
  fields: [
    {
      name: 'accounts',
      wireKey: 'accounts',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => AccountMeta } },
    },
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
  ],
}
