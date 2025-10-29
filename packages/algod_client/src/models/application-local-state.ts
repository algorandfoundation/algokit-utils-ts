import type { ModelMetadata } from '../core/model-runtime'
import type { ApplicationStateSchema } from './application-state-schema'
import { ApplicationStateSchemaMeta } from './application-state-schema'
import type { TealKeyValueStore } from './teal-key-value-store'
import { TealKeyValueStoreMeta } from './teal-key-value-store'

/**
 * Stores local state associated with an application.
 */
export type ApplicationLocalState = {
  /**
   * The application which this local state is for.
   */
  id: bigint
  schema: ApplicationStateSchema
  keyValue?: TealKeyValueStore
}

export const ApplicationLocalStateMeta: ModelMetadata = {
  name: 'ApplicationLocalState',
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
      name: 'schema',
      wireKey: 'schema',
      optional: false,
      nullable: false,
      type: { kind: 'model', meta: () => ApplicationStateSchemaMeta },
    },
    {
      name: 'keyValue',
      wireKey: 'key-value',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => TealKeyValueStoreMeta },
    },
  ],
}
