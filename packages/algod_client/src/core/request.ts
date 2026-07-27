import { decodeMsgpack, encodeMsgpack, parseJson, stringifyJson } from '@algorandfoundation/algokit-common'
import { ApiError } from './api-error'
import { ApiRequestOptions, inputValueAsString } from './base-http-request'
import type { ClientConfig } from './client-config'

const encodeURIPath = (path: string): string => encodeURI(path).replace(/%5B/g, '[').replace(/%5D/g, ']')

export async function request<T>(config: ClientConfig, options: ApiRequestOptions): Promise<T> {
  let rawPath = options.url.endsWith('/') ? options.url.slice(0, -1) : options.url
  if (options.path) {
    for (const [key, value] of Object.entries(options.path)) {
      const replace = encodeURIPath(inputValueAsString(value))
      rawPath = rawPath.replace(`{${key}}`, replace)
    }
  }

  const url = new URL(rawPath, config.baseUrl)
  if (config.port !== undefined) {
    url.port = config.port.toString()
  }

  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      if (value === undefined || value === null) continue
      url.searchParams.set(key, Array.isArray(value) ? value.map((v) => inputValueAsString(v)).join(',') : inputValueAsString(value))
    }
  }

  const headers: Record<string, string> = {
    ...(config.headers ?? {}),
    ...(options.headers ?? {}),
  }

  if (config.token) {
    if (typeof config.token === 'string') {
      headers['X-Algo-API-Token'] = config.token
    } else {
      for (const [name, value] of Object.entries(config.token)) {
        headers[name] = value
      }
    }
  }

  const requestContentType = options.headers?.['Content-Type'] ?? options.headers?.['content-type']
  let bodyPayload: BodyInit | undefined = undefined
  if (options.body != null) {
    if (options.body instanceof Uint8Array) {
      bodyPayload = options.body.slice().buffer
    } else if (typeof options.body === 'string') {
      bodyPayload = options.body
    } else if (requestContentType?.includes('msgpack')) {
      bodyPayload = encodeMsgpack(options.body).slice().buffer
    } else if (requestContentType?.includes('json')) {
      bodyPayload = stringifyJson(options.body)
    } else {
      bodyPayload = stringifyJson(options.body)
    }
  }

  const response = await fetch(url.toString(), {
    method: options.method,
    headers,
    body: bodyPayload,
  })

  const responseContentType = response.headers.get('content-type') ?? ''
  if (!response.ok) {
    let errorBody: unknown
    try {
      if (responseContentType.includes('application/msgpack')) {
        errorBody = decodeMsgpack(new Uint8Array(await response.arrayBuffer()), {
          useMap: false,
          rawBinaryStringKeys: false,
          rawBinaryStringValues: false,
        })
      } else if (responseContentType.includes('application/json')) {
        errorBody = parseJson(await response.text())
      } else {
        errorBody = await response.text()
      }
    } catch {
      errorBody = undefined
    }
    throw new ApiError(url.pathname.toString(), response.status, errorBody)
  }

  if (
    responseContentType.includes('application/msgpack') ||
    responseContentType.includes('application/octet-stream') ||
    responseContentType.includes('application/x-binary')
  ) {
    return new Uint8Array(await response.arrayBuffer()) as unknown as T
  }

  if (responseContentType.includes('application/json')) {
    return parseJson(await response.text()) as unknown as T
  }

  if (!responseContentType) {
    return new Uint8Array(await response.arrayBuffer()) as unknown as T
  }

  return (await response.text()) as unknown as T
}
