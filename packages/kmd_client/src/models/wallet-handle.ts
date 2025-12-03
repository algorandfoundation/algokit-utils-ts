import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { numberCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
import type { Wallet } from './wallet'
import { WalletMeta } from './wallet'

/**
 * WalletHandle includes the wallet the handle corresponds to
 * and the number of number of seconds to expiration
 */
export type WalletHandle = {
  expiresSeconds: number
  wallet: Wallet
}

export const WalletHandleMeta: ObjectModelMetadata<WalletHandle> = {
  name: 'WalletHandle',
  kind: 'object',
  fields: [
    {
      name: 'expiresSeconds',
      wireKey: 'expires_seconds',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'wallet',
      wireKey: 'wallet',
      optional: false,
      codec: new ObjectModelCodec(WalletMeta),
    },
  ],
}
