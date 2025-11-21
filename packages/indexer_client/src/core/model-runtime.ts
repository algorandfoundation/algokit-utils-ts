import { decodeMsgPack, encodeMsgPack } from './codecs'
import {
  ModelSerializer,
  type FieldMetadata,
  type BodyFormat,
  type ModelMetadata,
  type ObjectModelMetadata,
  type PassthroughModelMetadata,
  type ArrayModelMetadata,
} from '@algorandfoundation/algokit-common'

// Re-export types for convenience
export type { BodyFormat, FieldMetadata, ModelMetadata, ObjectModelMetadata, PassthroughModelMetadata, ArrayModelMetadata }

export class AlgorandSerializer {
  static encode(value: Record<string, unknown>, meta: ModelMetadata, format: 'map'): Map<string, unknown>
  static encode(value: Record<string, unknown>, meta: ModelMetadata, format: 'json'): string
  static encode(value: Record<string, unknown>, meta: ModelMetadata, format?: 'msgpack'): Uint8Array
  static encode(
    value: Record<string, unknown>,
    meta: ModelMetadata,
    format: BodyFormat | 'map' = 'msgpack',
  ): Uint8Array | string | Map<string, unknown> {
    if (format === 'map') {
      // For map format, use msgpack transformation to preserve types like bigint, then convert to nested Maps
      const wire = ModelSerializer.encode(value, meta, 'msgpack')
      return this.convertToNestedMaps(wire) as Map<string, unknown>
    }

    const wire = ModelSerializer.encode(value, meta, format)
    if (format === 'msgpack') {
      return wire instanceof Uint8Array ? wire : encodeMsgPack(wire)
    }
    return typeof wire === 'string' ? wire : JSON.stringify(wire)
  }

  static decode<T>(value: Uint8Array | string, meta: ModelMetadata, format: BodyFormat = 'msgpack'): T {
    let wire: Record<string, unknown> | Map<number | bigint | Uint8Array, unknown>
    if (value instanceof Uint8Array) {
      wire = decodeMsgPack(value)
    } else if (typeof value === 'string') {
      wire = JSON.parse(value)
    } else {
      wire = value
    }
    return ModelSerializer.decode(wire, meta, format) as T
  }

  /**
   * Convert nested plain objects to Maps recursively
   * Used for the 'map' format to ensure consistent Map usage throughout
   */
  private static convertToNestedMaps(value: any): any {
    if (value === null || value === undefined) return value
    if (value instanceof Uint8Array) return value
    if (typeof value === 'bigint') return value
    if (typeof value === 'number') return value
    if (typeof value === 'string') return value
    if (typeof value === 'boolean') return value

    if (Array.isArray(value)) {
      return value.map((item) => this.convertToNestedMaps(item))
    }

    if (value instanceof Map) {
      const result = new Map()
      for (const [k, v] of value.entries()) {
        result.set(k, this.convertToNestedMaps(v))
      }
      return result
    }

    if (typeof value === 'object') {
      const result = new Map<string, any>()
      for (const [k, v] of Object.entries(value)) {
        result.set(k, this.convertToNestedMaps(v))
      }
      return result
    }

    return value
  }
}
