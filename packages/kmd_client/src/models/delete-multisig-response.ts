import type { ModelMetadata } from '../core/model-runtime'

/**
 * APIV1DELETEMultisigResponse is the response to POST /v1/multisig/delete`
 * friendly:DeleteMultisigResponse
 */
export type DeleteMultisigResponse = {
  error?: boolean
  message?: string
}

export const DeleteMultisigResponseMeta: ModelMetadata = {
  name: 'DeleteMultisigResponse',
  kind: 'object',
  fields: [
    {
      name: 'error',
      wireKey: 'error',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'message',
      wireKey: 'message',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
