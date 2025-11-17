import type { BodyFormat } from './types'

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
   * Encode a value to wire format
   * @param value - The application value
   * @param format - The wire format (json or msgpack)
   * @returns The encoded value, or undefined if it equals the default (will be omitted)
   */
  public encode(value: T | undefined, format: BodyFormat): TEncoded | undefined {
    if (value === undefined) return undefined
    if (this.isDefaultValue(value)) return undefined
    return this.toEncoded(value, format)
  }

  /**
   * Decode a value from wire format
   * @param value - The wire value
   * @param format - The wire format (json or msgpack)
   * @returns The decoded application value
   */
  public decode(value: TEncoded | undefined, format: BodyFormat): T {
    if (value === undefined) return this.defaultValue()
    return this.fromEncoded(value, format)
  }

  /**
   * Decode an optional value (preserves undefined vs default distinction)
   * @param value - The wire value
   * @param format - The wire format (json or msgpack)
   * @returns The decoded application value, or undefined if wire value was undefined
   */
  public decodeOptional(value: TEncoded | undefined, format: BodyFormat): T | undefined {
    if (value === undefined) return undefined
    return this.fromEncoded(value, format)
  }

  /**
   * Transform application value to wire format
   * Override this method to implement encoding logic
   * @param value - The application value (guaranteed to not be undefined or default)
   * @param format - The wire format
   * @returns The encoded value
   */
  protected abstract toEncoded(value: T, format: BodyFormat): TEncoded

  /**
   * Transform wire format to application value
   * Override this method to implement decoding logic
   * @param value - The wire value (guaranteed to not be undefined)
   * @param format - The wire format
   * @returns The decoded value
   */
  protected abstract fromEncoded(value: TEncoded, format: BodyFormat): T

  /**
   * Check if a value equals the default value (determines if it should be omitted during encoding)
   * Override this method for custom default comparison logic
   * @param value - The value to check
   * @returns True if value equals default
   */
  protected isDefaultValue(value: T): boolean {
    return value === this.defaultValue()
  }
}
