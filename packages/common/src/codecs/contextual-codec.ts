import { Codec } from './codec'
import type { BodyFormat } from './types'

/**
 * A specialized codec that requires access to the parent object/DTO for encoding/decoding.
 *
 * This is useful for fields that have interdependencies within the same object, such as:
 * - Box references that need app references for indexing
 * - Access references that need de-duplication across multiple lists
 *
 * When ModelSerializer encounters a ContextualCodec, it passes the full parent object/DTO
 * instead of just the field value.
 *
 * @template T - The application/runtime type for this field
 * @template TEncoded - The wire format type for this field
 */
export abstract class ContextualCodec<T, TEncoded = T> extends Codec<T, TEncoded> {
  /**
   * Standard encode is not supported for contextual codecs.
   * Use encodeWithContext instead, which is called by ModelSerializer.
   */
  public encode(_value: T | undefined, _format: BodyFormat): TEncoded | undefined {
    throw new Error(
      `ContextualCodec.encode() should not be called directly. ` +
        `This codec requires the full parent object for encoding. ` +
        `It should only be used within ModelSerializer with proper metadata.`,
    )
  }

  /**
   * Standard decode is not supported for contextual codecs.
   * Use decodeWithContext instead, which is called by ModelSerializer.
   */
  public decode(_value: TEncoded | undefined, _format: BodyFormat): T {
    throw new Error(
      `ContextualCodec.decode() should not be called directly. ` +
        `This codec requires the full parent DTO for decoding. ` +
        `It should only be used within ModelSerializer with proper metadata.`,
    )
  }

  /**
   * Encode a field value with access to the full parent object.
   *
   * @param value - The field value to encode
   * @param parentObject - The complete parent object containing this field
   * @param format - The wire format (json or msgpack)
   * @returns The encoded value, or undefined if it should be omitted
   */
  public abstract encodeWithContext(value: T | undefined, parentObject: unknown, format: BodyFormat): TEncoded | undefined

  /**
   * Decode a field value with access to the full parent DTO.
   *
   * @param value - The encoded field value from the DTO
   * @param parentDTO - The complete parent DTO containing this field
   * @param format - The wire format (json or msgpack)
   * @returns The decoded application value
   */
  public abstract decodeWithContext(value: TEncoded | undefined, parentDTO: unknown, format: BodyFormat): T

  /**
   * Decode an optional field value with access to the full parent DTO.
   * Preserves undefined (whereas decodeWithContext returns default value for undefined).
   *
   * @param value - The encoded field value from the DTO
   * @param parentDTO - The complete parent DTO containing this field
   * @param format - The wire format (json or msgpack)
   * @returns The decoded application value, or undefined if wire value was undefined
   */
  public decodeOptionalWithContext(value: TEncoded | undefined, parentDTO: unknown, format: BodyFormat): T | undefined {
    if (value === undefined) return undefined
    return this.decodeWithContext(value, parentDTO, format)
  }

  // These methods are required by Codec but won't be called
  protected toEncoded(_value: T, _format: BodyFormat): TEncoded {
    throw new Error('ContextualCodec.toEncoded() should not be called')
  }

  protected fromEncoded(_value: TEncoded, _format: BodyFormat): T {
    throw new Error('ContextualCodec.fromEncoded() should not be called')
  }
}
