import * as algodApi from '@algorand/algod-client'
import { addressFromString, Transaction as AlgokitCoreTransaction, encodeTransactionRaw } from 'algokit_transact'
import algosdk, { Address, TokenHeader } from 'algosdk'

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

export class TokenHeaderAuthenticationMethod implements algodApi.SecurityAuthentication {
  private _header: string
  private _key: string

  public constructor(tokenHeader: TokenHeader) {
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

export function buildAlgoKitCoreAlgodClient(baseUrl: string, tokenHeader: TokenHeader): algodApi.AlgodApi {
  const authMethodConfig = new TokenHeaderAuthenticationMethod(tokenHeader)
  const authConfig: algodApi.AuthMethodsConfiguration = {
    default: authMethodConfig,
  }

  // Create configuration parameter object
  const fixedBaseUrl = baseUrl.replace(/\/+$/, '')
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
