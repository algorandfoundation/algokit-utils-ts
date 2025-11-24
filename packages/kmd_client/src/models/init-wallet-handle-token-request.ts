import type { ModelMetadata } from '../core/model-runtime'

/**
 * APIV1POSTWalletInitRequest is the request for `POST /v1/wallet/init`
 */
export type InitWalletHandleTokenRequest = {
  walletId?: string
  walletPassword?: string
}

export const InitWalletHandleTokenRequestMeta: ModelMetadata = {
  name: 'InitWalletHandleTokenRequest',
  kind: 'object',
  fields: [
    {
      name: 'walletId',
      wireKey: 'wallet_id',
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
