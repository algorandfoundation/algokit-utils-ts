import type { ModelMetadata } from '../core/model-runtime'

/**
 * APIV1POSTKeyRequest is the request for `POST /v1/key`
 */
export type GenerateKeyRequest = {
  displayMnemonic?: boolean
  walletHandleToken?: string
}

export const GenerateKeyRequestMeta: ModelMetadata = {
  name: 'GenerateKeyRequest',
  kind: 'object',
  fields: [
    {
      name: 'displayMnemonic',
      wireKey: 'display_mnemonic',
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
  ],
}
