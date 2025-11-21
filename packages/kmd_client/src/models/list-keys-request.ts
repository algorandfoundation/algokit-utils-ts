import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTKeyListRequest is the request for `POST /v1/key/list`
 */
export type ListKeysRequest = {
  walletHandleToken?: string
}

export const ListKeysRequestMeta: ObjectModelMetadata = {
  name: 'ListKeysRequest',
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
