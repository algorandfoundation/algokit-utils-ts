import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { ObjectModelCodec } from '@algorandfoundation/algokit-common'
import type { WalletHandle } from './wallet-handle'
import { WalletHandleMeta } from './wallet-handle'

/**
 * RenewWalletHandleTokenResponse is the response to `POST /v1/wallet/renew`
 */
export type RenewWalletHandleTokenResponse = {
  walletHandle: WalletHandle
}

export const RenewWalletHandleTokenResponseMeta: ObjectModelMetadata<RenewWalletHandleTokenResponse> = {
  name: 'RenewWalletHandleTokenResponse',
  kind: 'object',
  fields: [
    {
      name: 'walletHandle',
      wireKey: 'wallet_handle',
      optional: false,
      codec: new ObjectModelCodec(WalletHandleMeta),
    },
  ],
}
