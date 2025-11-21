import { Buffer } from 'buffer'
import { ContextualCodec } from './contextual-codec'
import { ModelCodec } from './model'
import type { BodyFormat, FieldMetadata, ModelMetadata } from './types'
/**
 * Represents a map key coming off the wire.
 */
export type WireMapKey = Uint8Array | number | bigint

/**
 * Represents object data coming off the wire.
 *
 * When from msgpack it's a Map. Both bytes and string keys are represented as Uint8Array.
 * When from JSON it's a plain object with string keys.
 */
export type WireObject = Record<string, unknown> | Map<WireMapKey, unknown>

/**
 * Represents a bigint value coming off the wire.
 *
 * When from msgpack it could be a number or bigint, depending on size.
 * When from JSON it could be a number or string, depending on size.
 */
export type WireBigInt = string | number | bigint

/**
 * Represents a bytes value coming off the wire.
 *
 * When from msgpack it's a Uint8Array.
 * When from JSON it's a base64-encoded bytes string.
 */
export type WireBytes = Uint8Array | string

// TODO: NC - These should be removed
/**
 *
 * Wire data can be a Map (from msgpack) or a plain object (from JSON)
 */
type WireData = Map<string | Uint8Array, unknown> | Record<string, unknown>

/**
 * Wire entry: a key-value pair from wire data
 */
type WireEntry = [key: string | Uint8Array, value: unknown]

// TODO: NC - This is pretty inefficient, we can retrieve decoded values, the map, rather than per field we are searching for.
/**
 * Type-safe helper to get a value from either a Map or object
 */
export function getWireValue<T = unknown>(value: WireObject, key: string | WireMapKey): T | undefined {
  if (value instanceof Map) {
    const decodedKey = key instanceof Uint8Array ? Buffer.from(key).toString('utf-8') : key
    // Try direct key lookup
    if (typeof decodedKey !== 'string' && value.has(decodedKey)) {
      return value.get(decodedKey) as T | undefined
    }
    // Search for Uint8Array key that matches when decoded to string
    for (const [k, v] of value.entries()) {
      if (k instanceof Uint8Array) {
        const keyStr = Buffer.from(k).toString('utf-8')
        if (keyStr === decodedKey) {
          return v as T | undefined
        }
      }
    }
    return undefined
  }
  if (typeof key === 'string' && typeof value === 'object') {
    return value[key] as T | undefined
  }
  return undefined
}

/**
 * Model serializer using codec-based metadata system
 * Handles encoding/decoding of models with codec-based field definitions
 */
export class ModelSerializer {
  /**
   * Encode a model instance to wire format
   */

  // TODO: NC - We could call this toEncoded
  static encode<T extends Record<string, unknown>>(value: T, metadata: ModelMetadata, format: BodyFormat): Record<string, unknown> {
    if (metadata.kind !== 'object') {
      throw new Error(`Cannot encode model ${metadata.name}: expected object kind, got ${metadata.kind}`)
    }

    const result: Record<string, unknown> = {}

    for (const field of metadata.fields) {
      if (!field.codec) {
        throw new Error(`Field ${field.name} in ${metadata.name} does not have a codec`)
      }

      const fieldValue = value[field.name]

      if (field.flattened) {
        this.encodeFlattenedField(field, fieldValue, result, format)
        continue
      }

      const wireKey = field.wireKey ?? field.name
      const encoded = this.encodeFieldValue(field, fieldValue, value, format)

      if (encoded !== undefined) {
        result[wireKey] = encoded
      }
    }

    return result
  }

