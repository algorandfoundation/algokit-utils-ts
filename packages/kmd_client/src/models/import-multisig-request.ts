import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
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
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
  ],
}
