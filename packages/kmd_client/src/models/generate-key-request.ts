import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec } from '@algorandfoundation/algokit-common'

/**
 * The request for `POST /v1/key`
 */
export type GenerateKeyRequest = {
  walletHandleToken: string
}

export const GenerateKeyRequestMeta: ObjectModelMetadata<GenerateKeyRequest> = {
  name: 'GenerateKeyRequest',
  kind: 'object',
  fields: [
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: false,
      codec: stringCodec,
    },
  ],
}
