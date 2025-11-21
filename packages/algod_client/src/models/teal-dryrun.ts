import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
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

export const TealDryrunMeta: ObjectModelMetadata = {
  name: 'TealDryrun',
  kind: 'object',
  fields: [
    {
      name: 'txns',
      wireKey: 'txns',
      optional: false,
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(DryrunTxnResultMeta)),
    },
    {
      name: 'error',
      wireKey: 'error',
      optional: false,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'protocolVersion',
      wireKey: 'protocol-version',
      optional: false,
      nullable: false,
      codec: stringCodec,
    },
  ],
}
