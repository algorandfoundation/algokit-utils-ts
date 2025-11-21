import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
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

export const CreateWalletRequestMeta: ObjectModelMetadata = {
  name: 'CreateWalletRequest',
  kind: 'object',
  fields: [
    {
      name: 'masterDerivationKey',
      wireKey: 'master_derivation_key',
      optional: true,
      nullable: false,
      codec: new ModelCodec(MasterDerivationKeyMeta),
    },
    {
      name: 'walletDriverName',
      wireKey: 'wallet_driver_name',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'walletName',
      wireKey: 'wallet_name',
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
