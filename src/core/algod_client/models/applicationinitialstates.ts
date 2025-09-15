import type { ApplicationKvstorage } from "./index";

/**
 * An application's initial global/local/box states that were accessed during simulation.
 */
export type ApplicationInitialStates = {
  /**
   * Application index.
   */
  id: bigint;

  /**
   * An application's initial local states tied to different accounts.
   */
  appLocals?: ApplicationKvstorage[];
  appGlobals?: ApplicationKvstorage;
  appBoxes?: ApplicationKvstorage;
};
