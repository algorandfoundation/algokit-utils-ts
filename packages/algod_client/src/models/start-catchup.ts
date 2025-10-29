import type { ModelMetadata } from '../core/model-runtime'

/**
 * An catchpoint start response.
 */
export type StartCatchup = {
  /**
   * Catchup start response string
   */
  catchupMessage: string
}

export const StartCatchupMeta: ModelMetadata = {
  name: 'StartCatchup',
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
