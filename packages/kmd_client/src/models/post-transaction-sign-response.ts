import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTTransactionSignResponse is the response to `POST /v1/transaction/sign`
 * friendly:SignTransactionResponse
 */
export type PostTransactionSignResponse = {
  error?: boolean
  message?: string
  signedTransaction?: Uint8Array
}

export const PostTransactionSignResponseMeta: ObjectModelMetadata<PostTransactionSignResponse> = {
  name: 'PostTransactionSignResponse',
  kind: 'object',
  fields: [
    {
      name: 'error',
      wireKey: 'error',
      optional: true,
      codec: booleanCodec,
    },
    {
      name: 'message',
      wireKey: 'message',
      optional: true,
      codec: stringCodec,
    },
    {
      name: 'signedTransaction',
      wireKey: 'signed_transaction',
      optional: true,
      codec: bytesCodec,
    },
  ],
}
