/* Minimal client runtime config holder */
export type BaseURL = string

export interface ClientConfig {
  // Prefer idiomatic camelCase going forward
  baseUrl: BaseURL
  credentials?: 'include' | 'omit' | 'same-origin'
  token?: string | (() => string | Promise<string>)
  apiToken?: string
  username?: string
  password?: string
  headers?: Record<string, string> | (() => Record<string, string> | Promise<Record<string, string>>)
  encodePath?: (path: string) => string
}
