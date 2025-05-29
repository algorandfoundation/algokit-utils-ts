import * as algodApi from '@algorandfoundation/algokit-algod-api'
import {
  addressFromString,
  Transaction as AlgoKitCoreTransaction,
  assignFee,
  encodeTransactionRaw,
} from '@algorandfoundation/algokit-transact'
import algosdk, { Address, TokenHeader } from 'algosdk'
import { CommonTransactionParams } from './composer'

function getAlgoKitCoreAddress(address: string | Address) {
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
