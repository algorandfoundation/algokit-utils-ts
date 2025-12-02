import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, numberCodec, bigIntCodec, ArrayCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
import type { SignedTransaction } from '@algorandfoundation/algokit-transact'
import { SignedTransactionMeta } from '@algorandfoundation/algokit-transact'
import type { Account } from './account'
import { AccountMeta } from './account'
import type { Application } from './application'
import { ApplicationMeta } from './application'
import type { DryrunSource } from './dryrun-source'
import { DryrunSourceMeta } from './dryrun-source'

/**
 * Request data type for dryrun endpoint. Given the Transactions and simulated ledger state upload, run TEAL scripts and return debugging information.
 */
export type DryrunRequest = {
  txns: SignedTransaction[]
  accounts: Account[]
  apps: Application[]

  /**
   * ProtocolVersion specifies a specific version string to operate under, otherwise whatever the current protocol of the network this algod is running in.
   */
  protocolVersion: string

  /**
   * Round is available to some TEAL scripts. Defaults to the current round on the network this algod is attached to.
   */
  round: bigint

  /**
   * LatestTimestamp is available to some TEAL scripts. Defaults to the latest confirmed timestamp this algod is attached to.
   */
  latestTimestamp: number
  sources: DryrunSource[]
}

export const DryrunRequestMeta: ObjectModelMetadata<DryrunRequest> = {
  name: 'DryrunRequest',
  kind: 'object',
  fields: [
    {
      name: 'txns',
      wireKey: 'txns',
      optional: false,
      codec: new ArrayCodec(new ObjectModelCodec(SignedTransactionMeta)),
    },
    {
      name: 'accounts',
      wireKey: 'accounts',
      optional: false,
      codec: new ArrayCodec(new ObjectModelCodec(AccountMeta)),
    },
    {
      name: 'apps',
      wireKey: 'apps',
      optional: false,
      codec: new ArrayCodec(new ObjectModelCodec(ApplicationMeta)),
    },
    {
      name: 'protocolVersion',
      wireKey: 'protocol-version',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'round',
      wireKey: 'round',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'latestTimestamp',
      wireKey: 'latest-timestamp',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'sources',
      wireKey: 'sources',
      optional: false,
      codec: new ArrayCodec(new ObjectModelCodec(DryrunSourceMeta)),
    },
  ],
}
