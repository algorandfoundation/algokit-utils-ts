import type { ModelMetadata } from '../core/model-runtime'

/**
 * Proof of transaction in a block.
 */
export type TransactionProof = {
  /**
   * Proof of transaction membership.
   */
  proof: Uint8Array

  /**
   * Hash of SignedTxnInBlock for verifying proof.
   */
  stibhash: Uint8Array

  /**
   * Represents the depth of the tree that is being proven, i.e. the number of edges from a leaf to the root.
   */
  treedepth: bigint

  /**
   * Index of the transaction in the block's payset.
   */
  idx: bigint

  /**
   * The type of hash function used to create the proof, must be one of:
   * * sha512_256
   * * sha256
   */
  hashtype: 'sha512_256' | 'sha256'
}

export const TransactionProofMeta: ModelMetadata = {
  name: 'TransactionProof',
  kind: 'object',
  fields: [
    {
      name: 'proof',
      wireKey: 'proof',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'stibhash',
      wireKey: 'stibhash',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'treedepth',
      wireKey: 'treedepth',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'idx',
      wireKey: 'idx',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'hashtype',
      wireKey: 'hashtype',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
