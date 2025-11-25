import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  numberCodec,
  ArrayCodec,
  PrimitiveModelCodec,
} from '@algorandfoundation/algokit-common'
import type { PublicKey } from './public-key'
import { PublicKeyMeta } from './public-key'

/**
 * APIV1POSTMultisigImportRequest is the request for `POST /v1/multisig/import`
 */
export type ImportMultisigRequest = {
  multisigVersion?: number
  pks?: PublicKey[]
  threshold?: number
  walletHandleToken?: string
}

export const ImportMultisigRequestMeta: ObjectModelMetadata = {
  name: 'ImportMultisigRequest',
  kind: 'object',
  fields: [
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
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: true,
      codec: stringCodec,
    },
  ],
}
