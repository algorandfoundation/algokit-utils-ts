import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  numberCodec,
  bigIntCodec,
  ArrayCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { SimulateInitialStates } from './simulate-initial-states'
import { SimulateInitialStatesMeta } from './simulate-initial-states'
import type { SimulateTraceConfig } from './simulate-trace-config'
import { SimulateTraceConfigMeta } from './simulate-trace-config'
import type { SimulateTransactionGroupResult } from './simulate-transaction-group-result'
import { SimulateTransactionGroupResultMeta } from './simulate-transaction-group-result'
import type { SimulationEvalOverrides } from './simulation-eval-overrides'
import { SimulationEvalOverridesMeta } from './simulation-eval-overrides'

export type SimulateTransaction = {
  /**
   * The version of this response object.
   */
  version: number

  /**
   * The round immediately preceding this simulation. State changes through this round were used to run this simulation.
   */
  lastRound: bigint

  /**
   * A result object for each transaction group that was simulated.
   */
  txnGroups: SimulateTransactionGroupResult[]
  evalOverrides?: SimulationEvalOverrides
  execTraceConfig?: SimulateTraceConfig
  initialStates?: SimulateInitialStates
}

export const SimulateTransactionMeta: ObjectModelMetadata<SimulateTransaction> = {
  name: 'SimulateTransaction',
  kind: 'object',
  fields: [
    {
      name: 'version',
      wireKey: 'version',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'lastRound',
      wireKey: 'last-round',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'txnGroups',
      wireKey: 'txn-groups',
      optional: false,
      codec: new ArrayCodec(new ObjectModelCodec(SimulateTransactionGroupResultMeta)),
    },
    {
      name: 'evalOverrides',
      wireKey: 'eval-overrides',
      optional: true,
      codec: new ObjectModelCodec(SimulationEvalOverridesMeta),
    },
    {
      name: 'execTraceConfig',
      wireKey: 'exec-trace-config',
      optional: true,
      codec: new ObjectModelCodec(SimulateTraceConfigMeta),
    },
    {
      name: 'initialStates',
      wireKey: 'initial-states',
      optional: true,
      codec: new ObjectModelCodec(SimulateInitialStatesMeta),
    },
  ],
}
