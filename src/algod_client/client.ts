import type { ClientConfig } from './core/client-config'
import type { BaseHttpRequest } from './core/base-http-request'
import { FetchHttpRequest } from './core/fetch-http-request'
import { AlgodApi } from './apis/api.service'

export class AlgodClient extends AlgodApi {
  constructor(config: ClientConfig, request?: BaseHttpRequest) {
    super(request ?? new FetchHttpRequest(config))
  }
}
