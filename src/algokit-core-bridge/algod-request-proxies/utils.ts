import { ResponseContext } from '@algorandfoundation/algokit-algod-api'
import algosdk, { BaseHTTPClientError, BaseHTTPClientResponse, decodeJSON, decodeMsgpack } from 'algosdk'

export async function handleJSONResponse<T extends algosdk.Encodable>(
  responseContext: ResponseContext,
  encodeableClass: algosdk.EncodableClass<T>,
) {
  if (responseContext.httpStatusCode !== 200) {
    await handleErrorResponse(responseContext)
  }

  const uint8Array = await getResponseBytes(responseContext)
  const text = new TextDecoder().decode(uint8Array)
  return decodeJSON(text, encodeableClass)
}

export async function handleMsgPackResponse<T extends algosdk.Encodable>(
  responseContext: ResponseContext,
  encodeableClass: algosdk.EncodableClass<T>,
) {
  if (responseContext.httpStatusCode !== 200) {
    await handleErrorResponse(responseContext)
  }

  const uint8Array = await getResponseBytes(responseContext)
  return decodeMsgpack(uint8Array, encodeableClass)
}

export async function getResponseBytes(responseContext: ResponseContext) {
  const binary = await responseContext.body.binary()
  const arrayBuffer = await binary.arrayBuffer()
  return new Uint8Array(arrayBuffer)
}

export async function handleErrorResponse(responseContext: ResponseContext) {
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
