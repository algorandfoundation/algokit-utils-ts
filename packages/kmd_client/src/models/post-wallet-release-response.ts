import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, booleanCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTWalletReleaseResponse is the response to `POST /v1/wallet/release`
 * friendly:ReleaseWalletHandleTokenResponse
 */
export type PostWalletReleaseResponse = {
  error?: boolean
  message?: string
}

export const PostWalletReleaseResponseMeta: ObjectModelMetadata<PostWalletReleaseResponse> = {
  name: 'PostWalletReleaseResponse',
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
  ],
}
