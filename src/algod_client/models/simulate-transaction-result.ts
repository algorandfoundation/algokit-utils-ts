import type { ModelMetadata } from '../core/model-runtime'
import type { PendingTransactionResponse } from './pending-transaction-response'
import { PendingTransactionResponseMeta } from './pending-transaction-response'
import type { SimulateUnnamedResourcesAccessed } from './simulate-unnamed-resources-accessed'
import { SimulateUnnamedResourcesAccessedMeta } from './simulate-unnamed-resources-accessed'
import type { SimulationTransactionExecTrace } from './simulation-transaction-exec-trace'
import { SimulationTransactionExecTraceMeta } from './simulation-transaction-exec-trace'

/**
 * Simulation result for an individual transaction
 */
export type SimulateTransactionResult = {
  txnResult: PendingTransactionResponse

  /**
   * Budget used during execution of an app call transaction. This value includes budged used by inner app calls spawned by this transaction.
   */
  appBudgetConsumed?: number

  /**
   * Budget used during execution of a logic sig transaction.
   */
  logicSigBudgetConsumed?: number
  execTrace?: SimulationTransactionExecTrace
  unnamedResourcesAccessed?: SimulateUnnamedResourcesAccessed

  /**
   * The account that needed to sign this transaction when no signature was provided and the provided signer was incorrect.
   */
  fixedSigner?: string
}

export const SimulateTransactionResultMeta: ModelMetadata = {
  name: 'SimulateTransactionResult',
  kind: 'object',
  fields: [
    {
      name: 'txnResult',
      wireKey: 'txn-result',
      optional: false,
      nullable: false,
      type: { kind: 'model', meta: () => PendingTransactionResponseMeta },
    },
    {
      name: 'appBudgetConsumed',
      wireKey: 'app-budget-consumed',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'logicSigBudgetConsumed',
      wireKey: 'logic-sig-budget-consumed',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'execTrace',
      wireKey: 'exec-trace',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => SimulationTransactionExecTraceMeta },
    },
    {
      name: 'unnamedResourcesAccessed',
      wireKey: 'unnamed-resources-accessed',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => SimulateUnnamedResourcesAccessedMeta },
    },
    {
      name: 'fixedSigner',
      wireKey: 'fixed-signer',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
