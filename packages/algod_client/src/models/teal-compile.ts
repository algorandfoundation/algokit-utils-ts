import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { SourceMap } from './source-map'
import { SourceMapMeta } from './source-map'

export type TealCompile = {
  /**
   * base32 SHA512_256 of program bytes (Address style)
   */
  hash: string

  /**
   * base64 encoded program bytes
   */
  result: string
  sourcemap?: SourceMap
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
      codec: stringCodec,
    },
    {
      name: 'result',
      wireKey: 'result',
      optional: false,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'sourcemap',
      wireKey: 'sourcemap',
      optional: true,
      nullable: false,
      codec: new ModelCodec(SourceMapMeta),
    },
  ],
}
