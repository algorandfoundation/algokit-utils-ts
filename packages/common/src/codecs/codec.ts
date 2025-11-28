/* eslint-disable unused-imports/no-unused-vars */
import type { EncodingFormat } from './types'

/**
 * A bidirectional codec that transforms between application types and wire formats.
 * Supports format-specific encoding (JSON vs msgpack).
 *
 * @template T - The application/runtime type (e.g., bigint, string, Uint8Array)
 * @template TEncoded - The wire format type (may differ based on format, e.g., bigint → string in JSON)
 */
export abstract class Codec<T, TEncoded = T> {
  /**
   * The default value for this type (used to determine if a value should be omitted during encoding)
   */
  public abstract defaultValue(): T

  /**
   * Encode a value, always returning the value regardless of if it is default
   * @param value - The application value
   * @param format - The wire format (json or msgpack)
   * @returns The encoded value, or the default if it is undefined or null
   */
  public encode(value: T | undefined | null, format: EncodingFormat): TEncoded {
    if (value === undefined || value === null || this.isDefaultValue(value)) return this.toEncoded(this.defaultValue(), format)
    return this.toEncoded(value, format)
  }

  /**
   * Encode a value, omitting it if set to the default value.
   * @param value - The application value
   * @param format - The wire format (json or msgpack)
   * @returns The encoded value, or undefined if it equals the default (will be omitted)
   */
  public encodeOptional(value: T | undefined | null, format: EncodingFormat): TEncoded | undefined {
    if (value === undefined || value === null) return undefined
    if (this.isDefaultValue(value)) return undefined
    return this.toEncoded(value, format)
  }

  /**
   * Decode a value from wire format
   * @param value - The wire value
   * @param format - The wire format (json or msgpack)
   * @returns The decoded application value
   */
  public decode(value: TEncoded | undefined | null, format: EncodingFormat): T {
    // undefined is encoded as msgpack nil, which may be decoded as JS null. Treat null and undefined the same.
    if (value === undefined || value === null) return this.defaultValue()
    const decoded = this.fromEncoded(value, format)
    if (this.isDefaultValue(decoded)) return this.defaultValue()
    return decoded
  }

  /**
   * Decode an optional value from wire format (preserves undefined vs default distinction)
   * @param value - The wire value
   * @param format - The wire format (json or msgpack)
   * @returns The decoded application value, or undefined if wire value was undefined
   */
  public decodeOptional(value: TEncoded | undefined | null, format: EncodingFormat): T | undefined {
    // undefined is encoded as msgpack nil, which may be decoded as JS null. Treat null and undefined the same.
    if (value === undefined || value === null) return undefined
    return this.fromEncoded(value, format)
  }

  /**
   * Transform application value to wire format
   * Override this method to implement encoding logic, otherwise defaults to pass-through
   * @param value - The application value (guaranteed to not be undefined or default)
   * @param format - The wire format
   * @returns The encoded value
   */
  protected toEncoded(value: T, format: EncodingFormat): TEncoded {
    return value as unknown as TEncoded
  }

  /**
   * Transform wire format to application value
   * Override this method to implement specific decoding logic, otherwise defaults to pass-through
   * @param value - The wire value (guaranteed to not be undefined)
   * @param format - The wire format
   * @returns The decoded value
   */
  protected fromEncoded(value: TEncoded, format: EncodingFormat): T {
    return value as unknown as T
  }

  /**
   * Check if a value equals the default value (determines if it should be omitted during encoding)
   * Override this method for custom default comparison logic, otherwise defaults to default value equality
   * @param value - The value to check
   * @returns True if value equals default
   */
  public isDefaultValue(value: T): boolean {
    return value === this.defaultValue()
  }
}
