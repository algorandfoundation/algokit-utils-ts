import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  numberCodec,
  bigIntCodec,
  booleanCodec,
  ArrayCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
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
  extraOpcodeBudget?: number
  execTraceConfig?: SimulateTraceConfig

  /**
   * If true, signers for transactions that are missing signatures will be fixed during evaluation.
   */
  fixSigners?: boolean
}

export const SimulateRequestMeta: ObjectModelMetadata = {
  name: 'SimulateRequest',
  kind: 'object',
  fields: [
    {
      name: 'txnGroups',
      wireKey: 'txn-groups',
      optional: false,
      codec: new ArrayCodec(new ObjectModelCodec(SimulateRequestTransactionGroupMeta)),
    },
    {
      name: 'round',
      wireKey: 'round',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'allowEmptySignatures',
      wireKey: 'allow-empty-signatures',
      optional: true,
      codec: booleanCodec,
    },
    {
      name: 'allowMoreLogging',
      wireKey: 'allow-more-logging',
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
      name: 'extraOpcodeBudget',
      wireKey: 'extra-opcode-budget',
      optional: true,
      codec: numberCodec,
    },
    {
      name: 'execTraceConfig',
      wireKey: 'exec-trace-config',
      optional: true,
      codec: new ObjectModelCodec(SimulateTraceConfigMeta),
    },
    {
      name: 'fixSigners',
      wireKey: 'fix-signers',
      optional: true,
      codec: booleanCodec,
    },
  ],
}
