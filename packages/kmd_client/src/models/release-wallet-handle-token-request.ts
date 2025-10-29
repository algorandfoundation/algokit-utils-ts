import type { ModelMetadata } from '../core/model-runtime'

/**
 * APIV1POSTWalletReleaseRequest is the request for `POST /v1/wallet/release`
 */
export type ReleaseWalletHandleTokenRequest = {
  walletHandleToken?: string
}

export const ReleaseWalletHandleTokenRequestMeta: ModelMetadata = {
  name: 'ReleaseWalletHandleTokenRequest',
  kind: 'object',
  fields: [
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