  /**
   * Decode wire format to a model instance
   */
  // TODO: NC - We could call this fromEncoded
  static decode<T>(wireData: unknown, metadata: ModelMetadata, format: BodyFormat): T {
    if (metadata.kind !== 'object') {
      throw new Error(`Cannot decode model ${metadata.name}: expected object kind, got ${metadata.kind}`)
    }

    const result: Record<string, unknown> = {}
    const usedKeys = new Set<string>()

    // Convert wire data to entries array
    const entries = this.getWireEntries(wireData)

    // Build a map of wire keys to fields for quick lookup
    const fieldByWireKey = this.buildFieldLookup(metadata.fields)

    // First pass: decode non-flattened fields
    for (const [key, wireValue] of entries) {
      const wireKey = this.normalizeKey(key)
      const field = fieldByWireKey.get(wireKey)

      if (field) {
        usedKeys.add(wireKey)
        const decodedValue = this.decodeFieldValue(field, wireValue, wireData, format)

        if (decodedValue !== undefined) {
          result[field.name] = decodedValue
        }
      }
    }

    // Second pass: decode required non-flattened fields that were missing from wireData
    // (they were omitted because they had default values)
    const shouldPopulateDefaults = Object.keys(result).length > 0 || wireData === undefined || wireData === null

    if (shouldPopulateDefaults) {
      for (const field of metadata.fields) {
        if (!field.codec || field.flattened || field.optional || result[field.name] !== undefined) {
          continue
        }

        // Decode with undefined to get default value for required field
        result[field.name] = this.decodeFieldValue(field, undefined, wireData, format)
      }
    }

    // Third pass: reconstruct flattened fields from remaining keys
    this.decodeFlattenedFields(metadata.fields, wireData, usedKeys, result, format)

    return result as T
  }

  /**
   * Convert wire data to an array of entries
   */
  private static getWireEntries(wireData: unknown): WireEntry[] {
    if (wireData === undefined || wireData === null) {
      return []
    }
    if (wireData instanceof Map) {
      return Array.from(wireData.entries())
    }
    if (typeof wireData === 'object') {
      return Object.entries(wireData as Record<string, unknown>)
    }
    return []
  }

  /**
   * Normalize a wire key to a string
   */
  private static normalizeKey(key: string | Uint8Array): string {
    return key instanceof Uint8Array ? Buffer.from(key).toString('utf-8') : String(key)
  }

  /**
   * Build a lookup map from wire keys to field metadata
   */
  private static buildFieldLookup(fields: readonly FieldMetadata[]): Map<string, FieldMetadata> {
    const lookup = new Map<string, FieldMetadata>()
    for (const field of fields) {
      if (field.codec && !field.flattened && field.wireKey) {
        lookup.set(field.wireKey, field)
      }
    }
    return lookup
  }

  private static encodeFieldValue(field: FieldMetadata, fieldValue: unknown, parent: Record<string, unknown>, format: BodyFormat): unknown {
    const codec = field.codec
    if (codec instanceof ContextualCodec) {
      return codec.encodeWithContext(fieldValue, parent, format)
    }
    return codec.encode(fieldValue, format)
  }

  private static encodeFlattenedField(
    field: FieldMetadata,
    fieldValue: unknown,
    result: Record<string, unknown>,
    format: BodyFormat,
  ): void {
    if (fieldValue === undefined) {
      return
    }

    const encoded = field.codec!.encode(fieldValue, format)

    if (encoded !== undefined && typeof encoded === 'object' && !Array.isArray(encoded)) {
      // Merge the encoded properties into the result
      Object.assign(result, encoded)
    }
  }

  /**
   * Decode a single field value, handling optional fields and contextual codecs
   */
  private static decodeFieldValue(field: FieldMetadata, wireValue: unknown, wireData: unknown, format: BodyFormat): unknown {
    if (!field.codec) {
      return undefined
    }

    // Use decodeOptional for optional fields to preserve undefined
    const codec = field.codec

    if (codec instanceof ContextualCodec) {
      return field.optional
        ? codec.decodeOptionalWithContext(wireValue, wireData, format)
        : codec.decodeWithContext(wireValue, wireData, format)
    }

    const decoded = field.optional ? codec.decodeOptional(wireValue, format) : codec.decode(wireValue, format)

    // Handle non-nullable fields: convert null to undefined
    if (decoded === null && !field.nullable) {
      return undefined
    }

    return decoded
  }

