import type { LedgerStateDelta } from "./index";

/**
 * Contains a ledger delta for a single transaction group
 */
export type LedgerStateDeltaForTransactionGroup = {
  delta: LedgerStateDelta;
  ids: string[];
};
