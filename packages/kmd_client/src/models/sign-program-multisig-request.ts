import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
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

export const SignProgramMultisigRequestMeta: ObjectModelMetadata = {
  name: 'SignProgramMultisigRequest',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'data',
      wireKey: 'data',
      optional: true,
      nullable: false,
      codec: bytesCodec,
    },
    {
      name: 'partialMultisig',
      wireKey: 'partial_multisig',
      optional: true,
      nullable: false,
      codec: new ModelCodec(MultisigSigMeta),
    },
    {
      name: 'publicKey',
      wireKey: 'public_key',
      optional: true,
      nullable: false,
      codec: new ModelCodec(PublicKeyMeta),
    },
    {
      name: 'useLegacyMsig',
      wireKey: 'use_legacy_msig',
      optional: true,
      nullable: false,
      codec: booleanCodec,
    },
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'walletPassword',
      wireKey: 'wallet_password',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
  ],
}
