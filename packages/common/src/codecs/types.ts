import { Codec } from './codec'
import { ArrayCodec } from './composite'

/**
 * Encoding format
 */
export type BodyFormat = 'json' | 'msgpack' // TODO: NC - Rename to EncodingFormat

/**
 * Metadata for a model field
 */
export interface FieldMetadata {
  readonly name: string
  readonly wireKey?: string
  readonly codec: Codec<unknown, unknown>
  readonly optional: boolean
  readonly nullable: boolean
  readonly flattened?: boolean
}

/**
 * Metadata for a model
 */
export type ModelMetadata = ObjectModelMetadata | PassthroughModelMetadata | ArrayModelMetadata

export type ObjectModelMetadata = {
  readonly name: string
  readonly kind: 'object'
  readonly fields: readonly FieldMetadata[]
}

export type PassthroughModelMetadata = {
  readonly name: string
  readonly kind: 'passthrough' // TODO: NC - Is there better to be named primitive or scalar?
  readonly codec: Codec<unknown, unknown>
}

export type ArrayModelMetadata = {
  readonly name: string
  readonly kind: 'array'
  readonly codec: ArrayCodec<unknown, unknown>
}
