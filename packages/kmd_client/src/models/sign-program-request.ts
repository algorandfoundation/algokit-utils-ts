import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTProgramSignRequest is the request for `POST /v1/program/sign`
 */
export type SignProgramRequest = {
  address?: string
  data?: Uint8Array
  walletHandleToken?: string
  walletPassword?: string
}

export const SignProgramRequestMeta: ModelMetadata = {
  name: 'SignProgramRequest',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'data',
      wireKey: 'data',
      optional: true,
      nullable: false,
      codec: bytesCodec,
    },
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'walletPassword',
      wireKey: 'wallet_password',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
  ],
}
