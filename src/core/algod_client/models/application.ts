import type { ApplicationParams } from "./index";

/**
 * Application index and its parameters
 */
export type Application = {
  /**
   * \[appidx\] application index.
   */
  id: bigint;
  params: ApplicationParams;
};
