import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec } from '@algorandfoundation/algokit-common'

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

export const SourceMapMeta: ModelMetadata = {
  name: 'SourceMap',
  kind: 'object',
  fields: [
    {
      name: 'version',
      wireKey: 'version',
      optional: false,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'sources',
      wireKey: 'sources',
      optional: false,
      nullable: false,
      codec: new ArrayCodec(stringCodec),
    },
    {
      name: 'names',
      wireKey: 'names',
      optional: false,
      nullable: false,
      codec: new ArrayCodec(stringCodec),
    },
    {
      name: 'mappings',
      wireKey: 'mappings',
      optional: false,
      nullable: false,
      codec: stringCodec,
    },
  ],
}
