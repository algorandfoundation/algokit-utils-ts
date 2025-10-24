import type { ModelMetadata } from '../core/model-runtime'
import type { ApplicationInitialStates } from './application-initial-states'
import { ApplicationInitialStatesMeta } from './application-initial-states'

/**
 * Initial states of resources that were accessed during simulation.
 */
export type SimulateInitialStates = {
  /**
   * The initial states of accessed application before simulation. The order of this array is arbitrary.
   */
  appInitialStates?: ApplicationInitialStates[]
}

export const SimulateInitialStatesMeta: ModelMetadata = {
  name: 'SimulateInitialStates',
  kind: 'object',
  fields: [
    {
      name: 'appInitialStates',
      wireKey: 'app-initial-states',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => ApplicationInitialStatesMeta } },
    },
  ],
}
