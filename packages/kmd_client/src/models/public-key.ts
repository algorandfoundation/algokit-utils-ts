import type { PrimitiveModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
} from '@algorandfoundation/algokit-common'
import type { Ed25519PublicKey } from './ed25519-public-key'

export type PublicKey = Ed25519PublicKey

export const PublicKeyMeta: PrimitiveModelMetadata = {
  name: 'PublicKey',
  kind: 'primitive',
  codec: stringCodec,
}
