import { SuggestedParams } from '@algorandfoundation/algokit-algod-client'
import { ReadableAddress, getAddress, getOptionalAddress } from '@algorandfoundation/algokit-common'
import { Transaction, TransactionType } from '@algorandfoundation/algokit-transact'
import { AlgoAmount } from '../types/amount'
import { CommonTransactionParams, buildTransactionCommonData } from './common'

/** Parameters to define a payment transaction. */
export type PaymentParams = CommonTransactionParams & {
  /** The address of the account that will receive the Algo */
  receiver: ReadableAddress
  /** Amount to send */
  amount: AlgoAmount
  /** If given, close the sender account and send the remaining balance to this address
   *
   * *Warning:* Be careful with this parameter as it can lead to loss of funds if not used correctly.
   */
  closeRemainderTo?: ReadableAddress
}

export const buildPayment = (params: PaymentParams, suggestedParams: SuggestedParams, defaultValidityWindow: bigint): Transaction => {
  const commonData = buildTransactionCommonData(params, suggestedParams, defaultValidityWindow)
  return new Transaction({
    ...commonData,
    type: TransactionType.Payment,
    payment: {
      receiver: getAddress(params.receiver),
      amount: params.amount.microAlgos,
      closeRemainderTo: getOptionalAddress(params.closeRemainderTo),
    },
  })
}
