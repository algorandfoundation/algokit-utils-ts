import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * MultisigSubsig is a struct that holds a pair of public key and signatures
 * signatures may be empty
 */
export type MultisigSubsig = {
  publicKey: Uint8Array
  signature?: Uint8Array
}

export const MultisigSubsigMeta: ObjectModelMetadata<MultisigSubsig> = {
  name: 'MultisigSubsig',
  kind: 'object',
  fields: [
    {
      name: 'publicKey',
      wireKey: 'pk',
      optional: false,
      codec: bytesCodec,
    },
    {
      name: 'signature',
      wireKey: 's',
      optional: true,
      codec: bytesCodec,
    },
  ],
}
