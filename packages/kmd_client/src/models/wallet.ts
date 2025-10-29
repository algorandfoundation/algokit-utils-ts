import type { ModelMetadata } from '../core/model-runtime'
import type { TxType } from './tx-type'
import { TxTypeMeta } from './tx-type'

/**
 * APIV1Wallet is the API's representation of a wallet
 */
export type Wallet = {
  driverName?: string
  driverVersion?: bigint
  id?: string
  mnemonicUx?: boolean
  name?: string
  supportedTxs?: TxType[]
}

export const WalletMeta: ModelMetadata = {
  name: 'Wallet',
  kind: 'object',
  fields: [
    {
      name: 'driverName',
      wireKey: 'driver_name',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'driverVersion',
      wireKey: 'driver_version',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'id',
      wireKey: 'id',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'mnemonicUx',
      wireKey: 'mnemonic_ux',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'name',
      wireKey: 'name',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'supportedTxs',
      wireKey: 'supported_txs',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => TxTypeMeta } },
    },
  ],
}
