import type { Address, ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, bytesCodec, addressCodec } from '@algorandfoundation/algokit-common'

/**
 * The request for `POST /v1/program/sign`
 */
export type SignProgramRequest = {
  address: Address
  program: Uint8Array
  walletHandleToken: string
  walletPassword?: string
}

export const SignProgramRequestMeta: ObjectModelMetadata<SignProgramRequest> = {
  name: 'SignProgramRequest',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: false,
      codec: addressCodec,
    },
    {
      name: 'program',
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
      optional: true,
      codec: stringCodec,
    },
  ],
}
