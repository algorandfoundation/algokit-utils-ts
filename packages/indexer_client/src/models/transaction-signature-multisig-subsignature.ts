import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { fixedBytes32Codec, fixedBytes64Codec } from '@algorandfoundation/algokit-common'

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
      codec: fixedBytes32Codec,
    },
    {
      name: 'signature',
      wireKey: 'signature',
      optional: true,
      codec: fixedBytes64Codec,
    },
  ],
}
