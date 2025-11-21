import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

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
      nullable: false,
      codec: bytesCodec,
    },
    {
      name: 'stibhash',
      wireKey: 'stibhash',
      optional: false,
      nullable: false,
      codec: bytesCodec,
    },
    {
      name: 'treedepth',
      wireKey: 'treedepth',
      optional: false,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'idx',
      wireKey: 'idx',
      optional: false,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'hashtype',
      wireKey: 'hashtype',
      optional: false,
      nullable: false,
      codec: stringCodec,
    },
  ],
}
