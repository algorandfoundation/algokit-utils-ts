import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  booleanCodec,
} from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTKeyResponse is the response to `POST /v1/key`
 * friendly:GenerateKeyResponse
 */
export type PostKeyResponse = {
  address?: string
  error?: boolean
  message?: string
}

export const PostKeyResponseMeta: ObjectModelMetadata<PostKeyResponse> = {
  name: 'PostKeyResponse',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: true,
      codec: stringCodec,
    },
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
  ],
}
