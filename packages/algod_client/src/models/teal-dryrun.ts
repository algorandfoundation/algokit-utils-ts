import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  ArrayCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
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

export const TealDryrunMeta: ObjectModelMetadata<TealDryrun> = {
  name: 'TealDryrun',
  kind: 'object',
  fields: [
    {
      name: 'txns',
      wireKey: 'txns',
      optional: false,
      codec: new ArrayCodec(new ObjectModelCodec(DryrunTxnResultMeta)),
    },
    {
      name: 'error',
      wireKey: 'error',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'protocolVersion',
      wireKey: 'protocol-version',
      optional: false,
      codec: stringCodec,
    },
  ],
}
