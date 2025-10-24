import type { ModelMetadata } from '../core/model-runtime'
import type { Wallet } from './wallet'
import { WalletMeta } from './wallet'

/**
 * APIV1WalletHandle includes the wallet the handle corresponds to
 * and the number of number of seconds to expiration
 */
export type WalletHandle = {
  expiresSeconds?: bigint
  wallet?: Wallet
}

export const WalletHandleMeta: ModelMetadata = {
  name: 'WalletHandle',
  kind: 'object',
  fields: [
    {
      name: 'expiresSeconds',
      wireKey: 'expires_seconds',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'wallet',
      wireKey: 'wallet',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => WalletMeta },
    },
  ],
}
