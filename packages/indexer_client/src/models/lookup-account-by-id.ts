import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  bigIntCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { Account } from './account'
import { AccountMeta } from './account'

export type LookupAccountById = {
  account: Account

  /**
   * Round at which the results were computed.
   */
  currentRound: bigint
}

export const LookupAccountByIdMeta: ObjectModelMetadata<LookupAccountById> = {
  name: 'LookupAccountById',
  kind: 'object',
  fields: [
    {
      name: 'account',
      wireKey: 'account',
      optional: false,
      codec: new ObjectModelCodec(AccountMeta),
    },
    {
      name: 'currentRound',
      wireKey: 'current-round',
      optional: false,
      codec: bigIntCodec,
    },
  ],
}
