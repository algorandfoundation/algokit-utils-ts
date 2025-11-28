import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  bigIntCodec,
} from '@algorandfoundation/algokit-common'

export type GetSyncRoundResponse = {
  /**
   * The minimum sync round for the ledger.
   */
  round: bigint
}

export const GetSyncRoundResponseMeta: ObjectModelMetadata<GetSyncRoundResponse> = {
  name: 'GetSyncRoundResponse',
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
