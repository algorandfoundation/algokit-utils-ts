import type { ModelMetadata } from '../core/model-runtime'

/**
 * APIV1POSTKeyImportRequest is the request for `POST /v1/key/import`
 */
export type ImportKeyRequest = {
  privateKey?: Uint8Array
  walletHandleToken?: string
}

export const ImportKeyRequestMeta: ModelMetadata = {
  name: 'ImportKeyRequest',
  kind: 'object',
  fields: [
    {
      name: 'privateKey',
      wireKey: 'private_key',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
