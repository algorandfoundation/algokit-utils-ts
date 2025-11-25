import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  booleanCodec,
} from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTWalletInitResponse is the response to `POST /v1/wallet/init`
 * friendly:InitWalletHandleTokenResponse
 */
export type PostWalletInitResponse = {
  error?: boolean
  message?: string
  walletHandleToken?: string
}

export const PostWalletInitResponseMeta: ObjectModelMetadata = {
  name: 'PostWalletInitResponse',
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
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: true,
      codec: stringCodec,
    },
  ],
}
