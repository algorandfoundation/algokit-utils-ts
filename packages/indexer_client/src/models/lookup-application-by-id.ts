import type { ModelMetadata } from '../core/model-runtime'
import type { Application } from './application'
import { ApplicationMeta } from './application'

export type LookupApplicationById = {
  application?: Application

  /**
   * Round at which the results were computed.
   */
  currentRound: bigint
}

export const LookupApplicationByIdMeta: ModelMetadata = {
  name: 'LookupApplicationById',
  kind: 'object',
  fields: [
    {
      name: 'application',
      wireKey: 'application',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => ApplicationMeta },
    },
    {
      name: 'currentRound',
      wireKey: 'current-round',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
