import { AlgodApi } from '@algorandfoundation/algokit-algod-api'
import { IntDecoding, parseJSON, stringifyJSON, TokenHeader } from 'algosdk'
import { BaseHTTPClientResponse, Query, URLTokenBaseHTTPClient } from 'algosdk/client'
import { Config } from '../config'
import { buildAlgoKitCoreAlgodClient } from './algokit-core-bridge'
import { callWithRetry } from './call-http-with-retry'

/** A HTTP Client that wraps the Algorand SDK HTTP Client with retries */
export class AlgoHttpClientWithRetry extends URLTokenBaseHTTPClient {
  private _algoKitCoreAlgod: AlgodApi

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(tokenHeader: TokenHeader, baseServer: string, port?: string | number, defaultHeaders?: Record<string, any>) {
    super(tokenHeader, baseServer, port, defaultHeaders)

    this._algoKitCoreAlgod = buildAlgoKitCoreAlgodClient(this.buildBaseServerUrl(baseServer, port), tokenHeader)
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

  async get(relativePath: string, query?: Query<string>, requestHeaders: Record<string, string> = {}): Promise<BaseHTTPClientResponse> {
    if (relativePath.startsWith('/v2/transactions/pending/')) {
      const possibleTxnId = relativePath.replace('/v2/transactions/pending/', '').replace(/\/+$/, '')
      // TODO: test for possibleTxnId
      if (possibleTxnId) {
        return await callWithRetry(async () => {
          const httpInfo = await this._algoKitCoreAlgod.pendingTransactionInformationResponse(possibleTxnId, 'msgpack')
          const binary = await httpInfo.body.binary()
          const arrayBuffer = await binary.arrayBuffer()
          const uint8Array = new Uint8Array(arrayBuffer)
          return {
            status: httpInfo.httpStatusCode,
            headers: httpInfo.headers,
            body: uint8Array,
          }
        })
      }
    }

    if (relativePath.startsWith('/v2/transactions/params')) {
      const httpInfo = await this._algoKitCoreAlgod.transactionParamsResponse()
      const binary = await httpInfo.body.binary()
      const arrayBuffer = await binary.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      return {
        status: httpInfo.httpStatusCode,
        headers: httpInfo.headers,
        body: uint8Array,
      }
    }

    const response = await callWithRetry(() => super.get(relativePath, query, requestHeaders))
    if (
      relativePath.startsWith('/v2/accounts/') &&
      relativePath.endsWith('/created-applications') &&
      response.status === 200 &&
      query?.['include-all']?.toString() === 'true'
    ) {
      // todo: Temporary hack
      // Indexer get created applications by account returns approvalProgram and clearStateProgram as null, which breaks the algosdk@3 decoder
      // instead we will detect this call and set them to empty byte arrays
      try {
        const json = parseJSON(Buffer.from(response.body).toString(), { intDecoding: IntDecoding.MIXED })
        if (json.applications) {
          for (const app of json.applications) {
            if (app.params) {
              if (app.params['approval-program'] === null) {
                app.params['approval-program'] = ''
              }
              if (app.params['clear-state-program'] === null) {
                app.params['clear-state-program'] = ''
              }
            }
          }
          response.body = Buffer.from(stringifyJSON(json))
        }
      } catch (e) {
        // Make this hack resilient so we never break the app
        Config.logger.warn('Failed to fix indexer response for created applications', e)
      }
    }
    return response
  }

  async post(
    relativePath: string,
    data: Uint8Array,
    query?: Query<string>,
    requestHeaders: Record<string, string> = {},
  ): Promise<BaseHTTPClientResponse> {
    return await callWithRetry(() => super.post(relativePath, data, query, requestHeaders))
  }

  async delete(
    relativePath: string,
    data: Uint8Array,
    query?: Query<string>,
    requestHeaders: Record<string, string> = {},
  ): Promise<BaseHTTPClientResponse> {
    return await callWithRetry(() => super.delete(relativePath, data, query, requestHeaders))
  }
}
