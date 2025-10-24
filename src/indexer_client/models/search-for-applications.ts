import type { ModelMetadata } from '../core/model-runtime'
import type { Application } from './application'
import { ApplicationMeta } from './application'

export type SearchForApplications = {
  applications: Application[]

  /**
   * Round at which the results were computed.
   */
  currentRound: bigint

  /**
   * Used for pagination, when making another request provide this token with the next parameter.
   */
  nextToken?: string
}

export const SearchForApplicationsMeta: ModelMetadata = {
  name: 'SearchForApplications',
  kind: 'object',
  fields: [
    {
      name: 'applications',
      wireKey: 'applications',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => ApplicationMeta } },
    },
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
  ],
}
