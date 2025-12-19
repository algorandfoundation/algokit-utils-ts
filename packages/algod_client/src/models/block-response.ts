import type { Block } from './block'
import { blockCodec } from './block'
import { RecordCodec, unknownCodec, type ObjectModelMetadata } from '@algorandfoundation/algokit-common'

export type BlockResponse = {
  /** Block data including header and transactions. */
  block: Block
  /** Block certificate. */
  cert?: Record<string, unknown>
}

export const BlockResponseMeta: ObjectModelMetadata<BlockResponse> = {
  name: 'BlockResponse',
  kind: 'object',
  fields: [
    { name: 'block', wireKey: 'block', optional: false, codec: blockCodec },
    { name: 'cert', wireKey: 'cert', optional: true, codec: new RecordCodec(unknownCodec) },
  ],
}
