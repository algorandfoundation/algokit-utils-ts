import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  numberCodec,
  bytesCodec,
} from '@algorandfoundation/algokit-common'

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
  treedepth: number

  /**
   * Index of the transaction in the block's payset.
   */
  idx: number

  /**
   * The type of hash function used to create the proof, must be one of:
   * * sha512_256
   * * sha256
   */
  hashtype: 'sha512_256' | 'sha256'
}

export const TransactionProofMeta: ObjectModelMetadata = {
  name: 'TransactionProof',
  kind: 'object',
  fields: [
    {
      name: 'proof',
      wireKey: 'proof',
      optional: false,
      codec: bytesCodec,
    },
    {
      name: 'stibhash',
      wireKey: 'stibhash',
      optional: false,
      codec: bytesCodec,
    },
    {
      name: 'treedepth',
      wireKey: 'treedepth',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'idx',
      wireKey: 'idx',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'hashtype',
      wireKey: 'hashtype',
      optional: false,
      codec: stringCodec,
    },
  ],
}
