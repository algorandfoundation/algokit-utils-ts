import type { ModelMetadata } from '../core/model-runtime'
import { registerModelMeta } from '../core/model-runtime'
import { BlockEvalDeltaMeta } from './block-eval-delta'

/** BlockStateDelta is a map keyed by state key to BlockEvalDelta. */
export type BlockStateDelta = Record<string, import('./block-eval-delta').BlockEvalDelta>

export const BlockStateDeltaMeta: ModelMetadata = {
  name: 'BlockStateDelta',
  kind: 'object',
  additionalProperties: { kind: 'model', meta: () => BlockEvalDeltaMeta },
}

registerModelMeta('BlockStateDelta', BlockStateDeltaMeta)
