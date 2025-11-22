import type { ModelMetadata } from '../core/model-runtime'

export type GetBlockHash = {
  /**
   * Block header hash.
   */
  blockHash: string
}

export const GetBlockHashMeta: ModelMetadata = {
  name: 'GetBlockHash',
  kind: 'object',
  fields: [
    {
      name: 'blockHash',
      wireKey: 'blockHash',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
