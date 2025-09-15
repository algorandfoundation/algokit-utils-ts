import type { StateDelta } from "./index";

/**
 * Application state delta.
 */
export type AccountStateDelta = {
  address: string;
  delta: StateDelta;
};
