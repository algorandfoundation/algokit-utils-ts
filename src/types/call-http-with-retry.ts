import { ResponseContext } from '@algorandfoundation/algokit-algod-api'
import { BaseHTTPClientResponse } from 'algosdk'
import { Config } from '../config'

const MAX_TRIES = 5
const MAX_BACKOFF_MS = 10000

// These lists come from https://visionmedia.github.io/superagent/#retrying-requests
// which is the underlying library used by algosdk - but the CloudFlare specific 52X status codes have been removed
const RETRY_STATUS_CODES = [408, 413, 429, 500, 502, 503, 504]
const RETRY_ERROR_CODES = [
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
export async function callWithRetry<T extends ResponseContext | BaseHTTPClientResponse>(func: () => Promise<T>): Promise<T> {
  let response: T | undefined
  let numTries = 1
  do {
    try {
      response = await func()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (numTries >= MAX_TRIES) {
        throw err
      }

      // Only retry for one of the hardcoded conditions
      if (
        !(
          RETRY_ERROR_CODES.includes(err.code) ||
          RETRY_STATUS_CODES.includes(Number(err.status)) ||
          ('response' in err && RETRY_STATUS_CODES.includes(Number(err.response.status)))
        )
      ) {
        throw err
      }
      // Retry immediately the first time, then exponentially backoff.
      const delayTimeMs = numTries == 1 ? 0 : Math.min(1000 * Math.pow(2, numTries - 1), MAX_BACKOFF_MS)
      if (delayTimeMs > 0) {
        await new Promise((r) => setTimeout(r, delayTimeMs))
      }
      Config.logger.warn(`algosdk request failed ${numTries} times. Retrying in ${delayTimeMs}ms: ${err}`)
    }
  } while (!response && ++numTries <= MAX_TRIES)
  return response!
}
