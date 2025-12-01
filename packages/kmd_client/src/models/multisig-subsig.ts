import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * MultisigSubsig is a struct that holds a pair of public key and signatures
 * signatures may be empty
 */
export type MultisigSubsig = {
  key: Uint8Array
  sig: Uint8Array
}

export const MultisigSubsigMeta: ObjectModelMetadata<MultisigSubsig> = {
  name: 'MultisigSubsig',
  kind: 'object',
  fields: [
    {
      name: 'key',
      wireKey: 'Key',
      optional: false,
      codec: bytesCodec,
    },
    {
      name: 'sig',
      wireKey: 'Sig',
      optional: false,
      codec: bytesCodec,
    },
  ],
}
