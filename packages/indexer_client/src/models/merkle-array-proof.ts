import type { ModelMetadata } from '../core/model-runtime'
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
  treeDepth?: bigint
}

export const MerkleArrayProofMeta: ModelMetadata = {
  name: 'MerkleArrayProof',
  kind: 'object',
  fields: [
    {
      name: 'path',
      wireKey: 'path',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar', isBytes: true } },
    },
    {
      name: 'hashFactory',
      wireKey: 'hash-factory',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => HashFactoryMeta },
    },
    {
      name: 'treeDepth',
      wireKey: 'tree-depth',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
