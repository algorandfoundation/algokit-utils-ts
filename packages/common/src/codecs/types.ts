import { Codec } from './codec'
import { ArrayCodec } from './composite/array'

/**
 * Encoding format
 */
export type EncodingFormat = 'json' | 'msgpack'

/**
 * Metadata for a model field
 */
export interface FieldMetadata {
  readonly name: string
  readonly wireKey?: string
  readonly codec: Codec<unknown, unknown>
  readonly optional: boolean
  readonly flattened?: boolean
}

export type ObjectModelMetadata = {
  readonly name: string
  readonly kind: 'object'
  readonly fields: readonly FieldMetadata[]
}

export type PrimitiveModelMetadata = {
  readonly name: string
  readonly kind: 'primitive'
  readonly codec: Codec<unknown, unknown>
}

export type ArrayModelMetadata = {
  readonly name: string
  readonly kind: 'array'
  readonly codec: ArrayCodec<unknown, unknown>
}
