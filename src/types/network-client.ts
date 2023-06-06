import type { TokenHeader } from 'algosdk/dist/types/client/urlTokenBaseHTTPClient'

/** Config for an Algorand SDK client */
export interface AlgoClientConfig {
  /** Base URL of the server e.g. http://localhost, https://testnet-api.algonode.cloud/, etc. */
  server: string
  /** The port to use e.g. 4001, 443, etc. */
  port?: string | number
  /** The token to use for API authentication (or undefined if none needed) - can be a string, or an object with the header key => value */
  token?: string | TokenHeader
}
