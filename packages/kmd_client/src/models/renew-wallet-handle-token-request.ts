import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
} from '@algorandfoundation/algokit-common'

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
      codec: stringCodec,
    },
  ],
}
