import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  booleanCodec,
  bytesCodec,
} from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTMultisigTransactionSignResponse is the response to `POST /v1/multisig/sign`
 * friendly:SignMultisigResponse
 */
export type PostMultisigTransactionSignResponse = {
  error?: boolean
  message?: string
  multisig?: Uint8Array
}

export const PostMultisigTransactionSignResponseMeta: ObjectModelMetadata<PostMultisigTransactionSignResponse> = {
  name: 'PostMultisigTransactionSignResponse',
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
      name: 'multisig',
      wireKey: 'multisig',
      optional: true,
      codec: bytesCodec,
    },
  ],
}
