import type { ModelMetadata } from '../core/model-runtime'
import type { ApplicationParams } from './application-params'
import { ApplicationParamsMeta } from './application-params'

/**
 * Application index and its parameters
 */
export type Application = {
  /**
   * application index.
   */
  id: bigint

  /**
   * Whether or not this application is currently deleted.
   */
  deleted?: boolean

  /**
   * Round when this application was created.
   */
  createdAtRound?: bigint

  /**
   * Round when this application was deleted.
   */
  deletedAtRound?: bigint
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
      name: 'deleted',
      wireKey: 'deleted',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'createdAtRound',
      wireKey: 'created-at-round',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'deletedAtRound',
      wireKey: 'deleted-at-round',
      optional: true,
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
