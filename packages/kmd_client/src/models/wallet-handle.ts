import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { Wallet } from './wallet'
import { WalletMeta } from './wallet'

/**
 * APIV1WalletHandle includes the wallet the handle corresponds to
 * and the number of number of seconds to expiration
 */
export type WalletHandle = {
  expiresSeconds?: number
  wallet?: Wallet
}

export const WalletHandleMeta: ObjectModelMetadata = {
  name: 'WalletHandle',
  kind: 'object',
  fields: [
    {
      name: 'expiresSeconds',
      wireKey: 'expires_seconds',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'wallet',
      wireKey: 'wallet',
      optional: true,
      nullable: false,
      codec: new ModelCodec(WalletMeta),
    },
  ],
}
