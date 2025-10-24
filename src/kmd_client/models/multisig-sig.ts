import type { ModelMetadata } from '../core/model-runtime'
import type { MultisigSubsig } from './multisig-subsig'
import { MultisigSubsigMeta } from './multisig-subsig'

/**
 * MultisigSig is the structure that holds multiple Subsigs
 */
export type MultisigSig = {
  subsigs?: MultisigSubsig[]
  threshold?: bigint
  version?: bigint
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
      type: { kind: 'array', item: { kind: 'model', meta: () => MultisigSubsigMeta } },
    },
    {
      name: 'threshold',
      wireKey: 'Threshold',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'version',
      wireKey: 'Version',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
