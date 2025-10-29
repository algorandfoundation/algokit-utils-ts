import type { ModelMetadata } from '../core/model-runtime'
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

export const PostWalletRenewResponseMeta: ModelMetadata = {
  name: 'PostWalletRenewResponse',
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
