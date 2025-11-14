import type { ModelMetadata } from '../core/model-runtime'

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
      type: { kind: 'scalar' },
    },
    {
      name: 'sources',
      wireKey: 'sources',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar' } },
    },
    {
      name: 'names',
      wireKey: 'names',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar' } },
    },
    {
      name: 'mappings',
      wireKey: 'mappings',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
