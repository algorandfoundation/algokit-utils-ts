import type { ClientConfig } from "./core/ClientConfig";
import { FetchHttpRequest } from "./core/FetchHttpRequest";
import { AlgodApi } from "./apis/api.service";

export class AlgodClient extends AlgodApi {
  public readonly request: FetchHttpRequest;

  constructor(config: ClientConfig) {
    super(new FetchHttpRequest(config));
    this.request = this.httpRequest as FetchHttpRequest;
  }
}
