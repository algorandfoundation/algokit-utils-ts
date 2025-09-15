import type { ApplicationStateSchema, TealKeyValueStore } from "./index";

/**
 * Stores the global information associated with an application.
 */
export type ApplicationParams = {
  /**
   * The address that created this application. This is the address where the parameters and global state for this application can be found.
   */
  creator: string;

  /**
   * \[approv\] approval program.
   */
  approvalProgram: string;

  /**
   * \[clearp\] approval program.
   */
  clearStateProgram: string;

  /**
   * \[epp\] the amount of extra program pages available to this app.
   */
  extraProgramPages?: bigint;
  localStateSchema?: ApplicationStateSchema;
  globalStateSchema?: ApplicationStateSchema;
  globalState?: TealKeyValueStore;

  /**
   * \[v\] the number of updates to the application programs
   */
  version?: bigint;
};
