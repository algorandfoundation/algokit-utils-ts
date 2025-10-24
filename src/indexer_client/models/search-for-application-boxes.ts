import type { ModelMetadata } from '../core/model-runtime'
import type { BoxDescriptor } from './box-descriptor'
import { BoxDescriptorMeta } from './box-descriptor'

export type SearchForApplicationBoxes = {
  /**
   * \[appidx\] application index.
   */
  applicationId: bigint
  boxes: BoxDescriptor[]

  /**
   * Used for pagination, when making another request provide this token with the next parameter.
   */
  nextToken?: string
}

export const SearchForApplicationBoxesMeta: ModelMetadata = {
  name: 'SearchForApplicationBoxes',
  kind: 'object',
  fields: [
    {
      name: 'applicationId',
      wireKey: 'application-id',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'boxes',
      wireKey: 'boxes',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => BoxDescriptorMeta } },
    },
    {
      name: 'nextToken',
      wireKey: 'next-token',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
