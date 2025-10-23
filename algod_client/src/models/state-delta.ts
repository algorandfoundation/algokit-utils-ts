import type { ModelMetadata } from '../core/model-runtime'
import type { EvalDeltaKeyValue } from './eval-delta-key-value'
import { EvalDeltaKeyValueMeta } from './eval-delta-key-value'

/**
 * Application state delta.
 */
export type StateDelta = EvalDeltaKeyValue[]

export const StateDeltaMeta: ModelMetadata = {
  name: 'StateDelta',
  kind: 'array',
  arrayItems: { kind: 'model', meta: () => EvalDeltaKeyValueMeta },
}
