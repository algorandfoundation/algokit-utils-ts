import type { ModelMetadata } from '../core/model-runtime'

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
  maxLogCalls?: bigint

  /**
   * The maximum byte number to log during simulation
   */
  maxLogSize?: bigint

  /**
   * The extra opcode budget added to each transaction group during simulation
   */
  extraOpcodeBudget?: bigint

  /**
   * If true, signers for transactions that are missing signatures will be fixed during evaluation.
   */
  fixSigners?: boolean
}

export const SimulationEvalOverridesMeta: ModelMetadata = {
  name: 'SimulationEvalOverrides',
  kind: 'object',
  fields: [
    {
      name: 'allowEmptySignatures',
      wireKey: 'allow-empty-signatures',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'allowUnnamedResources',
      wireKey: 'allow-unnamed-resources',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'maxLogCalls',
      wireKey: 'max-log-calls',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'maxLogSize',
      wireKey: 'max-log-size',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'extraOpcodeBudget',
      wireKey: 'extra-opcode-budget',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'fixSigners',
      wireKey: 'fix-signers',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
