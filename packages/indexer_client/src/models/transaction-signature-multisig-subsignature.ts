import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

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

export const TransactionSignatureMultisigSubsignatureMeta: ObjectModelMetadata = {
  name: 'TransactionSignatureMultisigSubsignature',
  kind: 'object',
  fields: [
    {
      name: 'publicKey',
      wireKey: 'public-key',
      optional: true,
      nullable: false,
      codec: bytesCodec,
    },
    {
      name: 'signature',
      wireKey: 'signature',
      optional: true,
      nullable: false,
      codec: bytesCodec,
    },
  ],
}
