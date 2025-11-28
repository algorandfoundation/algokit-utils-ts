import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  bytesCodec,
} from '@algorandfoundation/algokit-common'

export type TransactionSignatureMultisigSubsignature = {
  /**
   * \[pk\]
   */
  publicKey?: Uint8Array

  /**
   * \[s\]
   */
  signature?: Uint8Array
}

export const TransactionSignatureMultisigSubsignatureMeta: ObjectModelMetadata<TransactionSignatureMultisigSubsignature> = {
  name: 'TransactionSignatureMultisigSubsignature',
  kind: 'object',
  fields: [
    {
      name: 'publicKey',
      wireKey: 'public-key',
      optional: true,
      codec: bytesCodec,
    },
    {
      name: 'signature',
      wireKey: 'signature',
      optional: true,
      codec: bytesCodec,
    },
  ],
}
