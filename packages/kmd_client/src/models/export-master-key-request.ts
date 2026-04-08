import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec } from '@algorandfoundation/algokit-common'

/**
 * The request for `POST /v1/master-key/export`
 */
export type ExportMasterKeyRequest = {
  walletHandleToken: string
  walletPassword?: string
}

export const ExportMasterKeyRequestMeta: ObjectModelMetadata<ExportMasterKeyRequest> = {
  name: 'ExportMasterKeyRequest',
  kind: 'object',
  fields: [
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: false,
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
