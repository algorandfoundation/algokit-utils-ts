import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { ObjectModelCodec } from '@algorandfoundation/algokit-common'
import type { WalletHandle } from './wallet-handle'
import { WalletHandleMeta } from './wallet-handle'

/**
 * WalletInfoResponse is the response to `POST /v1/wallet/info`
 */
export type WalletInfoResponse = {
  walletHandle: WalletHandle
}

export const WalletInfoResponseMeta: ObjectModelMetadata<WalletInfoResponse> = {
  name: 'WalletInfoResponse',
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
