import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  bigIntCodec,
  booleanCodec,
  ObjectModelCodec,
  ArrayModelCodec,
} from '@algorandfoundation/algokit-common'
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

  /**
   * Whether or not the application local state is currently deleted from its account.
   */
  deleted?: boolean

  /**
   * Round when the account opted into the application.
   */
  optedInAtRound?: bigint

  /**
   * Round when account closed out of the application.
   */
  closedOutAtRound?: bigint
  schema: ApplicationStateSchema
  keyValue?: TealKeyValueStore
}

export const ApplicationLocalStateMeta: ObjectModelMetadata = {
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
      name: 'deleted',
      wireKey: 'deleted',
      optional: true,
      codec: booleanCodec,
    },
    {
      name: 'optedInAtRound',
      wireKey: 'opted-in-at-round',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'closedOutAtRound',
      wireKey: 'closed-out-at-round',
      optional: true,
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
