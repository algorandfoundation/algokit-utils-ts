import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { PublicKey } from './public-key'
import { PublicKeyMeta } from './public-key'

/**
 * APIV1POSTMultisigExportResponse is the response to `POST /v1/multisig/export`
 * friendly:ExportMultisigResponse
 */
export type PostMultisigExportResponse = {
  error?: boolean
  message?: string
  multisigVersion?: number
  pks?: PublicKey[]
  threshold?: number
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
      codec: booleanCodec,
    },
    {
      name: 'message',
      wireKey: 'message',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'multisigVersion',
      wireKey: 'multisig_version',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'pks',
      wireKey: 'pks',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(PublicKeyMeta)),
    },
    {
      name: 'threshold',
      wireKey: 'threshold',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
  ],
}
