import type { ClientConfig } from './core/client-config'
import { FetchHttpRequest } from './core/fetch-http-request'
import { IndexerApi } from './apis/api-service'

export class IndexerClient extends IndexerApi {
  constructor(config: ClientConfig) {
    super(new FetchHttpRequest(config))
  }
}
