import type { ModelMetadata } from '../core/model-runtime'

export type AddParticipationKey = {
  /**
   * encoding of the participation ID.
   */
  partId: string
}

export const AddParticipationKeyMeta: ModelMetadata = {
  name: 'AddParticipationKey',
  kind: 'object',
  fields: [
    {
      name: 'partId',
      wireKey: 'partId',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
