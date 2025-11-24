import type { ModelMetadata } from '../core/model-runtime'
import type { DryrunTxnResult } from './dryrun-txn-result'
import { DryrunTxnResultMeta } from './dryrun-txn-result'

export type TealDryrun = {
  txns: DryrunTxnResult[]
  error: string

  /**
   * Protocol version is the protocol version Dryrun was operated under.
   */
  protocolVersion: string
}

export const TealDryrunMeta: ModelMetadata = {
  name: 'TealDryrun',
  kind: 'object',
  fields: [
    {
      name: 'txns',
      wireKey: 'txns',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => DryrunTxnResultMeta } },
    },
    {
      name: 'error',
      wireKey: 'error',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'protocolVersion',
      wireKey: 'protocol-version',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
