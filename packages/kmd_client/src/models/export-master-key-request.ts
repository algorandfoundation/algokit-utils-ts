import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTMasterKeyExportRequest is the request for `POST /v1/master-key/export`
 */
export type ExportMasterKeyRequest = {
  walletHandleToken?: string
  walletPassword?: string
}

export const ExportMasterKeyRequestMeta: ModelMetadata = {
  name: 'ExportMasterKeyRequest',
  kind: 'object',
  fields: [
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'walletPassword',
      wireKey: 'wallet_password',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
  ],
}
