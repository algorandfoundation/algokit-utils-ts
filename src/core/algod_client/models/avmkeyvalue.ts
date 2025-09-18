import type { AvmValue } from "./index";

/**
 * Represents an AVM key-value pair in an application store.
 */
export type AvmKeyValue = {
  key: string;
  value: AvmValue;
};
