import type { EvalDelta } from "./index";

/**
 * Key-value pairs for StateDelta.
 */
export type EvalDeltaKeyValue = {
  key: string;
  value: EvalDelta;
};
