import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { TxType } from './tx-type'
import { TxTypeMeta } from './tx-type'

/**
 * APIV1Wallet is the API's representation of a wallet
 */
export type Wallet = {
  driverName?: string
  driverVersion?: number
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
      codec: stringCodec,
    },
    {
      name: 'driverVersion',
      wireKey: 'driver_version',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'id',
      wireKey: 'id',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'mnemonicUx',
      wireKey: 'mnemonic_ux',
      optional: true,
      nullable: false,
      codec: booleanCodec,
    },
    {
      name: 'name',
      wireKey: 'name',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'supportedTxs',
      wireKey: 'supported_txs',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(TxTypeMeta)),
    },
  ],
}
