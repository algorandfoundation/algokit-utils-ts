import type { ModelMetadata } from '../core/model-runtime'

/**
 * Proof of membership and position of a light block header.
 */
export type LightBlockHeaderProof = {
  /**
   * The index of the light block header in the vector commitment tree
   */
  index: bigint

  /**
   * Represents the depth of the tree that is being proven, i.e. the number of edges from a leaf to the root.
   */
  treedepth: bigint

  /**
   * The encoded proof.
   */
  proof: Uint8Array
}

export const LightBlockHeaderProofMeta: ModelMetadata = {
  name: 'LightBlockHeaderProof',
  kind: 'object',
  fields: [
    {
      name: 'index',
      wireKey: 'index',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'treedepth',
      wireKey: 'treedepth',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'proof',
      wireKey: 'proof',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
  ],
}
