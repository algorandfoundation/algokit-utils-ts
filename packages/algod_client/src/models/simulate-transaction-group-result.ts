import type { ModelMetadata } from '../core/model-runtime'
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
  failedAt?: bigint[]

  /**
   * Total budget added during execution of app calls in the transaction group.
   */
  appBudgetAdded?: bigint

  /**
   * Total budget consumed during execution of app calls in the transaction group.
   */
  appBudgetConsumed?: bigint
  unnamedResourcesAccessed?: SimulateUnnamedResourcesAccessed
}

export const SimulateTransactionGroupResultMeta: ModelMetadata = {
  name: 'SimulateTransactionGroupResult',
  kind: 'object',
  fields: [
    {
      name: 'txnResults',
      wireKey: 'txn-results',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => SimulateTransactionResultMeta } },
    },
    {
      name: 'failureMessage',
      wireKey: 'failure-message',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'failedAt',
      wireKey: 'failed-at',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar' } },
    },
    {
      name: 'appBudgetAdded',
      wireKey: 'app-budget-added',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'appBudgetConsumed',
      wireKey: 'app-budget-consumed',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'unnamedResourcesAccessed',
      wireKey: 'unnamed-resources-accessed',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => SimulateUnnamedResourcesAccessedMeta },
    },
  ],
}
