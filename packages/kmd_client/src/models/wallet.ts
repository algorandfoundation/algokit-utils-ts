import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, numberCodec, booleanCodec, ArrayCodec, PrimitiveModelCodec } from '@algorandfoundation/algokit-common'
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

export const WalletMeta: ObjectModelMetadata<Wallet> = {
  name: 'Wallet',
  kind: 'object',
  fields: [
    {
      name: 'driverName',
      wireKey: 'driver_name',
      optional: true,
      codec: stringCodec,
    },
    {
      name: 'driverVersion',
      wireKey: 'driver_version',
      optional: true,
      codec: numberCodec,
    },
    {
      name: 'id',
      wireKey: 'id',
      optional: true,
      codec: stringCodec,
    },
    {
      name: 'mnemonicUx',
      wireKey: 'mnemonic_ux',
      optional: true,
      codec: booleanCodec,
    },
    {
      name: 'name',
      wireKey: 'name',
      optional: true,
      codec: stringCodec,
    },
    {
      name: 'supportedTxs',
      wireKey: 'supported_txs',
      optional: true,
      codec: new ArrayCodec(new PrimitiveModelCodec(TxTypeMeta)),
    },
  ],
}