  /**
   * Filter wire data to include/exclude specific keys
   */
  private static filterWireData(
    wireData: unknown,
    usedKeys: Set<string>,
    filterKeys?: Set<string> | null,
  ): { data: WireData | null; keysConsumed: number } {
    if (wireData === undefined || wireData === null) {
      return { data: null, keysConsumed: 0 }
    }

    let keysConsumed = 0

    if (wireData instanceof Map) {
      const filteredMap = new Map<string | Uint8Array, unknown>()
      for (const [k, v] of wireData.entries()) {
        const keyStr = this.normalizeKey(k)
        const shouldInclude = filterKeys === null || filterKeys === undefined || filterKeys.has(keyStr)

        if (shouldInclude && !usedKeys.has(keyStr)) {
          filteredMap.set(k, v)
          usedKeys.add(keyStr)
          keysConsumed++
        }
      }
      return { data: filteredMap.size > 0 ? filteredMap : null, keysConsumed }
    }

    if (typeof wireData === 'object') {
      const filteredData: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(wireData as Record<string, unknown>)) {
        const shouldInclude = filterKeys === null || filterKeys === undefined || filterKeys.has(k)

        if (shouldInclude && !usedKeys.has(k)) {
          filteredData[k] = v
          usedKeys.add(k)
          keysConsumed++
        }
      }
      return { data: Object.keys(filteredData).length > 0 ? filteredData : null, keysConsumed }
    }

    return { data: null, keysConsumed: 0 }
  }

  /**
   * Decode flattened fields
   */
  private static decodeFlattenedFields(
    fields: readonly FieldMetadata[],
    wireData: unknown,
    usedKeys: Set<string>,
    result: Record<string, unknown>,
    format: BodyFormat,
  ): void {
    const flattenedFields = fields.filter((f) => f.flattened && f.codec)
    if (flattenedFields.length === 0) {
      return
    }

    // First pass: process flattened ModelCodec fields
    for (const field of flattenedFields) {
      if (!(field.codec instanceof ModelCodec) || result[field.name] !== undefined) {
        continue
      }

      const nestedMeta = field.codec.getMetadata()
      const nestedWireKeys = this.collectWireKeys(nestedMeta)
      const { data: filteredData, keysConsumed } = this.filterWireData(wireData, usedKeys, nestedWireKeys)

      if (filteredData === null) {
        continue
      }

      const decoded = this.decode(filteredData, nestedMeta, format)

      // Only set optional fields if they have content or consumed keys
      if (!field.optional || keysConsumed > 0 || !this.isEmptyObject(decoded)) {
        result[field.name] = decoded
      }
    }

    // Second pass: process flattened non-ModelCodec fields (get all remaining keys)
    for (const field of flattenedFields) {
      if (field.codec instanceof ModelCodec || result[field.name] !== undefined) {
        continue
      }

      const { data: filteredData } = this.filterWireData(wireData, usedKeys)

      if (filteredData === null) {
        continue
      }

      const decoded = field.codec.decode(filteredData, format)

      // Only set optional fields if they have content
      if (decoded !== undefined && (!field.optional || !this.isEmptyObject(decoded))) {
        result[field.name] = decoded
      }
    }
  }

  /**
   * Collect all wire keys used by a model (including nested models)
   * Returns null if the model has a flattened non-ModelCodec field (meaning we can't determine all keys)
   */
  private static collectWireKeys(meta: ModelMetadata): Set<string> | null {
    const wireKeys = new Set<string>()
    if (meta.kind !== 'object') return wireKeys

    for (const field of meta.fields) {
      if (field.codec) {
        if (field.wireKey && !field.flattened) {
          wireKeys.add(field.wireKey)
        }
        if (field.flattened) {
          if (field.codec instanceof ModelCodec) {
            // Recursively collect keys from flattened nested models
            const nestedMeta = field.codec.getMetadata()
            const nestedKeys = this.collectWireKeys(nestedMeta)
            if (nestedKeys === null) {
              // Nested model has external codec - can't determine all keys
              return null
            }
            for (const key of nestedKeys) {
              wireKeys.add(key)
            }
          } else {
            // Flattened non-ModelCodec field - we don't know what keys it uses
            return null
          }
        }
      }
    }

    return wireKeys
  }

  /**
   * Check if an object is empty (all values are undefined)
   */
  private static isEmptyObject(value: unknown): boolean {
    if (value === null || value === undefined) return true
    if (typeof value !== 'object') return false
    if (Array.isArray(value)) return false
    if (value instanceof Uint8Array) return false
    if (value instanceof Map) return value.size === 0

    // Check if it's a plain object with no own properties (excluding undefined values)
    const obj = value as Record<string, unknown>
    const keys = Object.keys(obj)
    if (keys.length === 0) return true

    // Check if all properties are undefined
    return keys.every((key) => obj[key] === undefined)
  }
}
