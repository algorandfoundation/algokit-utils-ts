import type { ApplicationStateSchema, TealKeyValueStore } from "./index";

/**
 * Stores local state associated with an application.
 */
export type ApplicationLocalState = {
  /**
   * The application which this local state is for.
   */
  id: bigint;
  schema: ApplicationStateSchema;
  keyValue?: TealKeyValueStore;
};
