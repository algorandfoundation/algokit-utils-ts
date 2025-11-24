import type { ModelMetadata } from '../core/model-runtime'
import type { Wallet } from './wallet'
import { WalletMeta } from './wallet'

/**
 * APIV1POSTWalletResponse is the response to `POST /v1/wallet`
 * friendly:CreateWalletResponse
 */
export type PostWalletResponse = {
  error?: boolean
  message?: string
  wallet?: Wallet
}

export const PostWalletResponseMeta: ModelMetadata = {
  name: 'PostWalletResponse',
  kind: 'object',
  fields: [
    {
      name: 'error',
      wireKey: 'error',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'message',
      wireKey: 'message',
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
