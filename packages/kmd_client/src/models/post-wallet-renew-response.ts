import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  booleanCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { WalletHandle } from './wallet-handle'
import { WalletHandleMeta } from './wallet-handle'

/**
 * APIV1POSTWalletRenewResponse is the response to `POST /v1/wallet/renew`
 * friendly:RenewWalletHandleTokenResponse
 */
export type PostWalletRenewResponse = {
  error?: boolean
  message?: string
  walletHandle?: WalletHandle
}

export const PostWalletRenewResponseMeta: ObjectModelMetadata = {
  name: 'PostWalletRenewResponse',
  kind: 'object',
  fields: [
    {
      name: 'error',
      wireKey: 'error',
      optional: true,
      codec: booleanCodec,
    },
    {
      name: 'message',
      wireKey: 'message',
      optional: true,
      codec: stringCodec,
    },
    {
      name: 'walletHandle',
      wireKey: 'wallet_handle',
      optional: true,
      codec: new ObjectModelCodec(WalletHandleMeta),
    },
  ],
}
