import type { ModelMetadata } from '../core/model-runtime'

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
      type: { kind: 'scalar' },
    },
    {
      name: 'walletPassword',
      wireKey: 'wallet_password',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
