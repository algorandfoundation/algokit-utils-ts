import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { SimulateTransactionResult } from './simulate-transaction-result'
import { SimulateTransactionResultMeta } from './simulate-transaction-result'
import type { SimulateUnnamedResourcesAccessed } from './simulate-unnamed-resources-accessed'
import { SimulateUnnamedResourcesAccessedMeta } from './simulate-unnamed-resources-accessed'

/**
 * Simulation result for an atomic transaction group
 */
export type SimulateTransactionGroupResult = {
  /**
   * Simulation result for individual transactions
   */
  txnResults: SimulateTransactionResult[]

  /**
   * If present, indicates that the transaction group failed and specifies why that happened
   */
  failureMessage?: string

  /**
   * If present, indicates which transaction in this group caused the failure. This array represents the path to the failing transaction. Indexes are zero based, the first element indicates the top-level transaction, and successive elements indicate deeper inner transactions.
   */
  failedAt?: number[]

  /**
   * Total budget added during execution of app calls in the transaction group.
   */
  appBudgetAdded?: number

  /**
   * Total budget consumed during execution of app calls in the transaction group.
   */
  appBudgetConsumed?: number
  unnamedResourcesAccessed?: SimulateUnnamedResourcesAccessed
}

export const SimulateTransactionGroupResultMeta: ObjectModelMetadata = {
  name: 'SimulateTransactionGroupResult',
  kind: 'object',
  fields: [
    {
      name: 'txnResults',
      wireKey: 'txn-results',
      optional: false,
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(SimulateTransactionResultMeta)),
    },
    {
      name: 'failureMessage',
      wireKey: 'failure-message',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'failedAt',
      wireKey: 'failed-at',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(stringCodec),
    },
    {
      name: 'appBudgetAdded',
      wireKey: 'app-budget-added',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'appBudgetConsumed',
      wireKey: 'app-budget-consumed',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'unnamedResourcesAccessed',
      wireKey: 'unnamed-resources-accessed',
      optional: true,
      nullable: false,
      codec: new ModelCodec(SimulateUnnamedResourcesAccessedMeta),
    },
  ],
}
