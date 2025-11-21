import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { HashFactory } from './hash-factory'
import { HashFactoryMeta } from './hash-factory'

export type MerkleArrayProof = {
  /**
   * \[pth\]
   */
  path?: Uint8Array[]
  hashFactory?: HashFactory

  /**
   * \[td\]
   */
  treeDepth?: number
}

export const MerkleArrayProofMeta: ObjectModelMetadata = {
  name: 'MerkleArrayProof',
  kind: 'object',
  fields: [
    {
      name: 'path',
      wireKey: 'path',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(bytesCodec),
    },
    {
      name: 'hashFactory',
      wireKey: 'hash-factory',
      optional: true,
      nullable: false,
      codec: new ModelCodec(HashFactoryMeta),
    },
    {
      name: 'treeDepth',
      wireKey: 'tree-depth',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
  ],
}
