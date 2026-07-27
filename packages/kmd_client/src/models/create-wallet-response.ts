import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { ObjectModelCodec } from '@algorandfoundation/algokit-common'
import type { Wallet } from './wallet'
import { WalletMeta } from './wallet'

/**
 * CreateWalletResponse is the response to `POST /v1/wallet`
 */
export type CreateWalletResponse = {
  wallet: Wallet
}

export const CreateWalletResponseMeta: ObjectModelMetadata<CreateWalletResponse> = {
  name: 'CreateWalletResponse',
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
