import { BaseHttpRequest, type RequestOptions } from "./BaseHttpRequest";
import { request as defaultRequest } from "./request";

export class FetchHttpRequest extends BaseHttpRequest {
  async request<T>(options: RequestOptions): Promise<T> {
    const request = defaultRequest;
    return request(this.config, options);
  }
}
