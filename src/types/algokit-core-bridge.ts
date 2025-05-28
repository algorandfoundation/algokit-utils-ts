import * as algodApi from '@algorandfoundation/algokit-algod-api'
import { addressFromString, Transaction as AlgokitCoreTransaction, encodeTransactionRaw } from '@algorandfoundation/algokit-transact'
import algosdk, { Address, TokenHeader } from 'algosdk'
import { CommonTransactionParams } from './composer'

function getAlgokitCoreAddress(address: string | Address) {
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
  if (params.staticFee !== undefined) {
    suggestedParams.fee = params.staticFee.microAlgo
    suggestedParams.flatFee = true
  }

  const txn: AlgokitCoreTransaction = {
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
    payment: {
      amount: BigInt(amount),
      receiver: getAlgokitCoreAddress(receiver),
      closeRemainderTo: closeRemainderTo ? getAlgokitCoreAddress(closeRemainderTo) : undefined,
    },
  }

  let fee = BigInt(suggestedParams.fee)
  if (!suggestedParams.flatFee) {
    const minFee = BigInt(suggestedParams.minFee)
    const numAddlBytesAfterSigning = 75
    const estimateTxnSize = encodeTransactionRaw(txn).length + numAddlBytesAfterSigning

    fee *= BigInt(estimateTxnSize)
    // If suggested fee too small and will be rejected, set to min tx fee
    if (fee < minFee) {
      fee = minFee
    }
  }
  txn.fee = fee

  if (params.extraFee) txn.fee += params.extraFee.microAlgo
  if (params.maxFee !== undefined && txn.fee > params.maxFee.microAlgo) {
    throw Error(`Transaction fee ${txn.fee} µALGO is greater than maxFee ${params.maxFee}`)
  }

  return algosdk.decodeUnsignedTransaction(encodeTransactionRaw(txn))
}

export class TokenHeaderAuthenticationMethod implements algodApi.SecurityAuthentication {
  private _header: string
  private _key: string

  public constructor(tokenHeader: TokenHeader) {
    if (Object.entries(tokenHeader).length === 0) {
      throw new Error('Cannot construct empty token header auth')
    }

    const [header, key] = Object.entries(tokenHeader)[0]
    this._header = header
    this._key = key
  }

  public getName(): string {
    return 'custom_header'
  }

  public applySecurityAuthentication(context: algodApi.RequestContext) {
    context.setHeaderParam(this._header, this._key)
  }
}

export function buildAlgoKitCoreAlgodClient(baseUrl: URL, tokenHeader: TokenHeader): algodApi.AlgodApi {
  const authMethodConfig = Object.entries(tokenHeader).length > 0 ? new TokenHeaderAuthenticationMethod(tokenHeader) : undefined
  const authConfig: algodApi.AuthMethodsConfiguration = { default: authMethodConfig }

  // Create configuration parameter object
  const fixedBaseUrl = baseUrl.toString().replace(/\/+$/, '')
  const serverConfig = new algodApi.ServerConfiguration(fixedBaseUrl, {})
  const configurationParameters = {
    httpApi: new algodApi.IsomorphicFetchHttpLibrary(),
    baseServer: serverConfig,
    authMethods: authConfig,
    promiseMiddleware: [],
  }

  // Convert to actual configuration
  const config = algodApi.createConfiguration(configurationParameters)
  return new algodApi.AlgodApi(config)
}
