import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTMultisigProgramSignResponse is the response to `POST /v1/multisig/signdata`
 * friendly:SignProgramMultisigResponse
 */
export type PostMultisigProgramSignResponse = {
  error?: boolean
  message?: string
  multisig?: Uint8Array
}

export const PostMultisigProgramSignResponseMeta: ObjectModelMetadata<PostMultisigProgramSignResponse> = {
  name: 'PostMultisigProgramSignResponse',
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
