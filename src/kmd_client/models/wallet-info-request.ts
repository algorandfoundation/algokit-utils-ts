import type { ModelMetadata } from '../core/model-runtime'

/**
 * APIV1POSTWalletInfoRequest is the request for `POST /v1/wallet/info`
 */
export type WalletInfoRequest = {
  walletHandleToken?: string
}

export const WalletInfoRequestMeta: ModelMetadata = {
  name: 'WalletInfoRequest',
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
