import type { ModelMetadata } from '../core/model-runtime'
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
  threshold?: bigint

  /**
   * \[v\]
   */
  version?: bigint
}

export const TransactionSignatureMultisigMeta: ModelMetadata = {
  name: 'TransactionSignatureMultisig',
  kind: 'object',
  fields: [
    {
      name: 'subsignature',
      wireKey: 'subsignature',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => TransactionSignatureMultisigSubsignatureMeta } },
    },
    {
      name: 'threshold',
      wireKey: 'threshold',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'version',
      wireKey: 'version',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
