import { encodeTransactionRaw, Transaction } from '@algorandfoundation/algokit-transact'
import algosdk from 'algosdk'

export type TransactionSigner = (txnGroup: Transaction[], indexesToSign: number[]) => Promise<Uint8Array[]>

export const transactionSigner = (algosdkSigner: algosdk.TransactionSigner, txnGroup: Transaction[], indexesToSign: number[]) => {
  const unsignedAlgosdkTxns = txnGroup.map((txn) => encodeTransactionRaw(txn)).map((bytes) => algosdk.decodeUnsignedTransaction(bytes))

  return algosdkSigner(unsignedAlgosdkTxns, indexesToSign)
}

export const getSignerFromAlgosdkSinger = (algosdkSigner: algosdk.TransactionSigner) => {
  return (txnGroup: Transaction[], indexesToSign: number[]) => {
    const unsignedAlgosdkTxns = txnGroup.map((txn) => encodeTransactionRaw(txn)).map((bytes) => algosdk.decodeUnsignedTransaction(bytes))

    return algosdkSigner(unsignedAlgosdkTxns, indexesToSign)
  }
}
