import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, booleanCodec, bytesCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
import type { MultisigSig } from './multisig-sig'
import { MultisigSigMeta } from './multisig-sig'

/**
 * APIV1POSTMultisigProgramSignRequest is the request for `POST /v1/multisig/signprogram`
 */
export type SignProgramMultisigRequest = {
  address: string
  data: Uint8Array
  partialMultisig: MultisigSig
  publicKey: Uint8Array
  useLegacyMsig: boolean
  walletHandleToken: string
  walletPassword: string
}

export const SignProgramMultisigRequestMeta: ObjectModelMetadata<SignProgramMultisigRequest> = {
  name: 'SignProgramMultisigRequest',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'data',
      wireKey: 'data',
      optional: false,
      codec: bytesCodec,
    },
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
      name: 'useLegacyMsig',
      wireKey: 'use_legacy_msig',
      optional: false,
      codec: booleanCodec,
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
