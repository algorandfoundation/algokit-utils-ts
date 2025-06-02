import * as algodApi from '@algorandfoundation/algokit-algod-api'
import { PromiseAlgodApi as AlgodApi } from '@algorandfoundation/algokit-algod-api/types/PromiseAPI'
import algosdk, { TokenHeader } from 'algosdk'
import { AlgoHttpClientWithRetry } from '../types/algo-http-client-with-retry'
import { AlgoClientConfig } from '../types/network-client'
import { PendingTransactionInformationProxy, PendingTransactionInformationRequest } from './algod-request-proxies/pending-transaction-info'
import { SuggestedParamsProxy, SuggestedParamsRequest } from './algod-request-proxies/suggested-params'

/// This component is the wrapper around algosdk.Algod and algod-api Algod
export class AlgodClient extends algosdk.Algodv2 {
  public algoKitCoreAlgod: AlgodApi

  constructor(config: AlgoClientConfig) {
    const { token, server, port } = config
    const tokenHeader = typeof token === 'string' ? { 'X-Algo-API-Token': token } : (token ?? {})
    const httpClientWithRetry = new AlgoHttpClientWithRetry(tokenHeader, server, port)
    super(httpClientWithRetry, server)

    this.algoKitCoreAlgod = buildAlgoKitCoreAlgodClient(this.buildBaseServerUrl(server, port), tokenHeader)
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

  pendingTransactionInformation(txid: string): PendingTransactionInformationRequest {
    const request = super.pendingTransactionInformation(txid)
    return new Proxy<PendingTransactionInformationRequest>(request, new PendingTransactionInformationProxy(this.algoKitCoreAlgod, txid))
  }

  getTransactionParams(): SuggestedParamsRequest {
    const request = super.getTransactionParams()
    return new Proxy<SuggestedParamsRequest>(request, new SuggestedParamsProxy(this.algoKitCoreAlgod))
  }
}

class TokenHeaderAuthenticationMethod implements algodApi.SecurityAuthentication {
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

function buildAlgoKitCoreAlgodClient(baseUrl: URL, tokenHeader: TokenHeader): algodApi.AlgodApi {
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

export const isAlgoKitCoreBridgeAlgodClient = (algod: algosdk.Algodv2): algod is AlgodClient => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !!(algod as any).algoKitCoreAlgod
}
