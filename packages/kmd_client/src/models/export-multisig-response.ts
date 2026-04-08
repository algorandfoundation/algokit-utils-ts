import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { numberCodec, bytesArrayCodec } from '@algorandfoundation/algokit-common'

/**
 * ExportMultisigResponse is the response to `POST /v1/multisig/export`
 */
export type ExportMultisigResponse = {
  multisigVersion: number
  publicKeys: Uint8Array[]
  threshold: number
}

export const ExportMultisigResponseMeta: ObjectModelMetadata<ExportMultisigResponse> = {
  name: 'ExportMultisigResponse',
  kind: 'object',
  fields: [
    {
      name: 'multisigVersion',
      wireKey: 'multisig_version',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'publicKeys',
      wireKey: 'pks',
      optional: false,
      codec: bytesArrayCodec,
    },
    {
      name: 'threshold',
      wireKey: 'threshold',
      optional: false,
      codec: numberCodec,
    },
  ],
}
