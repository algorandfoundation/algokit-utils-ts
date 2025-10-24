import type { ModelMetadata } from '../core/model-runtime'

/**
 * APIV1POSTMultisigTransactionSignResponse is the response to `POST /v1/multisig/sign`
 * friendly:SignMultisigResponse
 */
export type PostMultisigTransactionSignResponse = {
  error?: boolean
  message?: string
  multisig?: Uint8Array
}

export const PostMultisigTransactionSignResponseMeta: ModelMetadata = {
  name: 'PostMultisigTransactionSignResponse',
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
