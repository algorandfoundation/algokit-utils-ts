import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, bytesCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
import type { MultisigSig } from './multisig-sig'
import { MultisigSigMeta } from './multisig-sig'

/**
 * APIV1POSTMultisigTransactionSignRequest is the request for `POST /v1/multisig/sign`
 */
export type SignMultisigRequest = {
  partialMultisig: MultisigSig
  publicKey: Uint8Array
  signer: Uint8Array
  transaction: Uint8Array
  walletHandleToken: string
  walletPassword: string
}

export const SignMultisigRequestMeta: ObjectModelMetadata<SignMultisigRequest> = {
  name: 'SignMultisigRequest',
  kind: 'object',
  fields: [
    {
      name: 'partialMultisig',
      wireKey: 'partial_multisig',
      optional: false,
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
      optional: false,
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
      optional: false,
      codec: stringCodec,
    },
  ],
}
