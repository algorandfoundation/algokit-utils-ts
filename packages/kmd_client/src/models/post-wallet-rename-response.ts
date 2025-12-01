import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, booleanCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
import type { Wallet } from './wallet'
import { WalletMeta } from './wallet'

/**
 * APIV1POSTWalletRenameResponse is the response to `POST /v1/wallet/rename`
 * friendly:RenameWalletResponse
 */
export type PostWalletRenameResponse = {
  error?: boolean
  message?: string
  wallet?: Wallet
}

export const PostWalletRenameResponseMeta: ObjectModelMetadata<PostWalletRenameResponse> = {
  name: 'PostWalletRenameResponse',
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
      name: 'wallet',
      wireKey: 'wallet',
      optional: true,
      codec: new ObjectModelCodec(WalletMeta),
    },
  ],
}
