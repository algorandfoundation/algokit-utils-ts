import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTKeyImportRequest is the request for `POST /v1/key/import`
 */
export type ImportKeyRequest = {
  privateKey: Uint8Array
  walletHandleToken: string
}

export const ImportKeyRequestMeta: ObjectModelMetadata<ImportKeyRequest> = {
  name: 'ImportKeyRequest',
  kind: 'object',
  fields: [
    {
      name: 'privateKey',
      wireKey: 'private_key',
      optional: false,
      codec: bytesCodec,
    },
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: false,
      codec: stringCodec,
    },
  ],
}
