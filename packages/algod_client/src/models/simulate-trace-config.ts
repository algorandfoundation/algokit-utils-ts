import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * An object that configures simulation execution trace.
 */
export type SimulateTraceConfig = {
  /**
   * A boolean option for opting in execution trace features simulation endpoint.
   */
  enable?: boolean

  /**
   * A boolean option enabling returning stack changes together with execution trace during simulation.
   */
  stackChange?: boolean

  /**
   * A boolean option enabling returning scratch slot changes together with execution trace during simulation.
   */
  scratchChange?: boolean

  /**
   * A boolean option enabling returning application state changes (global, local, and box changes) with the execution trace during simulation.
   */
  stateChange?: boolean
}

export const SimulateTraceConfigMeta: ObjectModelMetadata = {
  name: 'SimulateTraceConfig',
  kind: 'object',
  fields: [
    {
      name: 'enable',
      wireKey: 'enable',
      optional: true,
      nullable: false,
      codec: booleanCodec,
    },
    {
      name: 'stackChange',
      wireKey: 'stack-change',
      optional: true,
      nullable: false,
      codec: booleanCodec,
    },
    {
      name: 'scratchChange',
      wireKey: 'scratch-change',
      optional: true,
      nullable: false,
      codec: booleanCodec,
    },
    {
      name: 'stateChange',
      wireKey: 'state-change',
      optional: true,
      nullable: false,
      codec: booleanCodec,
    },
  ],
}
