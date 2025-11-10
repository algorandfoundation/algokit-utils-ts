import type { ModelMetadata } from '../core/model-runtime'
import { registerModelMeta } from '../core/model-runtime'
import type { BlockStateDelta } from './block-state-delta'
import { BlockStateDeltaMeta } from './block-state-delta'

/** BlockAccountStateDelta pairs an address with a BlockStateDelta map. */
export interface BlockAccountStateDelta {
  address: string
  delta: BlockStateDelta
}

export const BlockAccountStateDeltaMeta: ModelMetadata = {
  name: 'BlockAccountStateDelta',
  kind: 'object',
  fields: [
    { name: 'address', wireKey: 'address', optional: false, nullable: false, type: { kind: 'scalar' } },
    { name: 'delta', wireKey: 'delta', optional: false, nullable: false, type: { kind: 'model', meta: () => BlockStateDeltaMeta } },
  ],
}

registerModelMeta('BlockAccountStateDelta', BlockAccountStateDeltaMeta)
