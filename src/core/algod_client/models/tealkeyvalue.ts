import type { TealValue } from "./index";

/**
 * Represents a key-value pair in an application store.
 */
export type TealKeyValue = {
  key: string;
  value: TealValue;
};
