import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

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
      codec: stringCodec,
    },
    {
      name: 'walletPassword',
      wireKey: 'wallet_password',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
  ],
}
