import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTWalletRenewRequest is the request for `POST /v1/wallet/renew`
 */
export type RenewWalletHandleTokenRequest = {
  walletHandleToken?: string
}

export const RenewWalletHandleTokenRequestMeta: ObjectModelMetadata = {
  name: 'RenewWalletHandleTokenRequest',
  kind: 'object',
  fields: [
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
  ],
}
