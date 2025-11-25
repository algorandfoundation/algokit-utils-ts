import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  ArrayCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
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

export const SimulateInitialStatesMeta: ObjectModelMetadata = {
  name: 'SimulateInitialStates',
  kind: 'object',
  fields: [
    {
      name: 'appInitialStates',
      wireKey: 'app-initial-states',
      optional: true,
      codec: new ArrayCodec(new ObjectModelCodec(ApplicationInitialStatesMeta)),
    },
  ],
}
