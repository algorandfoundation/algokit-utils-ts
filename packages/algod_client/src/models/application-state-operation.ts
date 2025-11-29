import type { Address, ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  bytesCodec,
  addressCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
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
  account?: Address
}

export const ApplicationStateOperationMeta: ObjectModelMetadata<ApplicationStateOperation> = {
  name: 'ApplicationStateOperation',
  kind: 'object',
  fields: [
    {
      name: 'operation',
      wireKey: 'operation',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'appStateType',
      wireKey: 'app-state-type',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'key',
      wireKey: 'key',
      optional: false,
      codec: bytesCodec,
    },
    {
      name: 'newValue',
      wireKey: 'new-value',
      optional: true,
      codec: new ObjectModelCodec(AvmValueMeta),
    },
    {
      name: 'account',
      wireKey: 'account',
      optional: true,
      codec: addressCodec,
    },
  ],
}
