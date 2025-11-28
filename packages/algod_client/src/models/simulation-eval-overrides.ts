import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  numberCodec,
  booleanCodec,
} from '@algorandfoundation/algokit-common'

/**
 * The set of parameters and limits override during simulation. If this set of parameters is present, then evaluation parameters may differ from standard evaluation in certain ways.
 */
export type SimulationEvalOverrides = {
  /**
   * If true, transactions without signatures are allowed and simulated as if they were properly signed.
   */
  allowEmptySignatures?: boolean

  /**
   * If true, allows access to unnamed resources during simulation.
   */
  allowUnnamedResources?: boolean

  /**
   * The maximum log calls one can make during simulation
   */
  maxLogCalls?: number

  /**
   * The maximum byte number to log during simulation
   */
  maxLogSize?: number

  /**
   * The extra opcode budget added to each transaction group during simulation
   */
  extraOpcodeBudget?: number

  /**
   * If true, signers for transactions that are missing signatures will be fixed during evaluation.
   */
  fixSigners?: boolean
}

export const SimulationEvalOverridesMeta: ObjectModelMetadata<SimulationEvalOverrides> = {
  name: 'SimulationEvalOverrides',
  kind: 'object',
  fields: [
    {
      name: 'allowEmptySignatures',
      wireKey: 'allow-empty-signatures',
      optional: true,
      codec: booleanCodec,
    },
    {
      name: 'allowUnnamedResources',
      wireKey: 'allow-unnamed-resources',
      optional: true,
      codec: booleanCodec,
    },
    {
      name: 'maxLogCalls',
      wireKey: 'max-log-calls',
      optional: true,
      codec: numberCodec,
    },
    {
      name: 'maxLogSize',
      wireKey: 'max-log-size',
      optional: true,
      codec: numberCodec,
    },
    {
      name: 'extraOpcodeBudget',
      wireKey: 'extra-opcode-budget',
      optional: true,
      codec: numberCodec,
    },
    {
      name: 'fixSigners',
      wireKey: 'fix-signers',
      optional: true,
      codec: booleanCodec,
    },
  ],
}
