import { Codec } from '../codec'
import type { EncodingFormat, FieldMetadata, ObjectModelMetadata } from '../types'
import { normalizeWireObject, type WireObject } from '../wire'

function isEmptyObject(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (typeof value !== 'object' || Array.isArray(value) || value instanceof Uint8Array) return false
  if (value instanceof Map) return value.size === 0

  const keys = Object.keys(value)
  return keys.length === 0 || keys.every((key) => (value as Record<string, unknown>)[key] === undefined)
}

export class ObjectModelCodec<T extends Record<string, unknown> = Record<string, unknown>> extends Codec<
  T,
  Record<string, unknown>,
  WireObject
> {
  private resolvedMetadata: ObjectModelMetadata<T> | undefined = undefined
  private resolvedDefaultValue: T | undefined = undefined

  constructor(private readonly metadata: ObjectModelMetadata<T> | (() => ObjectModelMetadata<T>)) {
    super()
  }

  // Override decode to preserve fields that were present in wire data even if they have default values.
  public decode(value: WireObject | undefined | null, format: EncodingFormat): T {
    if (value === undefined || value === null) return this.defaultValue()
    return this.fromEncoded(value, format)
  }

  private getMetadata(): ObjectModelMetadata<T> {
    if (!this.resolvedMetadata) {
      this.resolvedMetadata = typeof this.metadata === 'function' ? this.metadata() : this.metadata
    }
    return this.resolvedMetadata
  }

  public defaultValue(): T {
    if (this.resolvedDefaultValue === undefined) {
      const metadata = this.getMetadata()
      const result: Record<string, unknown> = {}
      for (const field of metadata.fields) {
        if (!field.optional) {
          result[field.name] = field.codec.defaultValue()
        }
      }
      this.resolvedDefaultValue = result as T
    }
    return this.resolvedDefaultValue
  }

  public isDefaultValue(value: T): boolean {
    const metadata = this.getMetadata()
    for (const field of metadata.fields) {
      const fieldValue = value[field.name]

      // Skip optional fields that are undefined (they're considered default)
      if (field.optional && (fieldValue === undefined || fieldValue === null)) {
        continue
      }

      // Check if the field value is at its default
      if (!field.codec.isDefaultValue(fieldValue)) {
        return false
      }
    }
    return true
  }

  protected toEncoded(value: T, format: EncodingFormat): Record<string, unknown> {
    const metadata = this.getMetadata()
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
      const encoded = field.codec.encodeOptional(fieldValue, format)

      if (encoded !== undefined && !isEmptyObject(encoded)) {
        result[wireKey] = encoded
      }
    }

    return result
  }

  protected fromEncoded(value: WireObject, format: EncodingFormat): T {
    const metadata = this.getMetadata()
    const normalizedWireObject = normalizeWireObject(value)

    const result: Record<string, unknown> = {}

    for (const field of metadata.fields) {
      if (field.flattened) {
        const decoded = this.decodeFieldValue(field, normalizedWireObject, format)
        // Set when not empty, or if required set regardless of if it's empty or not
        if (!isEmptyObject(decoded) || !field.optional) {
          result[field.name] = decoded
        }
      } else {
        const wireKey = field.wireKey || field.name
        const wireValue = normalizedWireObject[wireKey]
        const decoded = this.decodeFieldValue(field, wireValue, format)
        // Set when not empty, or if required set regardless of if it's empty or not
        if (!isEmptyObject(decoded) || !field.optional) {
          result[field.name] = decoded
        }
      }
    }

    return result as T
  }

  private encodeFlattenedField(field: FieldMetadata, fieldValue: unknown, format: EncodingFormat): Record<string, unknown> | undefined {
    const encoded = field.codec.encodeOptional(fieldValue, format)
    if (encoded !== undefined && typeof encoded === 'object' && !Array.isArray(encoded)) {
      return normalizeWireObject(encoded as WireObject)
    }
    return {}
  }

  private decodeFieldValue(field: FieldMetadata, wireValue: unknown, format: EncodingFormat): unknown {
    return field.optional ? field.codec.decodeOptional(wireValue, format) : field.codec.decode(wireValue, format)
  }
}
