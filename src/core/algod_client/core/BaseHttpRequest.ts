import type { ClientConfig } from "./ClientConfig";

export interface RequestOptions {
  method: string;
  url: string;
  path?: Record<string, string | number | bigint>;
  query?: Record<string, any>;
  headers?: Record<string, string>;
  body?: any;
  mediaType?: string;
  responseHeader?: string;
}

// Backwards/ergonomic alias used by generated services
export type ApiRequestOptions = RequestOptions;

export abstract class BaseHttpRequest {
  constructor(public readonly config: ClientConfig) {}
  abstract request<T>(options: RequestOptions): Promise<T>;
}
