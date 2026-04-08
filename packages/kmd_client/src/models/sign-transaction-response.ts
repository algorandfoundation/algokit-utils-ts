import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * SignTransactionResponse is the response to `POST /v1/transaction/sign`
 */
export type SignTransactionResponse = {
  signedTransaction: Uint8Array
}

export const SignTransactionResponseMeta: ObjectModelMetadata<SignTransactionResponse> = {
  name: 'SignTransactionResponse',
  kind: 'object',
  fields: [
    {
      name: 'signedTransaction',
      wireKey: 'signed_transaction',
      optional: false,
      codec: bytesCodec,
    },
  ],
}
