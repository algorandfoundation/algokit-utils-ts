import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * ExportMasterKeyResponse is the response to `POST /v1/master-key/export`
 */
export type ExportMasterKeyResponse = {
  masterDerivationKey: Uint8Array
}

export const ExportMasterKeyResponseMeta: ObjectModelMetadata<ExportMasterKeyResponse> = {
  name: 'ExportMasterKeyResponse',
  kind: 'object',
  fields: [
    {
      name: 'masterDerivationKey',
      wireKey: 'master_derivation_key',
      optional: false,
      codec: bytesCodec,
    },
  ],
}
