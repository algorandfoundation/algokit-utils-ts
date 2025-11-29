import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTWalletInfoRequest is the request for `POST /v1/wallet/info`
 */
export type WalletInfoRequest = {
  walletHandleToken?: string
}

export const WalletInfoRequestMeta: ObjectModelMetadata<WalletInfoRequest> = {
  name: 'WalletInfoRequest',
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
