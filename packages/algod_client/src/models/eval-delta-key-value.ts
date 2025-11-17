import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { EvalDelta } from './eval-delta'
import { EvalDeltaMeta } from './eval-delta'

/**
 * Key-value pairs for StateDelta.
 */
export type EvalDeltaKeyValue = {
  key: Uint8Array
  value: EvalDelta
}

export const EvalDeltaKeyValueMeta: ModelMetadata = {
  name: 'EvalDeltaKeyValue',
  kind: 'object',
  fields: [
    {
      name: 'key',
      wireKey: 'key',
      optional: false,
      nullable: false,
      codec: bytesCodec,
    },
    {
      name: 'value',
      wireKey: 'value',
      optional: false,
      nullable: false,
      codec: new ModelCodec(EvalDeltaMeta),
    },
  ],
}
