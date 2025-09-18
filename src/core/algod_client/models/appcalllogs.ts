/**
 * The logged messages from an app call along with the app ID and outer transaction ID. Logs appear in the same order that they were emitted.
 */
export type AppCallLogs = {
  /**
   * An array of logs
   */
  logs: string[];

  /**
   * The application from which the logs were generated
   */
  applicationIndex: bigint;

  /**
   * The transaction ID of the outer app call that lead to these logs
   */
  txId: string;
};
