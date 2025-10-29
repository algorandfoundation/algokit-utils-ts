import type { ModelMetadata } from '../core/model-runtime'
import type { ApplicationLocalState } from './application-local-state'
import { ApplicationLocalStateMeta } from './application-local-state'
import type { ApplicationParams } from './application-params'
import { ApplicationParamsMeta } from './application-params'

export type AccountApplicationInformation = {
  /**
   * The round for which this information is relevant.
   */
  round: bigint
  appLocalState?: ApplicationLocalState
  createdApp?: ApplicationParams
}

export const AccountApplicationInformationMeta: ModelMetadata = {
  name: 'AccountApplicationInformation',
  kind: 'object',
  fields: [
    {
      name: 'round',
      wireKey: 'round',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'appLocalState',
      wireKey: 'app-local-state',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => ApplicationLocalStateMeta },
    },
    {
      name: 'createdApp',
      wireKey: 'created-app',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => ApplicationParamsMeta },
    },
  ],
}
