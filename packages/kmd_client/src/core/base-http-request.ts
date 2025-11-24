import type { ClientConfig } from './client-config'

export type QueryValue = string | number | bigint | boolean
export type QueryParams = Record<string, QueryValue | QueryValue[] | undefined>

export type BodyValue = Uint8Array | Record<string, unknown> | unknown[] | string | number | boolean | null

export interface ApiRequestOptions {
  method: string
  url: string
  path?: Record<string, string | number | bigint>
  query?: QueryParams
  headers?: Record<string, string>
  body?: BodyValue
  mediaType?: string
  responseHeader?: string
}

export abstract class BaseHttpRequest {
  constructor(public readonly config: ClientConfig) {}
  abstract request<T>(options: ApiRequestOptions): Promise<T>
}
