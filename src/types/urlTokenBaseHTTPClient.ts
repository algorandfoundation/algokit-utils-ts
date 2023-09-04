// Copied from https://github.com/algorand/js-algorand-sdk/blob/e9635e9ffc9019994f0790ee4b8d9733c6590250/src/client/urlTokenBaseHTTPClient.ts
// There was an error trying to reference the file from algosdk
// This is referenced from algo-http-client-with-retry.ts and extended to add retry logic to improve resilience
// todo: Find out why this can't be referenced from algosdk directly so we don't have to duplicate here
import type { BaseHTTPClient, BaseHTTPClientError, BaseHTTPClientResponse, Query } from 'algosdk/dist/types/client/baseHTTPClient'
import { Buffer } from 'buffer'
import { fetch } from 'cross-fetch'

export interface AlgodTokenHeader {
  'X-Algo-API-Token': string
}

export interface IndexerTokenHeader {
  'X-Indexer-API-Token': string
}

export interface KMDTokenHeader {
  'X-KMD-API-Token': string
}

export interface CustomTokenHeader {
  [headerName: string]: string
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

export type TokenHeader = AlgodTokenHeader | IndexerTokenHeader | KMDTokenHeader | CustomTokenHeader

/**
 * Implementation of BaseHTTPClient that uses a URL and a token
 * and make the REST queries using fetch.
 * This is the default implementation of BaseHTTPClient.
 */
export class URLTokenBaseHTTPClient implements BaseHTTPClient {
  private readonly baseURL: URL
  private readonly tokenHeader: TokenHeader

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(
    tokenHeader: TokenHeader,
    baseServer: string,
    port?: string | number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private defaultHeaders: Record<string, any> = {},
  ) {
    // Append a trailing slash so we can use relative paths. Without the trailing
    // slash, the last path segment will be replaced by the relative path. See
    // usage in `addressWithPath`.
    const fixedBaseServer = baseServer.endsWith('/') ? baseServer : `${baseServer}/`
    const baseServerURL = new URL(fixedBaseServer)
    if (typeof port !== 'undefined') {
      baseServerURL.port = port.toString()
    }

    if (baseServerURL.protocol.length === 0) {
      throw new Error('Invalid base server URL, protocol must be defined.')
    }

    this.baseURL = baseServerURL
    this.tokenHeader = tokenHeader
  }

  /**
   * Compute the URL for a path relative to the instance's address
   * @param relativePath - A path string
   * @param query - An optional key-value object of query parameters to add to the URL. If the
   *   relativePath already has query parameters on it, the additional parameters defined here will
   *   be added to the URL without modifying those (unless a key collision occurs).
   * @returns A URL string
   */
  private getURL(relativePath: string, query?: Query<string>): string {
    let fixedRelativePath: string
    if (relativePath.startsWith('./')) {
      fixedRelativePath = relativePath
    } else if (relativePath.startsWith('/')) {
      fixedRelativePath = `.${relativePath}`
    } else {
      fixedRelativePath = `./${relativePath}`
    }
    const address = new URL(fixedRelativePath, this.baseURL)
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        address.searchParams.set(key, value)
      }
    }
    return address.toString()
  }

  private static formatFetchResponseHeaders(headers: Headers): Record<string, string> {
    const headersObj: Record<string, string> = {}
    headers.forEach((key, value) => {
      headersObj[key] = value
    })
    return headersObj
  }

  private static async checkHttpError(res: Response) {
    if (res.ok) {
      return
    }

    let body: Uint8Array | null = null
    let bodyErrorMessage: string | null = null

    try {
      body = new Uint8Array(await res.arrayBuffer())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded: Record<string, any> = JSON.parse(Buffer.from(body).toString())
      if (decoded.message) {
        bodyErrorMessage = decoded.message
      }
    } catch (_) {
      // ignore any error that happened while we are parsing the error response
    }

    let message = `Network request error. Received status ${res.status} (${res.statusText})`
    if (bodyErrorMessage) {
      message += `: ${bodyErrorMessage}`
    }

    throw new URLTokenBaseHTTPError(message, {
      body: body !== null ? body : new Uint8Array(),
      status: res.status,
      headers: URLTokenBaseHTTPClient.formatFetchResponseHeaders(res.headers),
    })
  }

  private static async formatFetchResponse(res: Response): Promise<BaseHTTPClientResponse> {
    await this.checkHttpError(res)
    return {
      body: new Uint8Array(await res.arrayBuffer()),
      status: res.status,
      headers: URLTokenBaseHTTPClient.formatFetchResponseHeaders(res.headers),
    }
  }

  async get(relativePath: string, query?: Query<string>, requestHeaders: Record<string, string> = {}): Promise<BaseHTTPClientResponse> {
    // Expand headers for use in fetch
    const headers = {
      ...this.tokenHeader,
      ...this.defaultHeaders,
      ...requestHeaders,
    }

    const res = await fetch(this.getURL(relativePath, query), {
      mode: 'cors',
      headers,
    })

    return URLTokenBaseHTTPClient.formatFetchResponse(res)
  }

  async post(
    relativePath: string,
    data: Uint8Array,
    query?: Query<string>,
    requestHeaders: Record<string, string> = {},
  ): Promise<BaseHTTPClientResponse> {
    // Expand headers for use in fetch
    const headers = {
      ...this.tokenHeader,
      ...this.defaultHeaders,
      ...requestHeaders,
    }

    const res = await fetch(this.getURL(relativePath, query), {
      method: 'POST',
      mode: 'cors',
      body: data,
      headers,
    })

    return URLTokenBaseHTTPClient.formatFetchResponse(res)
  }

  async delete(
    relativePath: string,
    data: Uint8Array,
    query?: Query<string>,
    requestHeaders: Record<string, string> = {},
  ): Promise<BaseHTTPClientResponse> {
    // Expand headers for use in fetch
    const headers = {
      ...this.tokenHeader,
      ...this.defaultHeaders,
      ...requestHeaders,
    }

    const res = await fetch(this.getURL(relativePath, query), {
      method: 'DELETE',
      mode: 'cors',
      body: data,
      headers,
    })

    return URLTokenBaseHTTPClient.formatFetchResponse(res)
  }
}
