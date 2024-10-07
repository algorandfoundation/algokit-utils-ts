import { IntDecoding, parseJSON, stringifyJSON } from 'algosdk'
import { BaseHTTPClientResponse, Query, URLTokenBaseHTTPClient } from 'algosdk/client'
import { Config } from '../config'

/** A HTTP Client that wraps the Algorand SDK HTTP Client with retries */
export class AlgoHttpClientWithRetry extends URLTokenBaseHTTPClient {
  private static readonly MAX_TRIES = 5
  private static readonly MAX_BACKOFF_MS = 10000

  // These lists come from https://visionmedia.github.io/superagent/#retrying-requests
  // which is the underlying library used by algosdk - but the CloudFlare specific 52X status codes have been removed
  private static readonly RETRY_STATUS_CODES = [408, 413, 429, 500, 502, 503, 504]
  private static readonly RETRY_ERROR_CODES = [
    'ETIMEDOUT',
    'ECONNRESET',
    'EADDRINUSE',
    'ECONNREFUSED',
    'EPIPE',
    'ENOTFOUND',
    'ENETUNREACH',
    'EAI_AGAIN',
    'EPROTO', // We get this intermittently with AlgoNode API
  ]

  private async callWithRetry(func: () => Promise<BaseHTTPClientResponse>): Promise<BaseHTTPClientResponse> {
    let response: BaseHTTPClientResponse | undefined
    let numTries = 1
    do {
      try {
        response = await func()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (numTries >= AlgoHttpClientWithRetry.MAX_TRIES) {
          throw err
        }
        // Only retry for one of the hardcoded conditions
        if (
          !(
            AlgoHttpClientWithRetry.RETRY_ERROR_CODES.includes(err.code) ||
            AlgoHttpClientWithRetry.RETRY_STATUS_CODES.includes(Number(err.status)) ||
            ('response' in err && AlgoHttpClientWithRetry.RETRY_STATUS_CODES.includes(Number(err.response.status)))
          )
        ) {
          throw err
        }
        // Retry immediately the first time, then exponentially backoff.
        const delayTimeMs = numTries == 1 ? 0 : Math.min(1000 * Math.pow(2, numTries - 1), AlgoHttpClientWithRetry.MAX_BACKOFF_MS)
        if (delayTimeMs > 0) {
          await new Promise((r) => setTimeout(r, delayTimeMs))
        }
        Config.logger.warn(`algosdk request failed ${numTries} times. Retrying in ${delayTimeMs}ms: ${err}`)
      }
    } while (!response && ++numTries <= AlgoHttpClientWithRetry.MAX_TRIES)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return response!
  }

  async get(relativePath: string, query?: Query<string>, requestHeaders: Record<string, string> = {}): Promise<BaseHTTPClientResponse> {
    const response = await this.callWithRetry(() => super.get(relativePath, query, requestHeaders))
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
    return await this.callWithRetry(() => super.post(relativePath, data, query, requestHeaders))
  }

  async delete(
    relativePath: string,
    data: Uint8Array,
    query?: Query<string>,
    requestHeaders: Record<string, string> = {},
  ): Promise<BaseHTTPClientResponse> {
    return await this.callWithRetry(() => super.delete(relativePath, data, query, requestHeaders))
  }
}
