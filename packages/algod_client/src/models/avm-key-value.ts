import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { bytesCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
import type { AvmValue } from './avm-value'
import { AvmValueMeta } from './avm-value'

/**
 * Represents an AVM key-value pair in an application store.
 */
export type AvmKeyValue = {
  key: Uint8Array
  value: AvmValue
}

export const AvmKeyValueMeta: ObjectModelMetadata<AvmKeyValue> = {
  name: 'AvmKeyValue',
  kind: 'object',
  fields: [
    {
      name: 'key',
      wireKey: 'key',
      optional: false,
      codec: bytesCodec,
    },
    {
      name: 'value',
      wireKey: 'value',
      optional: false,
      codec: new ObjectModelCodec(AvmValueMeta),
    },
  ],
}
