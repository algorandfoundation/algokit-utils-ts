import type { AlgokitSignedTransaction } from "./index";

/**
 * A transaction group to simulate.
 */
export type SimulateRequestTransactionGroup = {
  /**
   * An atomic transaction group.
   */
  txns: AlgokitSignedTransaction[];
};
