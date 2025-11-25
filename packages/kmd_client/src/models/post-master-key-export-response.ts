import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  booleanCodec,
  ArrayModelCodec,
} from '@algorandfoundation/algokit-common'
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

export const PostMasterKeyExportResponseMeta: ObjectModelMetadata = {
  name: 'PostMasterKeyExportResponse',
  kind: 'object',
  fields: [
    {
      name: 'error',
      wireKey: 'error',
      optional: true,
      codec: booleanCodec,
    },
    {
      name: 'masterDerivationKey',
      wireKey: 'master_derivation_key',
      optional: true,
      codec: new ArrayModelCodec(MasterDerivationKeyMeta),
    },
    {
      name: 'message',
      wireKey: 'message',
      optional: true,
      codec: stringCodec,
    },
  ],
}
