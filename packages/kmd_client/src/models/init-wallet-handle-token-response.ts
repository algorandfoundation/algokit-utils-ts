import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec } from '@algorandfoundation/algokit-common'

/**
 * InitWalletHandleTokenResponse is the response to `POST /v1/wallet/init`
 */
export type InitWalletHandleTokenResponse = {
  walletHandleToken: string
}

export const InitWalletHandleTokenResponseMeta: ObjectModelMetadata<InitWalletHandleTokenResponse> = {
  name: 'InitWalletHandleTokenResponse',
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
