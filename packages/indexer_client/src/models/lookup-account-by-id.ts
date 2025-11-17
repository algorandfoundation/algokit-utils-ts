import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { Account } from './account'
import { AccountMeta } from './account'

export type LookupAccountById = {
  account: Account

  /**
   * Round at which the results were computed.
   */
  currentRound: bigint
}

export const LookupAccountByIdMeta: ModelMetadata = {
  name: 'LookupAccountById',
  kind: 'object',
  fields: [
    {
      name: 'account',
      wireKey: 'account',
      optional: false,
      nullable: false,
      codec: new ModelCodec(AccountMeta),
    },
    {
      name: 'currentRound',
      wireKey: 'current-round',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
  ],
}
