import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  numberCodec,
  bytesArrayCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
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

export const MerkleArrayProofMeta: ObjectModelMetadata<MerkleArrayProof> = {
  name: 'MerkleArrayProof',
  kind: 'object',
  fields: [
    {
      name: 'path',
      wireKey: 'path',
      optional: true,
      codec: bytesArrayCodec,
    },
    {
      name: 'hashFactory',
      wireKey: 'hash-factory',
      optional: true,
      codec: new ObjectModelCodec(HashFactoryMeta),
    },
    {
      name: 'treeDepth',
      wireKey: 'tree-depth',
      optional: true,
      codec: numberCodec,
    },
  ],
}
