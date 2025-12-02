import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTWalletInitRequest is the request for `POST /v1/wallet/init`
 */
export type InitWalletHandleTokenRequest = {
  walletId?: string
  walletPassword?: string
}

export const InitWalletHandleTokenRequestMeta: ObjectModelMetadata<InitWalletHandleTokenRequest> = {
  name: 'InitWalletHandleTokenRequest',
  kind: 'object',
  fields: [
    {
      name: 'walletId',
      wireKey: 'wallet_id',
      optional: true,
      codec: stringCodec,
    },
    {
      name: 'walletPassword',
      wireKey: 'wallet_password',
      optional: true,
      codec: stringCodec,
    },
  ],
}
