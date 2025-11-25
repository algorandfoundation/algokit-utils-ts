import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  numberCodec,
  stringArrayCodec,
} from '@algorandfoundation/algokit-common'

/**
 * Source map for the program
 */
export type SourceMap = {
  version: number

  /**
   * A list of original sources used by the "mappings" entry.
   */
  sources: string[]

  /**
   * A list of symbol names used by the "mappings" entry.
   */
  names: string[]

  /**
   * A string with the encoded mapping data.
   */
  mappings: string
}

export const SourceMapMeta: ObjectModelMetadata = {
  name: 'SourceMap',
  kind: 'object',
  fields: [
    {
      name: 'version',
      wireKey: 'version',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'sources',
      wireKey: 'sources',
      optional: false,
      codec: stringArrayCodec,
    },
    {
      name: 'names',
      wireKey: 'names',
      optional: false,
      codec: stringArrayCodec,
    },
    {
      name: 'mappings',
      wireKey: 'mappings',
      optional: false,
      codec: stringCodec,
    },
  ],
}
