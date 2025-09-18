/**
 * References a box of an application.
 */
export type BoxReference = {
  /**
   * Application ID which this box belongs to
   */
  app: bigint;

  /**
   * Base64 encoded box name
   */
  name: string;
};
