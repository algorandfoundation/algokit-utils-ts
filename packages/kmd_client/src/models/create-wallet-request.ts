import type { ModelMetadata } from '../core/model-runtime'
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

export const CreateWalletRequestMeta: ModelMetadata = {
  name: 'CreateWalletRequest',
  kind: 'object',
  fields: [
    {
      name: 'masterDerivationKey',
      wireKey: 'master_derivation_key',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => MasterDerivationKeyMeta },
    },
    {
      name: 'walletDriverName',
      wireKey: 'wallet_driver_name',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'walletName',
      wireKey: 'wallet_name',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'walletPassword',
      wireKey: 'wallet_password',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
