import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
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
      codec: booleanCodec,
    },
    {
      name: 'masterDerivationKey',
      wireKey: 'master_derivation_key',
      optional: true,
      nullable: false,
      codec: new ModelCodec(MasterDerivationKeyMeta),
    },
    {
      name: 'message',
      wireKey: 'message',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
  ],
}
