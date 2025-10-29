import type { ModelMetadata } from '../core/model-runtime'
import type { Block } from './block'
import { BlockMeta } from './block'

export type SearchForBlockHeaders = {
  /**
   * Round at which the results were computed.
   */
  currentRound: bigint

  /**
   * Used for pagination, when making another request provide this token with the next parameter.
   */
  nextToken?: string
  blocks: Block[]
}

export const SearchForBlockHeadersMeta: ModelMetadata = {
  name: 'SearchForBlockHeaders',
  kind: 'object',
  fields: [
    {
      name: 'currentRound',
      wireKey: 'current-round',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'nextToken',
      wireKey: 'next-token',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'blocks',
      wireKey: 'blocks',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => BlockMeta } },
    },
  ],
}
