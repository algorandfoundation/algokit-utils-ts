import type { ModelMetadata } from '../core/model-runtime'

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

export const OnCompletionMeta: ModelMetadata = {
  name: 'OnCompletion',
  kind: 'passthrough',
  passThrough: { kind: 'scalar' },
}
