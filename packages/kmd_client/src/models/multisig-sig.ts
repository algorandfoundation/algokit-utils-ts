import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { numberCodec, ArrayCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
import type { MultisigSubsig } from './multisig-subsig'
import { MultisigSubsigMeta } from './multisig-subsig'

/**
 * MultisigSig is the structure that holds multiple Subsigs
 */
export type MultisigSig = {
  subsignatures: MultisigSubsig[]
  threshold: number
  version: number
}

export const MultisigSigMeta: ObjectModelMetadata<MultisigSig> = {
  name: 'MultisigSig',
  kind: 'object',
  fields: [
    {
      name: 'subsignatures',
      wireKey: 'subsig',
      optional: false,
      codec: new ArrayCodec(new ObjectModelCodec(MultisigSubsigMeta)),
    },
    {
      name: 'threshold',
      wireKey: 'thr',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'version',
      wireKey: 'v',
      optional: false,
      codec: numberCodec,
    },
  ],
}
