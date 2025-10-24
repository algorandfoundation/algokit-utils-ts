import type { ModelMetadata } from '../core/model-runtime'
import type { AvmValue } from './avm-value'
import { AvmValueMeta } from './avm-value'

/**
 * A write operation into a scratch slot.
 */
export type ScratchChange = {
  /**
   * The scratch slot written.
   */
  slot: bigint
  newValue: AvmValue
}

export const ScratchChangeMeta: ModelMetadata = {
  name: 'ScratchChange',
  kind: 'object',
  fields: [
    {
      name: 'slot',
      wireKey: 'slot',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'newValue',
      wireKey: 'new-value',
      optional: false,
      nullable: false,
      type: { kind: 'model', meta: () => AvmValueMeta },
    },
  ],
}
