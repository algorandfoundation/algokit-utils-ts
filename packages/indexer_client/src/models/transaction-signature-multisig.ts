import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  numberCodec,
  ArrayCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { TransactionSignatureMultisigSubsignature } from './transaction-signature-multisig-subsignature'
import { TransactionSignatureMultisigSubsignatureMeta } from './transaction-signature-multisig-subsignature'

/**
 * structure holding multiple subsignatures.
 *
 * Definition:
 * crypto/multisig.go : MultisigSig
 */
export type TransactionSignatureMultisig = {
  /**
   * \[subsig\] holds pairs of public key and signatures.
   */
  subsignature?: TransactionSignatureMultisigSubsignature[]

  /**
   * \[thr\]
   */
  threshold?: number

  /**
   * \[v\]
   */
  version?: number
}

export const TransactionSignatureMultisigMeta: ObjectModelMetadata = {
  name: 'TransactionSignatureMultisig',
  kind: 'object',
  fields: [
    {
      name: 'subsignature',
      wireKey: 'subsignature',
      optional: true,
      codec: new ArrayCodec(new ObjectModelCodec(TransactionSignatureMultisigSubsignatureMeta)),
    },
    {
      name: 'threshold',
      wireKey: 'threshold',
      optional: true,
      codec: numberCodec,
    },
    {
      name: 'version',
      wireKey: 'version',
      optional: true,
      codec: numberCodec,
    },
  ],
}
