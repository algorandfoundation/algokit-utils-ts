import type { ModelMetadata } from '../core/model-runtime'

/**
 * An catchpoint abort response.
 */
export type AbortCatchup = {
  /**
   * Catchup abort response string
   */
  catchupMessage: string
}

export const AbortCatchupMeta: ModelMetadata = {
  name: 'AbortCatchup',
  kind: 'object',
  fields: [
    {
      name: 'catchupMessage',
      wireKey: 'catchup-message',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
