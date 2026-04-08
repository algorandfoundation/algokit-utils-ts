import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, bytesCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
import type { MultisigSig } from './multisig-sig'
import { MultisigSigMeta } from './multisig-sig'

/**
 * The request for `POST /v1/multisig/sign`
 */
export type SignMultisigTxnRequest = {
  partialMultisig?: MultisigSig
  publicKey: Uint8Array
  signer?: Uint8Array
  transaction: Uint8Array
  walletHandleToken: string
  walletPassword?: string
}

export const SignMultisigTxnRequestMeta: ObjectModelMetadata<SignMultisigTxnRequest> = {
  name: 'SignMultisigTxnRequest',
  kind: 'object',
  fields: [
    {
      name: 'partialMultisig',
      wireKey: 'partial_multisig',
      optional: true,
      codec: new ObjectModelCodec(MultisigSigMeta),
    },
    {
      name: 'publicKey',
      wireKey: 'public_key',
      optional: false,
      codec: bytesCodec,
    },
    {
      name: 'signer',
      wireKey: 'signer',
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
