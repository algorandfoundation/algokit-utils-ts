import type { PrimitiveModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec } from '@algorandfoundation/algokit-common'
import type { Ed25519Signature } from './ed25519-signature'

export type Signature = Ed25519Signature

export const SignatureMeta: PrimitiveModelMetadata = {
  name: 'Signature',
  kind: 'primitive',
  codec: stringCodec,
}
