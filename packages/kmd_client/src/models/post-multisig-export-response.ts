import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, numberCodec, booleanCodec, ArrayCodec, PrimitiveModelCodec } from '@algorandfoundation/algokit-common'
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

export const PostMultisigExportResponseMeta: ObjectModelMetadata<PostMultisigExportResponse> = {
  name: 'PostMultisigExportResponse',
  kind: 'object',
  fields: [
    {
      name: 'error',
      wireKey: 'error',
      optional: true,
      codec: booleanCodec,
    },
    {
      name: 'message',
      wireKey: 'message',
      optional: true,
      codec: stringCodec,
    },
    {
      name: 'multisigVersion',
      wireKey: 'multisig_version',
      optional: true,
      codec: numberCodec,
    },
    {
      name: 'pks',
      wireKey: 'pks',
      optional: true,
      codec: new ArrayCodec(new PrimitiveModelCodec(PublicKeyMeta)),
    },
    {
      name: 'threshold',
      wireKey: 'threshold',
      optional: true,
      codec: numberCodec,
    },
  ],
}
