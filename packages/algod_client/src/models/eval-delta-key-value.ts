import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { bytesCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
import type { EvalDelta } from './eval-delta'
import { EvalDeltaMeta } from './eval-delta'

/**
 * Key-value pairs for StateDelta.
 */
export type EvalDeltaKeyValue = {
  key: Uint8Array
  value: EvalDelta
}

export const EvalDeltaKeyValueMeta: ObjectModelMetadata<EvalDeltaKeyValue> = {
  name: 'EvalDeltaKeyValue',
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
      codec: new ObjectModelCodec(EvalDeltaMeta),
    },
  ],
}
