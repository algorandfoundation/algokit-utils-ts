import type { Address, ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, booleanCodec, bytesCodec, addressCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
import type { MultisigSig } from './multisig-sig'
import { MultisigSigMeta } from './multisig-sig'

/**
 * The request for `POST /v1/multisig/signprogram`
 */
export type SignProgramMultisigRequest = {
  address: Address
  program: Uint8Array
  partialMultisig?: MultisigSig
  publicKey: Uint8Array
  useLegacyMsig?: boolean
  walletHandleToken: string
  walletPassword?: string
}

export const SignProgramMultisigRequestMeta: ObjectModelMetadata<SignProgramMultisigRequest> = {
  name: 'SignProgramMultisigRequest',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: false,
      codec: addressCodec,
    },
    {
      name: 'program',
      wireKey: 'data',
      optional: false,
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
      optional: false,
      codec: bytesCodec,
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
