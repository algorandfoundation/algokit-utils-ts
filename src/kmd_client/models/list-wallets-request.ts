import type { ModelMetadata } from '../core/model-runtime'

/**
 * APIV1GETWalletsRequest is the request for `GET /v1/wallets`
 */
export type ListWalletsRequest = Record<string, unknown>

export const ListWalletsRequestMeta: ModelMetadata = {
  name: 'ListWalletsRequest',
  kind: 'object',
  fields: [],
}
