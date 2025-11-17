import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTWalletReleaseResponse is the response to `POST /v1/wallet/release`
 * friendly:ReleaseWalletHandleTokenResponse
 */
export type PostWalletReleaseResponse = {
  error?: boolean
  message?: string
}

export const PostWalletReleaseResponseMeta: ModelMetadata = {
  name: 'PostWalletReleaseResponse',
  kind: 'object',
  fields: [
    {
      name: 'error',
      wireKey: 'error',
      optional: true,
      nullable: false,
      codec: booleanCodec,
    },
    {
      name: 'message',
      wireKey: 'message',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
  ],
}
