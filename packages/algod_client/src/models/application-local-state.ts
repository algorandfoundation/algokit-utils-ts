import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { bigIntCodec, ObjectModelCodec, ArrayModelCodec } from '@algorandfoundation/algokit-common'
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

export const ApplicationLocalStateMeta: ObjectModelMetadata<ApplicationLocalState> = {
  name: 'ApplicationLocalState',
  kind: 'object',
  fields: [
    {
      name: 'id',
      wireKey: 'id',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'schema',
      wireKey: 'schema',
      optional: false,
      codec: new ObjectModelCodec(ApplicationStateSchemaMeta),
    },
    {
      name: 'keyValue',
      wireKey: 'key-value',
      optional: true,
      codec: new ArrayModelCodec(TealKeyValueStoreMeta),
    },
  ],
}
