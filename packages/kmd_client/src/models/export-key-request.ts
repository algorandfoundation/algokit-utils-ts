import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
} from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTKeyExportRequest is the request for `POST /v1/key/export`
 */
export type ExportKeyRequest = {
  address?: string
  walletHandleToken?: string
  walletPassword?: string
}

export const ExportKeyRequestMeta: ObjectModelMetadata = {
  name: 'ExportKeyRequest',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: true,
      codec: stringCodec,
    },
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: true,
      codec: stringCodec,
    },
    {
      name: 'walletPassword',
      wireKey: 'wallet_password',
      optional: true,
      codec: stringCodec,
    },
  ],
}
