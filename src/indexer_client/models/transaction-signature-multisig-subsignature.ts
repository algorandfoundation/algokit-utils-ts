import type { ModelMetadata } from '../core/model-runtime'

export type TransactionSignatureMultisigSubsignature = {
  /**
   * \[pk\]
   */
  publicKey?: Uint8Array

  /**
   * \[s\]
   */
  signature?: Uint8Array
}

export const TransactionSignatureMultisigSubsignatureMeta: ModelMetadata = {
  name: 'TransactionSignatureMultisigSubsignature',
  kind: 'object',
  fields: [
    {
      name: 'publicKey',
      wireKey: 'public-key',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
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
