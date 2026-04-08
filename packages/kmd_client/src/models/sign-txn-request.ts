import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * The request for `POST /v1/transaction/sign`
 */
export type SignTxnRequest = {
  publicKey?: Uint8Array

  /**
   * Base64 encoding of msgpack encoding of a `Transaction` object
   * Note: SDK and goal usually generate `SignedTxn` objects
   * in that case, the field `txn` / `Transaction` of the
   * generated `SignedTxn` object needs to be used
   */
  transaction: Uint8Array
  walletHandleToken: string
  walletPassword?: string
}

export const SignTxnRequestMeta: ObjectModelMetadata<SignTxnRequest> = {
  name: 'SignTxnRequest',
  kind: 'object',
  fields: [
    {
      name: 'publicKey',
      wireKey: 'public_key',
      optional: true,
      codec: bytesCodec,
    },
    {
      name: 'transaction',
      wireKey: 'transaction',
      optional: false,
      codec: bytesCodec,
    },
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'walletPassword',
      wireKey: 'wallet_password',
      optional: true,
      codec: stringCodec,
    },
  ],
}
