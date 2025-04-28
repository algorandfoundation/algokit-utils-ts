import * as algodApi from '@algorand/algod-client'
import { addressFromString, Transaction as AlgokitCoreTransaction, encodeTransactionRaw } from 'algokit_transact'
import algosdk, { Address } from 'algosdk'

function getAlgokitCoreAddress(address: string | Address) {
  return addressFromString(typeof address === 'string' ? address : address.toString())
}

// Experimental feature to build algosdk payment transactions with algokit-core
export function buildPayment({
  sender,
  receiver,
  amount,
  closeRemainderTo,
  rekeyTo,
  note,
  lease,
  suggestedParams,
}: algosdk.PaymentTransactionParams & algosdk.CommonTransactionParams) {
  const txnModel: AlgokitCoreTransaction = {
    header: {
      sender: getAlgokitCoreAddress(sender),
      transactionType: 'Payment',
      fee: BigInt(suggestedParams.fee),
      firstValid: BigInt(suggestedParams.firstValid),
      lastValid: BigInt(suggestedParams.lastValid),
      genesisHash: suggestedParams.genesisHash,
      genesisId: suggestedParams.genesisID,
      rekeyTo: rekeyTo ? getAlgokitCoreAddress(rekeyTo) : undefined,
      note: note,
      lease: lease,
    },
    payFields: {
      amount: BigInt(amount),
      receiver: getAlgokitCoreAddress(receiver),
      closeRemainderTo: closeRemainderTo ? getAlgokitCoreAddress(closeRemainderTo) : undefined,
    },
  }

  let fee = BigInt(suggestedParams.fee)
  if (!suggestedParams.flatFee) {
    const minFee = BigInt(suggestedParams.minFee)
    const numAddlBytesAfterSigning = 75
    const estimateTxnSize = encodeTransactionRaw(txnModel).length + numAddlBytesAfterSigning

    fee *= BigInt(estimateTxnSize)
    // If suggested fee too small and will be rejected, set to min tx fee
    if (fee < minFee) {
      fee = minFee
    }
  }
  txnModel.header.fee = fee

  return algosdk.decodeUnsignedTransaction(encodeTransactionRaw(txnModel))
}

export function sendRawTransaction(signedTxn: Uint8Array) {
  // Covers all auth methods included in your OpenAPI yaml definition
  const authConfig: algodApi.AuthMethodsConfiguration = {
    api_key: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  }

  // Create configuration parameter object
  const serverConfig = new algodApi.ServerConfiguration('http://localhost:4001', {})
  const configurationParameters = {
    httpApi: new algodApi.IsomorphicFetchHttpLibrary(), // Can also be ignored - default is usually fine
    baseServer: serverConfig, // First server is default
    authMethods: authConfig, // No auth is default
    promiseMiddleware: [],
  }

  // Convert to actual configuration
  const config = algodApi.createConfiguration(configurationParameters)
  const api = new algodApi.AlgodApi(config)

  const httpFile = new File([signedTxn], '', { type: 'application/x-binary' })
  return api.rawTransaction(httpFile)
}
