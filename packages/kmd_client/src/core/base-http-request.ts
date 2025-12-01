import { Address } from '@algorandfoundation/algokit-common'
import type { ClientConfig } from './client-config'

type PathValue = string | number | bigint | Address
type QueryValue = string | number | bigint | boolean | Address
type QueryParams = Record<string, QueryValue | QueryValue[] | undefined>

type BodyValue = Uint8Array | Record<string, unknown> | unknown[] | string | number | boolean | null

export interface ApiRequestOptions {
  method: string
  url: string
  path?: Record<string, PathValue>
  query?: QueryParams
  headers?: Record<string, string>
  body?: BodyValue
}

export abstract class BaseHttpRequest {
  constructor(public readonly config: ClientConfig) {}
  abstract request<T>(options: ApiRequestOptions): Promise<T>
}
