import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  bigIntCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { Account } from './account'
import { AccountMeta } from './account'

export type AccountResponse = {
  account: Account

  /**
   * Round at which the results were computed.
   */
  currentRound: bigint
}

export const AccountResponseMeta: ObjectModelMetadata<AccountResponse> = {
  name: 'AccountResponse',
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
