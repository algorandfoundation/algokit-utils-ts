/**
 * Proof of membership and position of a light block header.
 */
export type LightBlockHeaderProof = {
  /**
   * The index of the light block header in the vector commitment tree
   */
  index: bigint;

  /**
   * Represents the depth of the tree that is being proven, i.e. the number of edges from a leaf to the root.
   */
  treedepth: bigint;

  /**
   * The encoded proof.
   */
  proof: string;
};
