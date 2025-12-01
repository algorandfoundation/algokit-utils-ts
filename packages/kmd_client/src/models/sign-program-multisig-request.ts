import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, booleanCodec, bytesCodec, ObjectModelCodec, PrimitiveModelCodec } from '@algorandfoundation/algokit-common'
import type { MultisigSig } from './multisig-sig'
import { MultisigSigMeta } from './multisig-sig'
import type { PublicKey } from './public-key'
import { PublicKeyMeta } from './public-key'

/**
 * APIV1POSTMultisigProgramSignRequest is the request for `POST /v1/multisig/signprogram`
 */
export type SignProgramMultisigRequest = {
  address?: string
  data?: Uint8Array
  partialMultisig?: MultisigSig
  publicKey?: PublicKey
  useLegacyMsig?: boolean
  walletHandleToken?: string
  walletPassword?: string
}

export const SignProgramMultisigRequestMeta: ObjectModelMetadata<SignProgramMultisigRequest> = {
  name: 'SignProgramMultisigRequest',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: true,
      codec: stringCodec,
    },
    {
      name: 'data',
      wireKey: 'data',
      optional: true,
      codec: bytesCodec,
    },
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
      name: 'useLegacyMsig',
      wireKey: 'use_legacy_msig',
      optional: true,
      codec: booleanCodec,
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
