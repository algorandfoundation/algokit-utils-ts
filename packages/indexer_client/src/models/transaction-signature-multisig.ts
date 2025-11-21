import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
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
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(TransactionSignatureMultisigSubsignatureMeta)),
    },
    {
      name: 'threshold',
      wireKey: 'threshold',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'version',
      wireKey: 'version',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
  ],
}
