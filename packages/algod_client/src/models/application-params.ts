import type { Address, ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { numberCodec, bytesCodec, addressCodec, ObjectModelCodec, ArrayModelCodec } from '@algorandfoundation/algokit-common'
import type { ApplicationStateSchema } from './application-state-schema'
import { ApplicationStateSchemaMeta } from './application-state-schema'
import type { TealKeyValueStore } from './teal-key-value-store'
import { TealKeyValueStoreMeta } from './teal-key-value-store'

/**
 * Stores the global information associated with an application.
 */
export type ApplicationParams = {
  /**
   * The address that created this application. This is the address where the parameters and global state for this application can be found.
   */
  creator: Address

  /**
   * \[approv\] approval program.
   */
  approvalProgram: Uint8Array

  /**
   * \[clearp\] approval program.
   */
  clearStateProgram: Uint8Array

  /**
   * \[epp\] the amount of extra program pages available to this app.
   */
  extraProgramPages?: number
  localStateSchema?: ApplicationStateSchema
  globalStateSchema?: ApplicationStateSchema
  globalState?: TealKeyValueStore

  /**
   * \[v\] the number of updates to the application programs
   */
  version?: number
}

export const ApplicationParamsMeta: ObjectModelMetadata<ApplicationParams> = {
  name: 'ApplicationParams',
  kind: 'object',
  fields: [
    {
      name: 'creator',
      wireKey: 'creator',
      optional: false,
      codec: addressCodec,
    },
    {
      name: 'approvalProgram',
      wireKey: 'approval-program',
      optional: false,
      codec: bytesCodec,
    },
    {
      name: 'clearStateProgram',
      wireKey: 'clear-state-program',
      optional: false,
      codec: bytesCodec,
    },
    {
      name: 'extraProgramPages',
      wireKey: 'extra-program-pages',
      optional: true,
      codec: numberCodec,
    },
    {
      name: 'localStateSchema',
      wireKey: 'local-state-schema',
      optional: true,
      codec: new ObjectModelCodec(ApplicationStateSchemaMeta),
    },
    {
      name: 'globalStateSchema',
      wireKey: 'global-state-schema',
      optional: true,
      codec: new ObjectModelCodec(ApplicationStateSchemaMeta),
    },
    {
      name: 'globalState',
      wireKey: 'global-state',
      optional: true,
      codec: new ArrayModelCodec(TealKeyValueStoreMeta),
    },
    {
      name: 'version',
      wireKey: 'version',
      optional: true,
      codec: numberCodec,
    },
  ],
}
