import type { ModelMetadata } from '../core/model-runtime'

export type GetBlockTxIds = {
  /**
   * Block transaction IDs.
   */
  blockTxIds: string[]
}

export const GetBlockTxIdsMeta: ModelMetadata = {
  name: 'GetBlockTxIds',
  kind: 'object',
  fields: [
    {
      name: 'blockTxIds',
      wireKey: 'blockTxids',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar' } },
    },
  ],
}
