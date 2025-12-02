import type { ClientConfig } from './core/client-config'
import { FetchHttpRequest } from './core/fetch-http-request'
import { AlgodApi } from './apis/api-service'

export class AlgodClient extends AlgodApi {
  constructor(config: ClientConfig) {
    super(new FetchHttpRequest(config))
  }
}
