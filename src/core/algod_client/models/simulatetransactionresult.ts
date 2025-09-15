import type { PendingTransactionResponse, SimulateUnnamedResourcesAccessed, SimulationTransactionExecTrace } from "./index";

/**
 * Simulation result for an individual transaction
 */
export type SimulateTransactionResult = {
  txnResult: PendingTransactionResponse;

  /**
   * Budget used during execution of an app call transaction. This value includes budged used by inner app calls spawned by this transaction.
   */
  appBudgetConsumed?: bigint;

  /**
   * Budget used during execution of a logic sig transaction.
   */
  logicSigBudgetConsumed?: bigint;
  execTrace?: SimulationTransactionExecTrace;
  unnamedResourcesAccessed?: SimulateUnnamedResourcesAccessed;

  /**
   * The account that needed to sign this transaction when no signature was provided and the provided signer was incorrect.
   */
  fixedSigner?: string;
};
