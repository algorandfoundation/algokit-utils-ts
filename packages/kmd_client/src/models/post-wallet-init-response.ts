import type { ModelMetadata } from '../core/model-runtime'

/**
 * APIV1POSTWalletInitResponse is the response to `POST /v1/wallet/init`
 * friendly:InitWalletHandleTokenResponse
 */
export type PostWalletInitResponse = {
  error?: boolean
  message?: string
  walletHandleToken?: string
}

export const PostWalletInitResponseMeta: ModelMetadata = {
  name: 'PostWalletInitResponse',
  kind: 'object',
  fields: [
    {
      name: 'error',
      wireKey: 'error',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'message',
      wireKey: 'message',
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
