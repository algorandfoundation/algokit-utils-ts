import {
  addressFromString,
  Transaction as AlgoKitCoreTransaction,
  assignFee,
  encodeTransactionRaw,
} from '@algorandfoundation/algokit-transact'
import algosdk, { Address } from 'algosdk'
import { CommonTransactionParams } from '../types/composer'

export function getAlgoKitCoreAddress(address: string | Address) {
  return addressFromString(typeof address === 'string' ? address : address.toString())
}

// Experimental feature to build algosdk payment transactions with algokit-core
export function buildPayment(
  params: CommonTransactionParams,
  {
    sender,
    receiver,
    amount,
    closeRemainderTo,
    rekeyTo,
    note,
    lease,
    suggestedParams,
  }: algosdk.PaymentTransactionParams & algosdk.CommonTransactionParams,
) {
  const staticFee = params.staticFee ? params.staticFee.microAlgo : suggestedParams.flatFee ? BigInt(suggestedParams.fee) : undefined

  const baseTxn: AlgoKitCoreTransaction = {
    sender: getAlgoKitCoreAddress(sender),
    transactionType: 'Payment',
    fee: staticFee,
    firstValid: BigInt(suggestedParams.firstValid),
    lastValid: BigInt(suggestedParams.lastValid),
    genesisHash: suggestedParams.genesisHash,
    genesisId: suggestedParams.genesisID,
    rekeyTo: rekeyTo ? getAlgoKitCoreAddress(rekeyTo) : undefined,
    note: note,
    lease: lease,
    payment: {
      amount: BigInt(amount),
      receiver: getAlgoKitCoreAddress(receiver),
      closeRemainderTo: closeRemainderTo ? getAlgoKitCoreAddress(closeRemainderTo) : undefined,
    },
  }

  if (baseTxn.fee !== undefined) {
    return algosdk.decodeUnsignedTransaction(encodeTransactionRaw(baseTxn))
  } else {
    const txn = assignFee(baseTxn, {
      feePerByte: BigInt(suggestedParams.fee),
      minFee: BigInt(suggestedParams.minFee),
      maxFee: params.maxFee?.microAlgo,
      extraFee: params.extraFee?.microAlgo,
    })
    return algosdk.decodeUnsignedTransaction(encodeTransactionRaw(txn))
  }
}
