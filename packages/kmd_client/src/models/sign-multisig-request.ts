import type { ModelMetadata } from '../core/model-runtime'
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

export const SignMultisigRequestMeta: ModelMetadata = {
  name: 'SignMultisigRequest',
  kind: 'object',
  fields: [
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
      name: 'signer',
      wireKey: 'signer',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => DigestMeta },
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
