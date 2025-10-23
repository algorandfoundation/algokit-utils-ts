import type { ModelMetadata } from '../core/model-runtime'

/**
 * APIV1POSTWalletRenewRequest is the request for `POST /v1/wallet/renew`
 */
export type RenewWalletHandleTokenRequest = {
  walletHandleToken?: string
}

export const RenewWalletHandleTokenRequestMeta: ModelMetadata = {
  name: 'RenewWalletHandleTokenRequest',
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
