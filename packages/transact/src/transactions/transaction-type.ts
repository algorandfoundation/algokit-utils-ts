/**
 * Supported transaction types
 */
export enum TransactionType {
  /**
   * Payment transaction
   */
  Payment = 'pay',
  /**
   * Key registration transaction
   */
  KeyRegistration = 'keyreg',
  /**
   * Asset configuration transaction
   */
  AssetConfig = 'acfg',
  /**
   * Asset transfer transaction
   */
  AssetTransfer = 'axfer',
  /**
   * Asset freeze transaction
   */
  AssetFreeze = 'afrz',
  /**
   * Application transaction
   */
  AppCall = 'appl',
  /**
   * State proof transaction
   */
  StateProof = 'stpf',
  /**
   * Heartbeat transaction
   */
  Heartbeat = 'hb',
  /**
   * Unknown transaction type
   * Used when decoding transactions with unrecognized type values.
   * This should not be used when creating new transactions.
   */
  Unknown = 'unknown',
}
