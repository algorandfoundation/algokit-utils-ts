import type { ModelMetadata } from '../core/model-runtime'
import type { ApplicationLocalState } from './application-local-state'
import { ApplicationLocalStateMeta } from './application-local-state'

export type LookupAccountAppLocalStates = {
  appsLocalStates: ApplicationLocalState[]

  /**
   * Round at which the results were computed.
   */
  currentRound: bigint

  /**
   * Used for pagination, when making another request provide this token with the next parameter.
   */
  nextToken?: string
}

export const LookupAccountAppLocalStatesMeta: ModelMetadata = {
  name: 'LookupAccountAppLocalStates',
  kind: 'object',
  fields: [
    {
      name: 'appsLocalStates',
      wireKey: 'apps-local-states',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => ApplicationLocalStateMeta } },
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
