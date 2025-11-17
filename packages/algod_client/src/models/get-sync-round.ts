import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

export type GetSyncRound = {
  /**
   * The minimum sync round for the ledger.
   */
  round: bigint
}

export const GetSyncRoundMeta: ModelMetadata = {
  name: 'GetSyncRound',
  kind: 'object',
  fields: [
    {
      name: 'round',
      wireKey: 'round',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
  ],
}
