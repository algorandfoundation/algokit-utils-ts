import type { ModelMetadata } from '../core/model-runtime'

/**
 * Fields for a payment transaction.
 *
 * Definition:
 * data/transactions/payment.go : PaymentTxnFields
 */
export type TransactionPayment = {
  /**
   * \[amt\] number of MicroAlgos intended to be transferred.
   */
  amount: bigint

  /**
   * Number of MicroAlgos that were sent to the close-remainder-to address when closing the sender account.
   */
  closeAmount?: bigint

  /**
   * \[close\] when set, indicates that the sending account should be closed and all remaining funds be transferred to this address.
   */
  closeRemainderTo?: string

  /**
   * \[rcv\] receiver's address.
   */
  receiver: string
}

export const TransactionPaymentMeta: ModelMetadata = {
  name: 'TransactionPayment',
  kind: 'object',
  fields: [
    {
      name: 'amount',
      wireKey: 'amount',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'closeAmount',
      wireKey: 'close-amount',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'closeRemainderTo',
      wireKey: 'close-remainder-to',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'receiver',
      wireKey: 'receiver',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
