import type { ModelMetadata } from '../core/model-runtime'
import type { WalletHandle } from './wallet-handle'
import { WalletHandleMeta } from './wallet-handle'

/**
 * APIV1POSTWalletInfoResponse is the response to `POST /v1/wallet/info`
 * friendly:WalletInfoResponse
 */
export type PostWalletInfoResponse = {
  error?: boolean
  message?: string
  walletHandle?: WalletHandle
}

export const PostWalletInfoResponseMeta: ModelMetadata = {
  name: 'PostWalletInfoResponse',
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
      name: 'walletHandle',
      wireKey: 'wallet_handle',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => WalletHandleMeta },
    },
  ],
}
