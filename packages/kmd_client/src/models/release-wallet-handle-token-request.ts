import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTWalletReleaseRequest is the request for `POST /v1/wallet/release`
 */
export type ReleaseWalletHandleTokenRequest = {
  walletHandleToken?: string
}

export const ReleaseWalletHandleTokenRequestMeta: ObjectModelMetadata<ReleaseWalletHandleTokenRequest> = {
  name: 'ReleaseWalletHandleTokenRequest',
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
