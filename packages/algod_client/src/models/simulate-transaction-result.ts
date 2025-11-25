import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  numberCodec,
  addressCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
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

export const SimulateTransactionResultMeta: ObjectModelMetadata = {
  name: 'SimulateTransactionResult',
  kind: 'object',
  fields: [
    {
      name: 'txnResult',
      wireKey: 'txn-result',
      optional: false,
      codec: new ObjectModelCodec(PendingTransactionResponseMeta),
    },
    {
      name: 'appBudgetConsumed',
      wireKey: 'app-budget-consumed',
      optional: true,
      codec: numberCodec,
    },
    {
      name: 'logicSigBudgetConsumed',
      wireKey: 'logic-sig-budget-consumed',
      optional: true,
      codec: numberCodec,
    },
    {
      name: 'execTrace',
      wireKey: 'exec-trace',
      optional: true,
      codec: new ObjectModelCodec(SimulationTransactionExecTraceMeta),
    },
    {
      name: 'unnamedResourcesAccessed',
      wireKey: 'unnamed-resources-accessed',
      optional: true,
      codec: new ObjectModelCodec(SimulateUnnamedResourcesAccessedMeta),
    },
    {
      name: 'fixedSigner',
      wireKey: 'fixed-signer',
      optional: true,
      codec: addressCodec,
    },
  ],
}
