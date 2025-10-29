import { KmdApi } from './apis/api.service'
import type { BaseHttpRequest } from './core/base-http-request'
import type { ClientConfig } from './core/client-config'
import { FetchHttpRequest } from './core/fetch-http-request'

export class KmdClient extends KmdApi {
  constructor(config: ClientConfig, request?: BaseHttpRequest) {
    super(request ?? new FetchHttpRequest(config))
  }
}
