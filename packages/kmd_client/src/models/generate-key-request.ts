import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

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
      nullable: false,
      codec: booleanCodec,
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
