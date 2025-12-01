import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { bytesCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
import type { TransactionSignatureLogicsig } from './transaction-signature-logicsig'
import { TransactionSignatureLogicsigMeta } from './transaction-signature-logicsig'
import type { TransactionSignatureMultisig } from './transaction-signature-multisig'
import { TransactionSignatureMultisigMeta } from './transaction-signature-multisig'

/**
 * Validation signature associated with some data. Only one of the signatures should be provided.
 */
export type TransactionSignature = {
  logicsig?: TransactionSignatureLogicsig
  multisig?: TransactionSignatureMultisig

  /**
   * \[sig\] Standard ed25519 signature.
   */
  sig?: Uint8Array
}

export const TransactionSignatureMeta: ObjectModelMetadata<TransactionSignature> = {
  name: 'TransactionSignature',
  kind: 'object',
  fields: [
    {
      name: 'logicsig',
      wireKey: 'logicsig',
      optional: true,
      codec: new ObjectModelCodec(TransactionSignatureLogicsigMeta),
    },
    {
      name: 'multisig',
      wireKey: 'multisig',
      optional: true,
      codec: new ObjectModelCodec(TransactionSignatureMultisigMeta),
    },
    {
      name: 'sig',
      wireKey: 'sig',
      optional: true,
      codec: bytesCodec,
    },
  ],
}
