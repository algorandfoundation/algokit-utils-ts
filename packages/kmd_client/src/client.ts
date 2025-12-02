import type { ClientConfig } from './core/client-config'
import { FetchHttpRequest } from './core/fetch-http-request'
import { KmdApi } from './apis/api-service'

export class KmdClient extends KmdApi {
  constructor(config: ClientConfig) {
    super(new FetchHttpRequest(config))
  }
}
