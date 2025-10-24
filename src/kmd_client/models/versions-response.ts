import type { ModelMetadata } from '../core/model-runtime'

/**
 * VersionsResponse is the response to `GET /versions`
 * friendly:VersionsResponse
 */
export type VersionsResponse = {
  versions?: string[]
}

export const VersionsResponseMeta: ModelMetadata = {
  name: 'VersionsResponse',
  kind: 'object',
  fields: [
    {
      name: 'versions',
      wireKey: 'versions',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar' } },
    },
  ],
}
