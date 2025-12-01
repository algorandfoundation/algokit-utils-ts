import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTKeyExportRequest is the request for `POST /v1/key/export`
 */
export type ExportKeyRequest = {
  address: string
  walletHandleToken: string
  walletPassword: string
}

export const ExportKeyRequestMeta: ObjectModelMetadata<ExportKeyRequest> = {
  name: 'ExportKeyRequest',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'walletPassword',
      wireKey: 'wallet_password',
      optional: false,
      codec: stringCodec,
    },
  ],
}
