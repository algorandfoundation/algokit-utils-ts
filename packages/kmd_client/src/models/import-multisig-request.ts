import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, numberCodec, bytesArrayCodec } from '@algorandfoundation/algokit-common'

/**
 * The request for `POST /v1/multisig/import`
 */
export type ImportMultisigRequest = {
  multisigVersion: number
  publicKeys: Uint8Array[]
  threshold: number
  walletHandleToken: string
}

export const ImportMultisigRequestMeta: ObjectModelMetadata<ImportMultisigRequest> = {
  name: 'ImportMultisigRequest',
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
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: false,
      codec: stringCodec,
    },
  ],
}
