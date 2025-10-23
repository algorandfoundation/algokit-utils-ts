import type { ModelMetadata } from '../core/model-runtime'

export type GetBlockTxids = {
  /**
   * Block transaction IDs.
   */
  blockTxids: string[]
}

export const GetBlockTxidsMeta: ModelMetadata = {
  name: 'GetBlockTxids',
  kind: 'object',
  fields: [
    {
      name: 'blockTxids',
      wireKey: 'blockTxids',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar' } },
    },
  ],
}
