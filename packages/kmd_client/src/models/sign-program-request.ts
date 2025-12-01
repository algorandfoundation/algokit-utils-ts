import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTProgramSignRequest is the request for `POST /v1/program/sign`
 */
export type SignProgramRequest = {
  address: string
  data: Uint8Array
  walletHandleToken: string
  walletPassword: string
}

export const SignProgramRequestMeta: ObjectModelMetadata<SignProgramRequest> = {
  name: 'SignProgramRequest',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'data',
      wireKey: 'data',
      optional: false,
      codec: bytesCodec,
    },
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'walletPassword',
      wireKey: 'wallet_password',
      optional: false,
      codec: stringCodec,
    },
  ],
}
