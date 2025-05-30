import * as algodApi from '@algorandfoundation/algokit-algod-api'
import { PromiseAlgodApi as AlgodApi } from '@algorandfoundation/algokit-algod-api/types/PromiseAPI'
import algosdk, { TokenHeader } from 'algosdk'
import { AlgoHttpClientWithRetry } from '../types/algo-http-client-with-retry'
import { AlgoClientConfig } from '../types/network-client'
import { PendingTransactionInformationProxy, PendingTransactionInformationRequest } from './algod-request-proxies/pending-transaction-info'
import { SendRawTransactionProxy, SendRawTransactionRequest } from './algod-request-proxies/send-raw-transaction'
import { SuggestedParamsProxy, SuggestedParamsRequest } from './algod-request-proxies/suggested-params'

// TODO: comment
// This is the wrapper for algosdk.algod and algod-api
export class AlgodClient extends algosdk.Algodv2 {
  private _algoKitCoreAlgod: AlgodApi

  constructor(config: AlgoClientConfig) {
    const { token, server, port } = config
    const tokenHeader = typeof token === 'string' ? { 'X-Algo-API-Token': token } : (token ?? {})
    const httpClientWithRetry = new AlgoHttpClientWithRetry(tokenHeader, server, port)
    super(httpClientWithRetry, server)

    this._algoKitCoreAlgod = buildAlgoKitCoreAlgodClient(this.buildBaseServerUrl(server, port), tokenHeader)
  }

  private buildBaseServerUrl(baseServer: string, port?: string | number) {
    // This logic is copied from algosdk to make sure that we have the same base server config

    // Append a trailing slash so we can use relative paths. Without the trailing
    // slash, the last path segment will be replaced by the relative path. See
    // usage in `addressWithPath`.
    const fixedBaseServer = baseServer.endsWith('/') ? baseServer : `${baseServer}/`
    const baseServerURL = new URL(fixedBaseServer)
    if (typeof port !== 'undefined') {
      baseServerURL.port = port.toString()
    }

    return baseServerURL
  }

  sendRawTransaction(stxOrStxs: Uint8Array | Uint8Array[]): SendRawTransactionRequest {
    const request = super.sendRawTransaction(stxOrStxs)
    return new Proxy<SendRawTransactionRequest>(request, new SendRawTransactionProxy(this._algoKitCoreAlgod, stxOrStxs))
  }

  pendingTransactionInformation(txid: string): PendingTransactionInformationRequest {
    const request = super.pendingTransactionInformation(txid)
    return new Proxy<PendingTransactionInformationRequest>(request, new PendingTransactionInformationProxy(this._algoKitCoreAlgod, txid))
  }

  getTransactionParams(): SuggestedParamsRequest {
    const request = super.getTransactionParams()
    return new Proxy<SuggestedParamsRequest>(request, new SuggestedParamsProxy(this._algoKitCoreAlgod))
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
