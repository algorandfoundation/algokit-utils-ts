import type { SimulateTransactionResult, SimulateUnnamedResourcesAccessed } from "./index";

/**
 * Simulation result for an atomic transaction group
 */
export type SimulateTransactionGroupResult = {
  /**
   * Simulation result for individual transactions
   */
  txnResults: SimulateTransactionResult[];

  /**
   * If present, indicates that the transaction group failed and specifies why that happened
   */
  failureMessage?: string;

  /**
   * If present, indicates which transaction in this group caused the failure. This array represents the path to the failing transaction. Indexes are zero based, the first element indicates the top-level transaction, and successive elements indicate deeper inner transactions.
   */
  failedAt?: bigint[];

  /**
   * Total budget added during execution of app calls in the transaction group.
   */
  appBudgetAdded?: bigint;

  /**
   * Total budget consumed during execution of app calls in the transaction group.
   */
  appBudgetConsumed?: bigint;
  unnamedResourcesAccessed?: SimulateUnnamedResourcesAccessed;
};
