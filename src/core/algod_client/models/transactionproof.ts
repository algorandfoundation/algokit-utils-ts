/**
 * Proof of transaction in a block.
 */
export type TransactionProof = {
  /**
   * Proof of transaction membership.
   */
  proof: string;

  /**
   * Hash of SignedTxnInBlock for verifying proof.
   */
  stibhash: string;

  /**
   * Represents the depth of the tree that is being proven, i.e. the number of edges from a leaf to the root.
   */
  treedepth: bigint;

  /**
   * Index of the transaction in the block's payset.
   */
  idx: bigint;

  /**
   * The type of hash function used to create the proof, must be one of:
   * * sha512_256
   * * sha256
   */
  hashtype: "sha512_256" | "sha256";
};
