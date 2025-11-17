import { Codec } from './codec'
import type { BodyFormat } from './types'

/**
 * Array codec - encodes each element using the item codec
 * Empty arrays are encoded as undefined (omitted)
 */
export class ArrayCodec<T, TEncoded = T> extends Codec<T[], TEncoded[] | undefined> {
  constructor(private readonly itemCodec: Codec<T, TEncoded>) {
    super()
  }

  public defaultValue(): T[] {
    return []
  }

  protected toEncoded(value: T[], format: BodyFormat): TEncoded[] | undefined {
    if (value.length === 0) return undefined
    return value.map((item) => {
      const encoded = this.itemCodec.encode(item, format)
      // If encoded is undefined, this shouldn't happen for non-default values
      // but TypeScript needs the cast
      return encoded !== undefined ? encoded : (this.itemCodec.defaultValue() as unknown as TEncoded)
    })
  }

  protected fromEncoded(value: TEncoded[] | undefined, format: BodyFormat): T[] {
    if (value === undefined || value.length === 0) return []
    return value.map((item) => this.itemCodec.decode(item, format))
  }

  protected isDefaultValue(value: T[]): boolean {
    return value.length === 0
  }
}

/**
 * Map codec - handles Maps with any key type (including Uint8Array, bigint, number)
 * - JSON: Map → array of [key, value] tuples (since JSON can't have non-string keys)
 * - Msgpack: Map → Map (native pass-through, preserves binary keys)
 *
 * This is critical for Algorand's msgpack data which uses Maps with Uint8Array and bigint keys
 */
export class MapCodec<K, V, KEncoded = K, VEncoded = V> extends Codec<Map<K, V>, Map<KEncoded, VEncoded> | Array<[KEncoded, VEncoded]>> {
  constructor(
    private readonly keyCodec: Codec<K, KEncoded>,
    private readonly valueCodec: Codec<V, VEncoded>,
  ) {
    super()
  }

  public defaultValue(): Map<K, V> {
    return new Map()
  }

  protected toEncoded(value: Map<K, V>, format: BodyFormat): Map<KEncoded, VEncoded> | Array<[KEncoded, VEncoded]> {
    const entries: Array<[KEncoded, VEncoded]> = []

    for (const [k, v] of value.entries()) {
      const encodedKey = this.keyCodec.encode(k, format)
      const encodedValue = this.valueCodec.encode(v, format)

      if (encodedKey !== undefined && encodedValue !== undefined) {
        entries.push([encodedKey, encodedValue])
      }
    }

    // JSON must use array of tuples (can't have non-string keys in JSON)
    if (format === 'json') {
      return entries
    }

    // Msgpack can use native Map (preserves Uint8Array, bigint keys)
    return new Map(entries)
  }

  protected fromEncoded(value: Map<KEncoded, VEncoded> | Array<[KEncoded, VEncoded]>, format: BodyFormat): Map<K, V> {
    const result = new Map<K, V>()

    // Handle undefined/null
    if (value === undefined || value === null) {
      return result
    }

    // Convert all input types to a uniform entries array
    let entries: Array<[KEncoded, VEncoded]>
    if (value instanceof Map) {
      entries = Array.from(value.entries())
    } else if (Array.isArray(value)) {
      entries = value
    } else {
      // Plain object - convert to entries array
      entries = Object.entries(value as object) as Array<[KEncoded, VEncoded]>
    }

    // Single decoding loop for all entry types
    for (const [encodedKey, encodedValue] of entries) {
      const key = this.keyCodec.decode(encodedKey as KEncoded, format)
      const val = this.valueCodec.decode(encodedValue, format)
      result.set(key, val)
    }

    return result
  }

  protected isDefaultValue(value: Map<K, V>): boolean {
    return value.size === 0
  }
}

/**
 * Record codec - for string-keyed objects with homogeneous values
 * Example: Record<string, number> for arbitrary string→number mappings
 */
export class RecordCodec<V, VEncoded = V> extends Codec<Record<string, V>, Record<string, VEncoded>> {
  constructor(private readonly valueCodec: Codec<V, VEncoded>) {
    super()
  }

