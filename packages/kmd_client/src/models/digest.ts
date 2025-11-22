import type { ModelMetadata } from '../core/model-runtime'

export type Digest = number[]

export const DigestMeta: ModelMetadata = {
  name: 'Digest',
  kind: 'array',
  arrayItems: { kind: 'scalar' },
}
