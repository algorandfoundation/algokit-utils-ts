import type { ModelMetadata } from '../core/model-runtime'

/**
 * APIV1POSTMultisigProgramSignResponse is the response to `POST /v1/multisig/signdata`
 * friendly:SignProgramMultisigResponse
 */
export type PostMultisigProgramSignResponse = {
  error?: boolean
  message?: string
  multisig?: Uint8Array
}

export const PostMultisigProgramSignResponseMeta: ModelMetadata = {
  name: 'PostMultisigProgramSignResponse',
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
    {
      name: 'multisig',
      wireKey: 'multisig',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
  ],
}
