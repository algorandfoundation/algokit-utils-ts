import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTMultisigListRequest is the request for `POST /v1/multisig/list`
 */
export type ListMultisigRequest = {
  walletHandleToken?: string
}

export const ListMultisigRequestMeta: ObjectModelMetadata = {
  name: 'ListMultisigRequest',
  kind: 'object',
  fields: [
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
  ],
}
