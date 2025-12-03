import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * ExportKeyResponse is the response to `POST /v1/key/export`
 */
export type ExportKeyResponse = {
  privateKey: Uint8Array
}

export const ExportKeyResponseMeta: ObjectModelMetadata<ExportKeyResponse> = {
  name: 'ExportKeyResponse',
  kind: 'object',
  fields: [
    {
      name: 'privateKey',
      wireKey: 'private_key',
      optional: false,
      codec: bytesCodec,
    },
  ],
}
