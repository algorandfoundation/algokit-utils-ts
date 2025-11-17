import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
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

export const MultisigSubsigMeta: ModelMetadata = {
  name: 'MultisigSubsig',
  kind: 'object',
  fields: [
    {
      name: 'key',
      wireKey: 'Key',
      optional: true,
      nullable: false,
      codec: new ModelCodec(PublicKeyMeta),
    },
    {
      name: 'sig',
      wireKey: 'Sig',
      optional: true,
      nullable: false,
      codec: new ModelCodec(SignatureMeta),
    },
  ],
}
