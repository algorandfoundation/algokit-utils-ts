import type { ModelMetadata } from '../core/model-runtime'

export type GetBlockTimeStampOffset = {
  /**
   * Timestamp offset in seconds.
   */
  offset: number
}

export const GetBlockTimeStampOffsetMeta: ModelMetadata = {
  name: 'GetBlockTimeStampOffset',
  kind: 'object',
  fields: [
    {
      name: 'offset',
      wireKey: 'offset',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
