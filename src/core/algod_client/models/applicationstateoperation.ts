import type { AvmValue } from "./index";

/**
 * An operation against an application's global/local/box state.
 */
export type ApplicationStateOperation = {
  /**
   * Operation type. Value `w` is **write**, `d` is **delete**.
   */
  operation: string;

  /**
   * Type of application state. Value `g` is **global state**, `l` is **local state**, `b` is **boxes**.
   */
  appStateType: string;

  /**
   * The key (name) of the global/local/box state.
   */
  key: string;
  newValue?: AvmValue;

  /**
   * For local state changes, the address of the account associated with the local state.
   */
  account?: string;
};
