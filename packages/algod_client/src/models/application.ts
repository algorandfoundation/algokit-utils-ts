import type { ModelMetadata } from '../core/model-runtime'
import type { ApplicationParams } from './application-params'
import { ApplicationParamsMeta } from './application-params'

/**
 * Application index and its parameters
 */
export type Application = {
  /**
   * \[appidx\] application index.
   */
  id: bigint
  params: ApplicationParams
}

export const ApplicationMeta: ModelMetadata = {
  name: 'Application',
  kind: 'object',
  fields: [
    {
      name: 'id',
      wireKey: 'id',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'params',
      wireKey: 'params',
      optional: false,
      nullable: false,
      type: { kind: 'model', meta: () => ApplicationParamsMeta },
    },
  ],
}
