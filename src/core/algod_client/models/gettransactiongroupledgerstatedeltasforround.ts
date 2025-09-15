import type { LedgerStateDeltaForTransactionGroup } from "./index";

export type GetTransactionGroupLedgerStateDeltasForRound = {
  deltas: LedgerStateDeltaForTransactionGroup[];
};
