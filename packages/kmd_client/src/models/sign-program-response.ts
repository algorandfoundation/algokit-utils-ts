import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * SignProgramResponse is the response to `POST /v1/data/sign`
 */
export type SignProgramResponse = {
  sig: Uint8Array
}

export const SignProgramResponseMeta: ObjectModelMetadata<SignProgramResponse> = {
  name: 'SignProgramResponse',
  kind: 'object',
  fields: [
    {
      name: 'sig',
      wireKey: 'sig',
      optional: false,
      codec: bytesCodec,
    },
  ],
}
