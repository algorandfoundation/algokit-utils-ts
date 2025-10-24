import type { ModelMetadata } from '../core/model-runtime'
import type { SignedTransaction } from '@algorandfoundation/algokit-transact'
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
  latestTimestamp: bigint
  sources: DryrunSource[]
}

export const DryrunRequestMeta: ModelMetadata = {
  name: 'DryrunRequest',
  kind: 'object',
  fields: [
    {
      name: 'txns',
      wireKey: 'txns',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'codec', codecKey: 'SignedTransaction' } },
    },
    {
      name: 'accounts',
      wireKey: 'accounts',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => AccountMeta } },
    },
    {
      name: 'apps',
      wireKey: 'apps',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => ApplicationMeta } },
    },
    {
      name: 'protocolVersion',
      wireKey: 'protocol-version',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'round',
      wireKey: 'round',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'latestTimestamp',
      wireKey: 'latest-timestamp',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'sources',
      wireKey: 'sources',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => DryrunSourceMeta } },
    },
  ],
}
