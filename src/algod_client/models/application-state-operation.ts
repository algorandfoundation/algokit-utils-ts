import type { ModelMetadata } from '../core/model-runtime'
import type { AvmValue } from './avm-value'
import { AvmValueMeta } from './avm-value'

/**
 * An operation against an application's global/local/box state.
 */
export type ApplicationStateOperation = {
  /**
   * Operation type. Value `w` is **write**, `d` is **delete**.
   */
  operation: string

  /**
   * Type of application state. Value `g` is **global state**, `l` is **local state**, `b` is **boxes**.
   */
  appStateType: string

  /**
   * The key (name) of the global/local/box state.
   */
  key: Uint8Array
  newValue?: AvmValue

  /**
   * For local state changes, the address of the account associated with the local state.
   */
  account?: string
}

export const ApplicationStateOperationMeta: ModelMetadata = {
  name: 'ApplicationStateOperation',
  kind: 'object',
  fields: [
    {
      name: 'operation',
      wireKey: 'operation',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'appStateType',
      wireKey: 'app-state-type',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'key',
      wireKey: 'key',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'newValue',
      wireKey: 'new-value',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => AvmValueMeta },
    },
    {
      name: 'account',
      wireKey: 'account',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
