import type { ModelMetadata } from '../core/model-runtime'
import type { SimulateRequestTransactionGroup } from './simulate-request-transaction-group'
import { SimulateRequestTransactionGroupMeta } from './simulate-request-transaction-group'
import type { SimulateTraceConfig } from './simulate-trace-config'
import { SimulateTraceConfigMeta } from './simulate-trace-config'

/**
 * Request type for simulation endpoint.
 */
export type SimulateRequest = {
  /**
   * The transaction groups to simulate.
   */
  txnGroups: SimulateRequestTransactionGroup[]

  /**
   * If provided, specifies the round preceding the simulation. State changes through this round will be used to run this simulation. Usually only the 4 most recent rounds will be available (controlled by the node config value MaxAcctLookback). If not specified, defaults to the latest available round.
   */
  round?: bigint

  /**
   * Allows transactions without signatures to be simulated as if they had correct signatures.
   */
  allowEmptySignatures?: boolean

  /**
   * Lifts limits on log opcode usage during simulation.
   */
  allowMoreLogging?: boolean

  /**
   * Allows access to unnamed resources during simulation.
   */
  allowUnnamedResources?: boolean

  /**
   * Applies extra opcode budget during simulation for each transaction group.
   */
  extraOpcodeBudget?: bigint
  execTraceConfig?: SimulateTraceConfig

  /**
   * If true, signers for transactions that are missing signatures will be fixed during evaluation.
   */
  fixSigners?: boolean
}

export const SimulateRequestMeta: ModelMetadata = {
  name: 'SimulateRequest',
  kind: 'object',
  fields: [
    {
      name: 'txnGroups',
      wireKey: 'txn-groups',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => SimulateRequestTransactionGroupMeta } },
    },
    {
      name: 'round',
      wireKey: 'round',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'allowEmptySignatures',
      wireKey: 'allow-empty-signatures',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'allowMoreLogging',
      wireKey: 'allow-more-logging',
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
      name: 'extraOpcodeBudget',
      wireKey: 'extra-opcode-budget',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'execTraceConfig',
      wireKey: 'exec-trace-config',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => SimulateTraceConfigMeta },
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
