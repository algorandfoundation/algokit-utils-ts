import type { ModelMetadata } from '../core/model-runtime'

/**
 * References a box of an application.
 */
export type BoxReference = {
  /**
   * Application ID which this box belongs to
   */
  app: bigint

  /**
   * Base64 encoded box name
   */
  name: Uint8Array
}

export const BoxReferenceMeta: ModelMetadata = {
  name: 'BoxReference',
  kind: 'object',
  fields: [
    {
      name: 'app',
      wireKey: 'app',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'name',
      wireKey: 'name',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
  ],
}
