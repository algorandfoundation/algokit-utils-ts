import type { ModelMetadata } from '../core/model-runtime'

/**
 * BoxReference names a box by its name and the application ID it belongs to.
 */
export type BoxReference = {
  /**
   * Application ID to which the box belongs, or zero if referring to the called application.
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
