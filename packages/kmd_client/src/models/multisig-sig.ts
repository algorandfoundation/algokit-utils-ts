import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { MultisigSubsig } from './multisig-subsig'
import { MultisigSubsigMeta } from './multisig-subsig'

/**
 * MultisigSig is the structure that holds multiple Subsigs
 */
export type MultisigSig = {
  subsigs?: MultisigSubsig[]
  threshold?: number
  version?: number
}

export const MultisigSigMeta: ModelMetadata = {
  name: 'MultisigSig',
  kind: 'object',
  fields: [
    {
      name: 'subsigs',
      wireKey: 'Subsigs',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(MultisigSubsigMeta)),
    },
    {
      name: 'threshold',
      wireKey: 'Threshold',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'version',
      wireKey: 'Version',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
  ],
}
