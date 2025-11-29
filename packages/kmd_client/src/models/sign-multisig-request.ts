import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, bytesCodec, ObjectModelCodec, ArrayModelCodec, PrimitiveModelCodec } from '@algorandfoundation/algokit-common'
import type { Digest } from './digest'
import { DigestMeta } from './digest'
import type { MultisigSig } from './multisig-sig'
import { MultisigSigMeta } from './multisig-sig'
import type { PublicKey } from './public-key'
import { PublicKeyMeta } from './public-key'

/**
 * APIV1POSTMultisigTransactionSignRequest is the request for `POST /v1/multisig/sign`
 */
export type SignMultisigRequest = {
  partialMultisig?: MultisigSig
  publicKey?: PublicKey
  signer?: Digest
  transaction?: Uint8Array
  walletHandleToken?: string
  walletPassword?: string
}

export const SignMultisigRequestMeta: ObjectModelMetadata<SignMultisigRequest> = {
  name: 'SignMultisigRequest',
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
      optional: true,
      codec: new PrimitiveModelCodec(PublicKeyMeta),
    },
    {
      name: 'signer',
      wireKey: 'signer',
      optional: true,
      codec: new ArrayModelCodec(DigestMeta),
    },
    {
      name: 'transaction',
      wireKey: 'transaction',
      optional: true,
      codec: bytesCodec,
    },
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: true,
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
