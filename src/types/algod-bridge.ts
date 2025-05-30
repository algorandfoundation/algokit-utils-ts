import { AlgodApi, ResponseContext } from '@algorandfoundation/algokit-algod-api'
import algosdk, {
  BaseHTTPClientError,
  BaseHTTPClientResponse,
  decodeJSON,
  decodeSignedTransaction,
  SignedTransaction,
  TransactionType,
} from 'algosdk'
import { AlgoHttpClientWithRetry } from './algo-http-client-with-retry'
import { buildAlgoKitCoreAlgodClient } from './algokit-core-bridge'
import { callWithRetry } from './call-http-with-retry'
import { AlgoClientConfig } from './network-client'

export class AlgodBridge extends algosdk.Algodv2 {
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

  sendRawTransaction(stxOrStxs: Uint8Array | Uint8Array[]): SendRawTransaction {
    const r = super.sendRawTransaction(stxOrStxs)
    return new Proxy<SendRawTransaction>(r, new SendRawTransactionProxy(this._algoKitCoreAlgod, stxOrStxs))
  }
}

type SendRawTransaction = ReturnType<algosdk.Algodv2['sendRawTransaction']>

class SendRawTransactionProxy implements ProxyHandler<SendRawTransaction> {
  constructor(
    private algodApi: AlgodApi,
    private stxOrStxs: Uint8Array | Uint8Array[],
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(target: SendRawTransaction, property: string | symbol, receiver: any) {
    if (property !== 'do') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (target as any)[property]
    }

    return async () => {
      // Currently, a single payment transaction is sent with the new algod-api
      // The rest are sent with algosdk Algod
      const txnBytes = !Array.isArray(this.stxOrStxs) ? this.stxOrStxs : this.stxOrStxs.length === 1 ? this.stxOrStxs[0] : undefined
      if (txnBytes) {
        let signedTxn: SignedTransaction | undefined = undefined
        try {
          // Try to decode the data into a single transaction
          signedTxn = decodeSignedTransaction(txnBytes)
        } catch {
          // Ignore errors here
        }
        if (signedTxn && signedTxn.txn.type === TransactionType.pay) {
          // TODO: handle msgpack?
          const responseContext = await callWithRetry(() => this.algodApi.rawTransactionResponse(new File([txnBytes], '')))
          if (responseContext.httpStatusCode !== 200) {
            await handleErrorResponse(responseContext)
          }

          const uint8Array = await getResponseBytes(responseContext)
          const text = new TextDecoder().decode(uint8Array)
          return decodeJSON(text, algosdk.modelsv2.PostTransactionsResponse)
        }
      }

      return target[property].call(receiver)
    }
  }
}

async function getResponseBytes(responseContext: ResponseContext) {
  const binary = await responseContext.body.binary()
  const arrayBuffer = await binary.arrayBuffer()
  return new Uint8Array(arrayBuffer)
}

async function handleErrorResponse(responseContext: ResponseContext) {
  const uint8Array = await getResponseBytes(responseContext)
  let bodyErrorMessage: string | undefined

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: Record<string, any> = JSON.parse(new TextDecoder().decode(uint8Array))
    if (decoded.message) {
      bodyErrorMessage = decoded.message
    }
  } catch {
    // ignore any error that happened while we are parsing the error response
  }

  let message = `Network request error. Received status ${responseContext.httpStatusCode} (${responseContext.httpStatusText})`
  if (bodyErrorMessage) {
    message += `: ${bodyErrorMessage}`
  }

  throw new URLTokenBaseHTTPError(message, {
    body: uint8Array,
    status: responseContext.httpStatusCode,
    headers: responseContext.headers,
  })
}

class URLTokenBaseHTTPError extends Error implements BaseHTTPClientError {
  constructor(
    message: string,
    public response: BaseHTTPClientResponse,
  ) {
    super(message)
    this.name = 'URLTokenBaseHTTPError'
    this.response = response
  }
}
