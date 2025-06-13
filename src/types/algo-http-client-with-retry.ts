import { IntDecoding, parseJSON, stringifyJSON, TokenHeader } from 'algosdk'
import { BaseHTTPClientResponse, Query, URLTokenBaseHTTPClient } from 'algosdk/client'
import { Config } from '../config'
import { callWithRetry } from './call-http-with-retry'

/** A HTTP Client that wraps the Algorand SDK HTTP Client with retries */
export class AlgoHttpClientWithRetry extends URLTokenBaseHTTPClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(tokenHeader: TokenHeader, baseServer: string, port?: string | number, defaultHeaders?: Record<string, any>) {
    super(tokenHeader, baseServer, port, defaultHeaders)
  }

  async get(relativePath: string, query?: Query<string>, requestHeaders: Record<string, string> = {}): Promise<BaseHTTPClientResponse> {
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
