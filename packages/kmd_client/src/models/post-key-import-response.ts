import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  booleanCodec,
} from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTKeyImportResponse is the response to `POST /v1/key/import`
 * friendly:ImportKeyResponse
 */
export type PostKeyImportResponse = {
  address?: string
  error?: boolean
  message?: string
}

export const PostKeyImportResponseMeta: ObjectModelMetadata<PostKeyImportResponse> = {
  name: 'PostKeyImportResponse',
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
