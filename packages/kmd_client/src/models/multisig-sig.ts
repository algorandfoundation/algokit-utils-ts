import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { numberCodec, ArrayCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
import type { MultisigSubsig } from './multisig-subsig'
import { MultisigSubsigMeta } from './multisig-subsig'

/**
 * MultisigSig is the structure that holds multiple Subsigs
 */
export type MultisigSig = {
  subsigs: MultisigSubsig[]
  threshold: number
  version: number
}

export const MultisigSigMeta: ObjectModelMetadata<MultisigSig> = {
  name: 'MultisigSig',
  kind: 'object',
  fields: [
    {
      name: 'subsigs',
      wireKey: 'Subsigs',
      optional: false,
      codec: new ArrayCodec(new ObjectModelCodec(MultisigSubsigMeta)),
    },
    {
      name: 'threshold',
      wireKey: 'Threshold',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'version',
      wireKey: 'Version',
      optional: false,
      codec: numberCodec,
    },
  ],
}
