import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
} from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTMultisigListRequest is the request for `POST /v1/multisig/list`
 */
export type ListMultisigRequest = {
  walletHandleToken?: string
}

export const ListMultisigRequestMeta: ObjectModelMetadata<ListMultisigRequest> = {
  name: 'ListMultisigRequest',
  kind: 'object',
  fields: [
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: true,
      codec: stringCodec,
    },
  ],
}
