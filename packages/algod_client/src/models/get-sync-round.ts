import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  bigIntCodec,
} from '@algorandfoundation/algokit-common'

export type GetSyncRound = {
  /**
   * The minimum sync round for the ledger.
   */
  round: bigint
}

export const GetSyncRoundMeta: ObjectModelMetadata = {
  name: 'GetSyncRound',
  kind: 'object',
  fields: [
    {
      name: 'round',
      wireKey: 'round',
      optional: false,
      codec: bigIntCodec,
    },
  ],
}
