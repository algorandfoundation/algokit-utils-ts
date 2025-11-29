import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
import type { EvalDelta } from './eval-delta'
import { EvalDeltaMeta } from './eval-delta'

/**
 * Key-value pairs for StateDelta.
 */
export type EvalDeltaKeyValue = {
  key: string
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
      codec: stringCodec,
    },
    {
      name: 'value',
      wireKey: 'value',
      optional: false,
      codec: new ObjectModelCodec(EvalDeltaMeta),
    },
  ],
}
