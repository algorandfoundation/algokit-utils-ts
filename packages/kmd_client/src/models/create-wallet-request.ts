import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * The request for `POST /v1/wallet`
 */
export type CreateWalletRequest = {
  masterDerivationKey?: Uint8Array
  walletDriverName?: string
  walletName: string
  walletPassword: string
}

export const CreateWalletRequestMeta: ObjectModelMetadata<CreateWalletRequest> = {
  name: 'CreateWalletRequest',
  kind: 'object',
  fields: [
    {
      name: 'masterDerivationKey',
      wireKey: 'master_derivation_key',
      optional: true,
      codec: bytesCodec,
    },
    {
      name: 'walletDriverName',
      wireKey: 'wallet_driver_name',
      optional: true,
      codec: stringCodec,
    },
    {
      name: 'walletName',
      wireKey: 'wallet_name',
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
