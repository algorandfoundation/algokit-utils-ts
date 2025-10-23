import { Transaction, TransactionType } from '@algorandfoundation/algokit-transact'
import { CommonTransactionParams, ComposerTransactionType, TransactionHeader } from './common'

export type PaymentComposerTransaction = { type: ComposerTransactionType.Payment; data: PaymentParams }
export type AccountCloseComposerTransaction = { type: ComposerTransactionType.AccountClose; data: AccountCloseParams }

/** Parameters for creating a payment transaction */
export type PaymentParams = CommonTransactionParams & {
  /** The address of the account receiving the ALGO payment. */
  receiver: string
  /** The amount of microALGO to send.
   *
   * Specified in microALGO (1 ALGO = 1,000,000 microALGO).
   */
  amount: bigint
}

// Parameters for creating an account close transaction.
export type AccountCloseParams = CommonTransactionParams & {
  /** Close the sender account and send the remaining balance to this address
   *
   * *Warning:* Be careful this can lead to loss of funds if not used correctly.
   */
  closeRemainderTo: string
}

export const buildPayment = (params: PaymentParams, header: TransactionHeader): Transaction => {
  return {
    ...header,
    transactionType: TransactionType.Payment,
    payment: {
      receiver: params.receiver,
      amount: params.amount,
    },
  }
}

export const buildAccountClose = (params: AccountCloseParams, header: TransactionHeader): Transaction => {
  return {
    ...header,
    transactionType: TransactionType.Payment,
    payment: {
      receiver: header.sender,
      amount: 0n,
      closeRemainderTo: params.closeRemainderTo,
    },
  }
}
