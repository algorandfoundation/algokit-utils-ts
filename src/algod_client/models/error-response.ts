import type { ModelMetadata } from '../core/model-runtime'

/**
 * An error response with optional data field.
 */
export type ErrorResponse = {
  data?: Record<string, unknown>
  message: string
}

export const ErrorResponseMeta: ModelMetadata = {
  name: 'ErrorResponse',
  kind: 'object',
  fields: [
    {
      name: 'data',
      wireKey: 'data',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'message',
      wireKey: 'message',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
