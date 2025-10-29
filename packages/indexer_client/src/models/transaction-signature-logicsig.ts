import type { ModelMetadata } from '../core/model-runtime'
import type { TransactionSignatureMultisig } from './transaction-signature-multisig'
import { TransactionSignatureMultisigMeta } from './transaction-signature-multisig'

/**
 * \[lsig\] Programatic transaction signature.
 *
 * Definition:
 * data/transactions/logicsig.go
 */
export type TransactionSignatureLogicsig = {
  /**
   * \[arg\] Logic arguments, base64 encoded.
   */
  args?: string[]

  /**
   * \[l\] Program signed by a signature or multi signature, or hashed to be the address of an account. Base64 encoded TEAL program.
   */
  logic: Uint8Array
  multisigSignature?: TransactionSignatureMultisig
  logicMultisigSignature?: TransactionSignatureMultisig

  /**
   * \[sig\] ed25519 signature.
   */
  signature?: Uint8Array
}

export const TransactionSignatureLogicsigMeta: ModelMetadata = {
  name: 'TransactionSignatureLogicsig',
  kind: 'object',
  fields: [
    {
      name: 'args',
      wireKey: 'args',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar' } },
    },
    {
      name: 'logic',
      wireKey: 'logic',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'multisigSignature',
      wireKey: 'multisig-signature',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => TransactionSignatureMultisigMeta },
    },
    {
      name: 'logicMultisigSignature',
      wireKey: 'logic-multisig-signature',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => TransactionSignatureMultisigMeta },
    },
    {
      name: 'signature',
      wireKey: 'signature',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
  ],
}
