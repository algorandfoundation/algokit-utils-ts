import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTTransactionSignResponse is the response to `POST /v1/transaction/sign`
 * friendly:SignTransactionResponse
 */
export type PostTransactionSignResponse = {
  error?: boolean
  message?: string
  signedTransaction?: Uint8Array
}

export const PostTransactionSignResponseMeta: ModelMetadata = {
  name: 'PostTransactionSignResponse',
  kind: 'object',
  fields: [
    {
      name: 'error',
      wireKey: 'error',
      optional: true,
      nullable: false,
      codec: booleanCodec,
    },
    {
      name: 'message',
      wireKey: 'message',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'signedTransaction',
      wireKey: 'signed_transaction',
      optional: true,
      nullable: false,
      codec: bytesCodec,
    },
  ],
}
