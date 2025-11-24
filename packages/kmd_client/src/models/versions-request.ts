import type { ModelMetadata } from '../core/model-runtime'

/**
 * VersionsRequest is the request for `GET /versions`
 */
export type VersionsRequest = Record<string, unknown>

export const VersionsRequestMeta: ModelMetadata = {
  name: 'VersionsRequest',
  kind: 'object',
  fields: [],
}
