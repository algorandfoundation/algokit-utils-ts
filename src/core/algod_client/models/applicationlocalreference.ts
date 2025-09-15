/**
 * References an account's local state for an application.
 */
export type ApplicationLocalReference = {
  /**
   * Address of the account with the local state.
   */
  account: string;

  /**
   * Application ID of the local state application.
   */
  app: bigint;
};
