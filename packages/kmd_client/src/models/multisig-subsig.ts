import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { PrimitiveModelCodec } from '@algorandfoundation/algokit-common'
import type { PublicKey } from './public-key'
import { PublicKeyMeta } from './public-key'
import type { Signature } from './signature'
import { SignatureMeta } from './signature'

/**
 * MultisigSubsig is a struct that holds a pair of public key and signatures
 * signatures may be empty
 */
export type MultisigSubsig = {
  key?: PublicKey
  sig?: Signature
}

export const MultisigSubsigMeta: ObjectModelMetadata<MultisigSubsig> = {
  name: 'MultisigSubsig',
  kind: 'object',
  fields: [
    {
      name: 'key',
      wireKey: 'Key',
      optional: true,
      codec: new PrimitiveModelCodec(PublicKeyMeta),
    },
    {
      name: 'sig',
      wireKey: 'Sig',
      optional: true,
      codec: new PrimitiveModelCodec(SignatureMeta),
    },
  ],
}
