import type { ApplicationInitialStates } from "./index";

/**
 * Initial states of resources that were accessed during simulation.
 */
export type SimulateInitialStates = {
  /**
   * The initial states of accessed application before simulation. The order of this array is arbitrary.
   */
  appInitialStates?: ApplicationInitialStates[];
};
