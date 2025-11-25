import type { PrimitiveModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
} from '@algorandfoundation/algokit-common'

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

export const OnCompletionMeta: PrimitiveModelMetadata = {
  name: 'OnCompletion',
  kind: 'primitive',
  codec: stringCodec,
}
