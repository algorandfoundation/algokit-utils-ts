import type { ModelMetadata } from '../core/model-runtime'
import type { StateDelta } from './state-delta'
import { StateDeltaMeta } from './state-delta'

/**
 * Application state delta.
 */
export type AccountStateDelta = {
  address: string
  delta: StateDelta
}

export const AccountStateDeltaMeta: ModelMetadata = {
  name: 'AccountStateDelta',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'delta',
      wireKey: 'delta',
      optional: false,
      nullable: false,
      type: { kind: 'model', meta: () => StateDeltaMeta },
    },
  ],
}
