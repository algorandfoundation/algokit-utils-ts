import type { ModelMetadata } from '../core/model-runtime'
import type { PublicKey } from './public-key'
import { PublicKeyMeta } from './public-key'

/**
 * APIV1POSTTransactionSignRequest is the request for `POST /v1/transaction/sign`
 */
export type SignTransactionRequest = {
  publicKey?: PublicKey

  /**
   * Base64 encoding of msgpack encoding of a `Transaction` object
   * Note: SDK and goal usually generate `SignedTxn` objects
   * in that case, the field `txn` / `Transaction` of the
   * generated `SignedTxn` object needs to be used
   */
  transaction?: Uint8Array
  walletHandleToken?: string
  walletPassword?: string
}

export const SignTransactionRequestMeta: ModelMetadata = {
  name: 'SignTransactionRequest',
  kind: 'object',
  fields: [
    {
      name: 'publicKey',
      wireKey: 'public_key',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => PublicKeyMeta },
    },
    {
      name: 'transaction',
      wireKey: 'transaction',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'walletPassword',
      wireKey: 'wallet_password',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
