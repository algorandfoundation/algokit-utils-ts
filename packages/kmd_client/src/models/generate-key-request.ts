import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  booleanCodec,
} from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTKeyRequest is the request for `POST /v1/key`
 */
export type GenerateKeyRequest = {
  displayMnemonic?: boolean
  walletHandleToken?: string
}

export const GenerateKeyRequestMeta: ObjectModelMetadata = {
  name: 'GenerateKeyRequest',
  kind: 'object',
  fields: [
    {
      name: 'displayMnemonic',
      wireKey: 'display_mnemonic',
      optional: true,
      codec: booleanCodec,
    },
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: true,
      codec: stringCodec,
    },
  ],
}
