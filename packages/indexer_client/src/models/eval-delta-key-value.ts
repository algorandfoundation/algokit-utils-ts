import type { ModelMetadata } from '../core/model-runtime'
import type { EvalDelta } from './eval-delta'
import { EvalDeltaMeta } from './eval-delta'

/**
 * Key-value pairs for StateDelta.
 */
export type EvalDeltaKeyValue = {
  key: string
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
      type: { kind: 'scalar' },
    },
    {
      name: 'value',
      wireKey: 'value',
      optional: false,
      nullable: false,
      type: { kind: 'model', meta: () => EvalDeltaMeta },
    },
  ],
}
