import type { ModelMetadata } from '../core/model-runtime'

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

export const SimulateTraceConfigMeta: ModelMetadata = {
  name: 'SimulateTraceConfig',
  kind: 'object',
  fields: [
    {
      name: 'enable',
      wireKey: 'enable',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'stackChange',
      wireKey: 'stack-change',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'scratchChange',
      wireKey: 'scratch-change',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'stateChange',
      wireKey: 'state-change',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
