import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * SignProgramMultisigResponse is the response to `POST /v1/multisig/signdata`
 */
export type SignProgramMultisigResponse = {
  multisig: Uint8Array
}

export const SignProgramMultisigResponseMeta: ObjectModelMetadata<SignProgramMultisigResponse> = {
  name: 'SignProgramMultisigResponse',
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
