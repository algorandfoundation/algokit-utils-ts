import type { PassthroughModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * \[apan\] defines the what additional actions occur with the transaction.
 *
 * Valid types:
 * * noop
 * * optin
 * * closeout
 * * clear
 * * update
 * * delete
 */
export type OnCompletion = 'noop' | 'optin' | 'closeout' | 'clear' | 'update' | 'delete'

export const OnCompletionMeta: PassthroughModelMetadata = {
  name: 'OnCompletion',
  kind: 'passthrough',
  codec: stringCodec,
}
