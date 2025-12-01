import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, numberCodec, booleanCodec, ArrayCodec, PrimitiveModelCodec } from '@algorandfoundation/algokit-common'
import type { TxType } from './tx-type'
import { TxTypeMeta } from './tx-type'

/**
 * Wallet is the API's representation of a wallet
 */
export type Wallet = {
  driverName: string
  driverVersion: number
  id: string
  mnemonicUx: boolean
  name: string
  supportedTxs: TxType[]
}

export const WalletMeta: ObjectModelMetadata<Wallet> = {
  name: 'Wallet',
  kind: 'object',
  fields: [
    {
      name: 'driverName',
      wireKey: 'driver_name',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'driverVersion',
      wireKey: 'driver_version',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'id',
      wireKey: 'id',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'mnemonicUx',
      wireKey: 'mnemonic_ux',
      optional: false,
      codec: booleanCodec,
    },
    {
      name: 'name',
      wireKey: 'name',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'supportedTxs',
      wireKey: 'supported_txs',
      optional: false,
      codec: new ArrayCodec(new PrimitiveModelCodec(TxTypeMeta)),
    },
  ],
}
