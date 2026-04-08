import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec } from '@algorandfoundation/algokit-common'

/**
 * The request for `POST /v1/wallet/renew`
 */
export type RenewWalletHandleTokenRequest = {
  walletHandleToken: string
}

export const RenewWalletHandleTokenRequestMeta: ObjectModelMetadata<RenewWalletHandleTokenRequest> = {
  name: 'RenewWalletHandleTokenRequest',
  kind: 'object',
  fields: [
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: false,
      codec: stringCodec,
    },
  ],
}
