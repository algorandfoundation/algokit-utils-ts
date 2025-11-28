import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  bigIntCodec,
  ArrayCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { Account } from './account'
import { AccountMeta } from './account'

export type AccountsResponse = {
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

export const AccountsResponseMeta: ObjectModelMetadata<AccountsResponse> = {
  name: 'AccountsResponse',
  kind: 'object',
  fields: [
    {
      name: 'accounts',
      wireKey: 'accounts',
      optional: false,
      codec: new ArrayCodec(new ObjectModelCodec(AccountMeta)),
    },
    {
      name: 'currentRound',
      wireKey: 'current-round',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'nextToken',
      wireKey: 'next-token',
      optional: true,
      codec: stringCodec,
    },
  ],
}
