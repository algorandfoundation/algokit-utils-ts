import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, ArrayModelCodec } from '@algorandfoundation/algokit-common'
import type { MasterDerivationKey } from './master-derivation-key'
import { MasterDerivationKeyMeta } from './master-derivation-key'

/**
 * APIV1POSTWalletRequest is the request for `POST /v1/wallet`
 */
export type CreateWalletRequest = {
  masterDerivationKey?: MasterDerivationKey
  walletDriverName?: string
  walletName?: string
  walletPassword?: string
}

export const CreateWalletRequestMeta: ObjectModelMetadata<CreateWalletRequest> = {
  name: 'CreateWalletRequest',
  kind: 'object',
  fields: [
    {
      name: 'masterDerivationKey',
      wireKey: 'master_derivation_key',
      optional: true,
      codec: new ArrayModelCodec(MasterDerivationKeyMeta),
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
      optional: true,
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
