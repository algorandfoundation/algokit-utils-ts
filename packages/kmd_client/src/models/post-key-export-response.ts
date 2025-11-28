import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  booleanCodec,
  bytesCodec,
} from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTKeyExportResponse is the response to `POST /v1/key/export`
 * friendly:ExportKeyResponse
 */
export type PostKeyExportResponse = {
  error?: boolean
  message?: string
  privateKey?: Uint8Array
}

export const PostKeyExportResponseMeta: ObjectModelMetadata<PostKeyExportResponse> = {
  name: 'PostKeyExportResponse',
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
      name: 'privateKey',
      wireKey: 'private_key',
      optional: true,
      codec: bytesCodec,
    },
  ],
}
