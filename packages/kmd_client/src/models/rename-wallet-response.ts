import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { ObjectModelCodec } from '@algorandfoundation/algokit-common'
import type { Wallet } from './wallet'
import { WalletMeta } from './wallet'

/**
 * RenameWalletResponse is the response to `POST /v1/wallet/rename`
 */
export type RenameWalletResponse = {
  wallet: Wallet
}

export const RenameWalletResponseMeta: ObjectModelMetadata<RenameWalletResponse> = {
  name: 'RenameWalletResponse',
  kind: 'object',
  fields: [
    {
      name: 'wallet',
      wireKey: 'wallet',
      optional: false,
      codec: new ObjectModelCodec(WalletMeta),
    },
  ],
}
