import { encodeTransactionRaw, Transaction } from '@algorandfoundation/algokit-transact'
import algosdk from 'algosdk'

export type TransactionSigner = (txnGroup: Transaction[], indexesToSign: number[]) => Uint8Array[]

export const transactionSigner = (algosdkSigner: algosdk.TransactionSigner, txnGroup: Transaction[], indexesToSign: number[]) => {
  const unsignedAlgosdkTxns = txnGroup.map((txn) => encodeTransactionRaw(txn)).map((bytes) => algosdk.decodeUnsignedTransaction(bytes))

  return algosdkSigner(unsignedAlgosdkTxns, indexesToSign)
}
