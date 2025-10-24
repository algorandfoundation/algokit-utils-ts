import type { ModelMetadata } from '../core/model-runtime'

/**
 * APIV1POSTKeyExportRequest is the request for `POST /v1/key/export`
 */
export type ExportKeyRequest = {
  address?: string
  walletHandleToken?: string
  walletPassword?: string
}

export const ExportKeyRequestMeta: ModelMetadata = {
  name: 'ExportKeyRequest',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
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
