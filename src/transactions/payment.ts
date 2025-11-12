import { Transaction, TransactionType } from '@algorandfoundation/algokit-transact'
import { Address } from '@algorandfoundation/sdk'
import { AlgoAmount } from '../types/amount'
import { CommonTransactionParams, TransactionHeader } from './common'

/** Parameters to define a payment transaction. */
export type PaymentParams = CommonTransactionParams & {
  /** The address of the account that will receive the Algo */
  receiver: string | Address
  /** Amount to send */
  amount: AlgoAmount
  /** If given, close the sender account and send the remaining balance to this address
   *
   * *Warning:* Be careful with this parameter as it can lead to loss of funds if not used correctly.
   */
  closeRemainderTo?: string | Address
}

export const buildPayment = (params: PaymentParams, header: TransactionHeader): Transaction => {
  return {
    ...header,
    type: TransactionType.Payment,
    payment: {
      receiver: params.receiver.toString(),
      amount: params.amount.microAlgos,
    },
  }
}
