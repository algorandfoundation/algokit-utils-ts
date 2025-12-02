import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTKeyListRequest is the request for `POST /v1/key/list`
 */
export type ListKeysRequest = {
  walletHandleToken?: string
}

export const ListKeysRequestMeta: ObjectModelMetadata<ListKeysRequest> = {
  name: 'ListKeysRequest',
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
