import type { ModelMetadata } from '../core/model-runtime'

export type TealCompile = {
  /**
   * base32 SHA512_256 of program bytes (Address style)
   */
  hash: string

  /**
   * base64 encoded program bytes
   */
  result: string

  /**
   * JSON of the source map
   */
  sourcemap?: Record<string, unknown>
}

export const TealCompileMeta: ModelMetadata = {
  name: 'TealCompile',
  kind: 'object',
  fields: [
    {
      name: 'hash',
      wireKey: 'hash',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'result',
      wireKey: 'result',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'sourcemap',
      wireKey: 'sourcemap',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
