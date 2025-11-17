import { Codec } from './codec'

/**
 * Wire format for encoding/decoding
 * - json: JSON string format
 * - msgpack: MessagePack binary format
 * - map: JavaScript Map object (used internally for type preservation)
 */
export type BodyFormat = 'json' | 'msgpack' | 'map'

/**
 * Metadata for a model field
 */
export interface FieldMetadata<T = any> {
  readonly name: string
  readonly wireKey?: string
  readonly codec: Codec<T, any>
  readonly optional: boolean
  readonly nullable: boolean
  readonly flattened?: boolean
}

/**
 * Model kind discriminator
 */
export type ModelKind = 'object' | 'array' | 'passthrough'

/**
 * Metadata for a model
 */
export interface ModelMetadata {
  readonly name: string
  readonly kind: ModelKind
  readonly fields?: readonly FieldMetadata[]
  readonly arrayCodec?: Codec<any[], any>
  readonly codec?: Codec<any, any>
}
