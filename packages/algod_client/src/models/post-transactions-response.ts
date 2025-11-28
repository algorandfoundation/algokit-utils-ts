import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
} from '@algorandfoundation/algokit-common'

export type PostTransactionsResponse = {
  /**
   * encoding of the transaction hash.
   */
  txId: string
}

export const PostTransactionsResponseMeta: ObjectModelMetadata<PostTransactionsResponse> = {
  name: 'PostTransactionsResponse',
  kind: 'object',
  fields: [
    {
      name: 'txId',
      wireKey: 'txId',
      optional: false,
      codec: stringCodec,
    },
  ],
}
