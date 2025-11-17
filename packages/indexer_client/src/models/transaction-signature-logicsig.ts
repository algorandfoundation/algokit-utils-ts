import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
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
      codec: new ArrayCodec(stringCodec),
    },
    {
      name: 'logic',
      wireKey: 'logic',
      optional: false,
      nullable: false,
      codec: bytesCodec,
    },
    {
      name: 'multisigSignature',
      wireKey: 'multisig-signature',
      optional: true,
      nullable: false,
      codec: new ModelCodec(TransactionSignatureMultisigMeta),
    },
    {
      name: 'logicMultisigSignature',
      wireKey: 'logic-multisig-signature',
      optional: true,
      nullable: false,
      codec: new ModelCodec(TransactionSignatureMultisigMeta),
    },
    {
      name: 'signature',
      wireKey: 'signature',
      optional: true,
      nullable: false,
      codec: bytesCodec,
    },
  ],
}
