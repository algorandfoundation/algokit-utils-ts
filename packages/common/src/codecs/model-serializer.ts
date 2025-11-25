import { Buffer } from 'buffer'
import { ModelCodec } from './model'
import type { EncodingFormat, FieldMetadata, ModelMetadata } from './types'
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
 * When from JSON it could be a number or bigint (because of how we configure JSONbig), depending on size.
 */
export type WireBigInt = number | bigint

/**
 * Represents either a bytes or string value coming off the wire.
 *
 * When from msgpack it's a Uint8Array for both bytes or string values.
 * When from JSON it's a base64-encoded bytes string or regular string.
 */
export type WireStringOrBytes = Uint8Array | string

export function normalizeKey(key: string | WireMapKey): string {
  return key instanceof Uint8Array ? Buffer.from(key).toString('utf-8') : typeof key === 'string' ? key : String(key)
}

// TODO: NC - This is pretty inefficient, we can retrieve decoded values, the map, rather than per field we are searching for.
/**
 * Type-safe helper to get a value from either a Map or object
 */
export function getWireValue<T = unknown>(value: WireObject, key: string | WireMapKey): T | undefined {
  if (value instanceof Map) {
    const decodedKey = normalizeKey(key)
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

function normalizeWireObject(wireObject: WireObject): Record<string, unknown> {
  const normalized: Record<string, unknown> = {}

  if (wireObject instanceof Map) {
    for (const [key, value] of wireObject.entries()) {
      normalized[normalizeKey(key)] = value
    }
  } else if (typeof wireObject === 'object') {
    for (const [key, value] of Object.entries(wireObject)) {
      normalized[key] = value
    }
  }

  return normalized
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
  static encode<T extends Record<string, unknown>>(value: T, metadata: ModelMetadata, format: EncodingFormat): Record<string, unknown> {
    if (metadata.kind !== 'object') {
      throw new Error(`Cannot encode model ${metadata.name}: expected 'object' kind, got '${metadata.kind}'`)
    }

    const result: Record<string, unknown> = {}

    for (const field of metadata.fields) {
      const fieldValue = value[field.name]

      if (field.flattened) {
        const encoded = this.encodeFlattenedField(field, fieldValue, format)
        if (encoded !== undefined) {
          Object.assign(result, encoded)
        }
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
  static decode<T>(wireObject: WireObject, metadata: ModelMetadata, format: EncodingFormat): T {
    if (metadata.kind !== 'object') {
      throw new Error(`Cannot decode model ${metadata.name}: expected 'object' kind, got '${metadata.kind}'`)
    }

    const normalizedWireObject = normalizeWireObject(wireObject) // TODO: NC - Does this need to be used inside the codecs (object model codec)?
    // TODO: NC - If we can remove the need for codecs to think in terms of decoding the bytes wire key, that's big

    const result: Record<string, unknown> = {}

    for (const field of metadata.fields) {
      if (field.flattened) {
        // TODO: NC - This has lots of room for simplification
        let decoded: unknown
        if (field.codec instanceof ModelCodec) {
          // const nestedMeta = field.codec.getMetadata()
          // const decoded = this.decode(wireObject, nestedMeta, format) // TODO: NC - Trying the below
          // decoded = field.optional ? field.codec.decodeOptional(wireObject, format) : field.codec.decode(wireObject, format)
          decoded = this.decodeFieldValue(field, normalizedWireObject, format)
        } else {
          // decoded = field.codec.decode(wireObject, format)
          // decoded = field.optional ? field.codec.decodeOptional(wireObject, format) : field.codec.decode(wireObject, format)
          decoded = this.decodeFieldValue(field, normalizedWireObject, format)
        }
        // Only set optional fields if they have content
        if (decoded !== undefined && (!field.optional || !this.isEmptyObject(decoded))) {
          result[field.name] = decoded
        }
      } else {
        const wireKey = field.wireKey || field.name
        const wireValue = normalizedWireObject[wireKey]
        const decodedValue = this.decodeFieldValue(field, wireValue, format)
        if (decodedValue !== undefined) {
          result[field.name] = decodedValue
        }
      }
    }

    return result as T
  }

  private static encodeFieldValue(
    field: FieldMetadata,
    fieldValue: unknown,
    parent: Record<string, unknown>,
    format: EncodingFormat,
  ): unknown {
    return field.codec.encodeOptional(fieldValue, format)
  }

  private static encodeFlattenedField(
    field: FieldMetadata,
    fieldValue: unknown,
    format: EncodingFormat,
  ): Record<string, unknown> | undefined {
    const encoded = field.codec.encodeOptional(fieldValue, format)

    if (encoded !== undefined && typeof encoded === 'object' && !Array.isArray(encoded)) {
      if (encoded instanceof Map) {
        const result: Record<string, unknown> = {}
        for (const [key, value] of encoded.entries()) {
          result[normalizeKey(key)] = value
        }
        // Only return if the Map had entries
        return Object.keys(result).length > 0 ? result : undefined
      }
      // Only return non-empty objects
      return Object.keys(encoded as Record<string, unknown>).length > 0 ? (encoded as Record<string, unknown>) : undefined
    }

    return undefined
  }

  /**
   * Decode a single field value, handling optional fields and contextual codecs
   */
  private static decodeFieldValue(field: FieldMetadata, wireValue: unknown, format: EncodingFormat): unknown {
    return field.optional ? field.codec.decodeOptional(wireValue, format) : field.codec.decode(wireValue, format)
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
