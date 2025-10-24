import type { ModelMetadata } from '../core/model-runtime'
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
  version?: bigint
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
      type: { kind: 'scalar' },
    },
    {
      name: 'approvalProgram',
      wireKey: 'approval-program',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'clearStateProgram',
      wireKey: 'clear-state-program',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'extraProgramPages',
      wireKey: 'extra-program-pages',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'localStateSchema',
      wireKey: 'local-state-schema',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => ApplicationStateSchemaMeta },
    },
    {
      name: 'globalStateSchema',
      wireKey: 'global-state-schema',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => ApplicationStateSchemaMeta },
    },
    {
      name: 'globalState',
      wireKey: 'global-state',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => TealKeyValueStoreMeta },
    },
    {
      name: 'version',
      wireKey: 'version',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
  ],
}
