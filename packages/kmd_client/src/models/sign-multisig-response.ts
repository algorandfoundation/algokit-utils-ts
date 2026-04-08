import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * SignMultisigResponse is the response to `POST /v1/multisig/sign`
 */
export type SignMultisigResponse = {
  multisig: Uint8Array
}

export const SignMultisigResponseMeta: ObjectModelMetadata<SignMultisigResponse> = {
  name: 'SignMultisigResponse',
  kind: 'object',
  fields: [
    {
      name: 'multisig',
      wireKey: 'multisig',
      optional: false,
      codec: bytesCodec,
    },
  ],
}
