import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
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
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(ApplicationInitialStatesMeta)),
    },
  ],
}
