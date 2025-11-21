import type { ModelMetadata } from '../core/model-runtime'

/**
 * Box descriptor describes a Box.
 */
export type BoxDescriptor = {
  /**
   * Base64 encoded box name
   */
  name: Uint8Array
}

export const BoxDescriptorMeta: ModelMetadata = {
  name: 'BoxDescriptor',
  kind: 'object',
  fields: [
    {
      name: 'name',
      wireKey: 'name',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
  ],
}
