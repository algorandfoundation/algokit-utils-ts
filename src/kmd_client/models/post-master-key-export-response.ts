import type { ModelMetadata } from '../core/model-runtime'
import type { MasterDerivationKey } from './master-derivation-key'
import { MasterDerivationKeyMeta } from './master-derivation-key'

/**
 * APIV1POSTMasterKeyExportResponse is the response to `POST /v1/master-key/export`
 * friendly:ExportMasterKeyResponse
 */
export type PostMasterKeyExportResponse = {
  error?: boolean
  masterDerivationKey?: MasterDerivationKey
  message?: string
}

export const PostMasterKeyExportResponseMeta: ModelMetadata = {
  name: 'PostMasterKeyExportResponse',
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
      name: 'masterDerivationKey',
      wireKey: 'master_derivation_key',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => MasterDerivationKeyMeta },
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
