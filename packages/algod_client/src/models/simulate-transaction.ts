import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
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

export const SimulateTransactionMeta: ModelMetadata = {
  name: 'SimulateTransaction',
  kind: 'object',
  fields: [
    {
      name: 'version',
      wireKey: 'version',
      optional: false,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'lastRound',
      wireKey: 'last-round',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'txnGroups',
      wireKey: 'txn-groups',
      optional: false,
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(SimulateTransactionGroupResultMeta)),
    },
    {
      name: 'evalOverrides',
      wireKey: 'eval-overrides',
      optional: true,
      nullable: false,
      codec: new ModelCodec(SimulationEvalOverridesMeta),
    },
    {
      name: 'execTraceConfig',
      wireKey: 'exec-trace-config',
      optional: true,
      nullable: false,
      codec: new ModelCodec(SimulateTraceConfigMeta),
    },
    {
      name: 'initialStates',
      wireKey: 'initial-states',
      optional: true,
      nullable: false,
      codec: new ModelCodec(SimulateInitialStatesMeta),
    },
  ],
}
