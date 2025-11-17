import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
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
  creator: string

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

export const ApplicationParamsMeta: ModelMetadata = {
  name: 'ApplicationParams',
  kind: 'object',
  fields: [
    {
      name: 'creator',
      wireKey: 'creator',
      optional: false,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'approvalProgram',
      wireKey: 'approval-program',
      optional: false,
      nullable: false,
      codec: bytesCodec,
    },
    {
      name: 'clearStateProgram',
      wireKey: 'clear-state-program',
      optional: false,
      nullable: false,
      codec: bytesCodec,
    },
    {
      name: 'extraProgramPages',
      wireKey: 'extra-program-pages',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'localStateSchema',
      wireKey: 'local-state-schema',
      optional: true,
      nullable: false,
      codec: new ModelCodec(ApplicationStateSchemaMeta),
    },
    {
      name: 'globalStateSchema',
      wireKey: 'global-state-schema',
      optional: true,
      nullable: false,
      codec: new ModelCodec(ApplicationStateSchemaMeta),
    },
    {
      name: 'globalState',
      wireKey: 'global-state',
      optional: true,
      nullable: false,
      codec: new ModelCodec(TealKeyValueStoreMeta),
    },
    {
      name: 'version',
      wireKey: 'version',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
  ],
}
