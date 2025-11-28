import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  booleanCodec,
  bytesCodec,
} from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTProgramSignResponse is the response to `POST /v1/data/sign`
 * friendly:SignProgramResponse
 */
export type PostProgramSignResponse = {
  error?: boolean
  message?: string
  sig?: Uint8Array
}

export const PostProgramSignResponseMeta: ObjectModelMetadata<PostProgramSignResponse> = {
  name: 'PostProgramSignResponse',
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
      name: 'sig',
      wireKey: 'sig',
      optional: true,
      codec: bytesCodec,
    },
  ],
}
