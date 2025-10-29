import type { ModelMetadata } from '../core/model-runtime'
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

export const SignProgramMultisigRequestMeta: ModelMetadata = {
  name: 'SignProgramMultisigRequest',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'data',
      wireKey: 'data',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'partialMultisig',
      wireKey: 'partial_multisig',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => MultisigSigMeta },
    },
    {
      name: 'publicKey',
      wireKey: 'public_key',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => PublicKeyMeta },
    },
    {
      name: 'useLegacyMsig',
      wireKey: 'use_legacy_msig',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
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
