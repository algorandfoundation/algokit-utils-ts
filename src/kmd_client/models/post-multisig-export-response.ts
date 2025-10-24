import type { ModelMetadata } from '../core/model-runtime'
import type { PublicKey } from './public-key'
import { PublicKeyMeta } from './public-key'

/**
 * APIV1POSTMultisigExportResponse is the response to `POST /v1/multisig/export`
 * friendly:ExportMultisigResponse
 */
export type PostMultisigExportResponse = {
  error?: boolean
  message?: string
  multisigVersion?: bigint
  pks?: PublicKey[]
  threshold?: bigint
}

export const PostMultisigExportResponseMeta: ModelMetadata = {
  name: 'PostMultisigExportResponse',
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
      name: 'multisigVersion',
      wireKey: 'multisig_version',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'pks',
      wireKey: 'pks',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => PublicKeyMeta } },
    },
    {
      name: 'threshold',
      wireKey: 'threshold',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
