import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTKeyExportResponse is the response to `POST /v1/key/export`
 * friendly:ExportKeyResponse
 */
export type PostKeyExportResponse = {
  error?: boolean
  message?: string
  privateKey?: Uint8Array
}

export const PostKeyExportResponseMeta: ObjectModelMetadata = {
  name: 'PostKeyExportResponse',
  kind: 'object',
  fields: [
    {
      name: 'error',
      wireKey: 'error',
      optional: true,
      nullable: false,
      codec: booleanCodec,
    },
    {
      name: 'message',
      wireKey: 'message',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'privateKey',
      wireKey: 'private_key',
      optional: true,
      nullable: false,
      codec: bytesCodec,
    },
  ],
}
