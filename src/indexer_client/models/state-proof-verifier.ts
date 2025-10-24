import type { ModelMetadata } from '../core/model-runtime'

export type StateProofVerifier = {
  /**
   * \[cmt\] Represents the root of the vector commitment tree.
   */
  commitment?: Uint8Array

  /**
   * \[lf\] Key lifetime.
   */
  keyLifetime?: bigint
}

export const StateProofVerifierMeta: ModelMetadata = {
  name: 'StateProofVerifier',
  kind: 'object',
  fields: [
    {
      name: 'commitment',
      wireKey: 'commitment',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'keyLifetime',
      wireKey: 'key-lifetime',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
  ],
}
