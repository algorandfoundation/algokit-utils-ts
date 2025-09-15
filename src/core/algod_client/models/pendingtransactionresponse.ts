import type { AccountStateDelta, AlgokitSignedTransaction, StateDelta } from "./index";

/**
 * Details about a pending transaction. If the transaction was recently confirmed, includes confirmation details like the round and reward details.
 */
export type PendingTransactionResponse = {
  /**
   * The asset index if the transaction was found and it created an asset.
   */
  assetIndex?: bigint;

  /**
   * The application index if the transaction was found and it created an application.
   */
  applicationIndex?: bigint;

  /**
   * Rewards in microalgos applied to the close remainder to account.
   */
  closeRewards?: bigint;

  /**
   * Closing amount for the transaction.
   */
  closingAmount?: bigint;

  /**
   * The number of the asset's unit that were transferred to the close-to address.
   */
  assetClosingAmount?: bigint;

  /**
   * The round where this transaction was confirmed, if present.
   */
  confirmedRound?: bigint;

  /**
   * Indicates that the transaction was kicked out of this node's transaction pool (and specifies why that happened).  An empty string indicates the transaction wasn't kicked out of this node's txpool due to an error.
   */
  poolError: string;

  /**
   * Rewards in microalgos applied to the receiver account.
   */
  receiverRewards?: bigint;

  /**
   * Rewards in microalgos applied to the sender account.
   */
  senderRewards?: bigint;

  /**
   * Local state key/value changes for the application being executed by this transaction.
   */
  localStateDelta?: AccountStateDelta[];
  globalStateDelta?: StateDelta;

  /**
   * Logs for the application being executed by this transaction.
   */
  logs?: string[];

  /**
   * Inner transactions produced by application execution.
   */
  innerTxns?: PendingTransactionResponse[];

  /**
   * The raw signed transaction.
   */
  txn: AlgokitSignedTransaction;
};