  public defaultValue(): Record<string, V> {
    return {}
  }

  protected toEncoded(value: Record<string, V>, format: BodyFormat): Record<string, VEncoded> {
    const result: Record<string, VEncoded> = {}

    for (const [key, val] of Object.entries(value)) {
      const encoded = this.valueCodec.encode(val, format)
      if (encoded !== undefined) {
        result[key] = encoded
      }
    }

    return result
  }

  protected fromEncoded(value: Record<string, VEncoded> | Map<string | Uint8Array, VEncoded>, format: BodyFormat): Record<string, V> {
    const result: Record<string, V> = {}

    if (value instanceof Map) {
      for (const [key, val] of value.entries()) {
        // Convert Uint8Array keys to UTF-8 strings
        const strKey = key instanceof Uint8Array ? Buffer.from(key).toString('utf-8') : key
        result[strKey] = this.valueCodec.decode(val, format)
      }
    } else {
      for (const [key, val] of Object.entries(value)) {
        result[key] = this.valueCodec.decode(val, format)
      }
    }

    return result
  }

  protected isDefaultValue(value: Record<string, V>): boolean {
    return Object.keys(value).length === 0
  }
}

/**
 * Optional codec - wraps another codec to handle optional (T | undefined) values
 * Preserves undefined (doesn't convert to default)
 */
export class OptionalCodec<T, TEncoded = T> extends Codec<T | undefined, TEncoded | undefined> {
  constructor(private readonly innerCodec: Codec<T, TEncoded>) {
    super()
  }

  public defaultValue(): T | undefined {
    return undefined
  }

  protected toEncoded(value: T | undefined, format: BodyFormat): TEncoded | undefined {
    if (value === undefined) return undefined
    return this.innerCodec.encode(value, format)
  }

  protected fromEncoded(value: TEncoded | undefined, format: BodyFormat): T | undefined {
    if (value === undefined) return undefined
    return this.innerCodec.decode(value, format)
  }

  protected isDefaultValue(value: T | undefined): boolean {
    return value === undefined
  }
}

/**
 * Nullable codec - wraps another codec to handle nullable (T | null) values
 * Preserves null (doesn't convert to default)
 */
export class NullableCodec<T, TEncoded = T> extends Codec<T | null, TEncoded | null> {
  constructor(private readonly innerCodec: Codec<T, TEncoded>) {
    super()
  }

  public defaultValue(): T | null {
    return null
  }

  protected toEncoded(value: T | null, format: BodyFormat): TEncoded | null {
    if (value === null) return null
    const encoded = this.innerCodec.encode(value, format)
    return encoded !== undefined ? encoded : null
  }

  protected fromEncoded(value: TEncoded | null, format: BodyFormat): T | null {
    if (value === null) return null
    return this.innerCodec.decode(value, format)
  }

  protected isDefaultValue(value: T | null): boolean {
    return value === null
  }
}

/**
 * OmitEmptyObject codec - omits objects where all fields are undefined
 * Useful for optional nested objects
 */
export class OmitEmptyObjectCodec<T extends object> extends Codec<T | undefined, T | undefined> {
  public defaultValue(): T | undefined {
    return undefined
  }

  protected toEncoded(value: T | undefined, format: BodyFormat): T | undefined {
    if (value === undefined) return undefined
    // Check if all values are undefined
    const hasDefinedValue = Object.values(value).some((v) => v !== undefined)
    return hasDefinedValue ? value : undefined
  }

  protected fromEncoded(value: T | undefined, format: BodyFormat): T | undefined {
    return value
  }

  protected isDefaultValue(value: T | undefined): boolean {
    if (value === undefined) return true
    return Object.values(value).every((v) => v === undefined)
  }
}

// Import primitive codecs for array instances
import { bytesCodec, addressCodec, bigIntCodec } from './primitives'

// Common array codec instances
export const bytesArrayCodec = new ArrayCodec(bytesCodec)
export const addressArrayCodec = new ArrayCodec(addressCodec)
export const bigIntArrayCodec = new ArrayCodec(bigIntCodec)
