import type { AlgokitSignedTransaction } from "./index";

/**
 * PendingTransactions is an array of signed transactions exactly as they were submitted.
 */
export type GetPendingTransactionsByAddress = {
  /**
   * An array of signed transaction objects.
   */
  topTransactions: AlgokitSignedTransaction[];

  /**
   * Total number of transactions in the pool.
   */
  totalTransactions: bigint;
};
