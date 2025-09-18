import type { AvmKeyValue } from "./index";

/**
 * An application's global/local/box state.
 */
export type ApplicationKvstorage = {
  /**
   * Key-Value pairs representing application states.
   */
  kvs: AvmKeyValue[];

  /**
   * The address of the account associated with the local state.
   */
  account?: string;
};
