/**
 * Represents a payment transaction that transfers ALGO between accounts.
 *
 * Payment transactions are used to transfer ALGO between accounts.
 */
export type PaymentTransactionFields = {
  /**
   * The address of the account receiving the ALGO payment.
   */
  receiver: string

  /**
   * The amount of microALGO to send.
   *
   * Specified in microALGO (1 ALGO = 1,000,000 microALGO).
   */
  amount: bigint

  /**
   * Optional address to send all remaining funds to after the transfer.
   *
   * If specified, this indicates that the sender account should be closed after the transaction,
   * and all remaining funds (minus fees) should be transferred to the specified address.
   * This effectively removes the sender account from the ledger.
   */
  closeRemainderTo?: string
}
