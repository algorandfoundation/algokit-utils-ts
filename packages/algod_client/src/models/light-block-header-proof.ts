import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  numberCodec,
  bytesCodec,
} from '@algorandfoundation/algokit-common'

/**
 * Proof of membership and position of a light block header.
 */
export type LightBlockHeaderProof = {
  /**
   * The index of the light block header in the vector commitment tree
   */
  index: number

  /**
   * Represents the depth of the tree that is being proven, i.e. the number of edges from a leaf to the root.
   */
  treedepth: number

  /**
   * The encoded proof.
   */
  proof: Uint8Array
}

export const LightBlockHeaderProofMeta: ObjectModelMetadata = {
  name: 'LightBlockHeaderProof',
  kind: 'object',
  fields: [
    {
      name: 'index',
      wireKey: 'index',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'treedepth',
      wireKey: 'treedepth',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'proof',
      wireKey: 'proof',
      optional: false,
      codec: bytesCodec,
    },
  ],
}
