import type { ModelMetadata } from '../core/model-runtime'

export type ShutdownNode = Record<string, unknown>

export const ShutdownNodeMeta: ModelMetadata = {
  name: 'ShutdownNode',
  kind: 'object',
  fields: [],
}
