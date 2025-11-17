import { addressFromPublicKey, publicKeyFromAddress } from '../address'
import { PUBLIC_KEY_BYTE_LENGTH } from '../constants'
import { Buffer } from 'buffer'
import { Codec } from './codec'
import type { BodyFormat } from './types'

/**
 * String codec - handles Uint8Array conversion for msgpack format
 */
export class StringCodec extends Codec<string, string | Uint8Array> {
  public defaultValue(): string {
    return ''
  }

  protected toEncoded(value: string, format: BodyFormat): string {
    return value
  }

  protected fromEncoded(value: string | Uint8Array, format: BodyFormat): string {
    // msgpack may return strings as Uint8Array when rawBinaryStringValues is true
    if (value instanceof Uint8Array) {
      return Buffer.from(value).toString('utf-8')
    }
    return value
  }
}

/**
 * Number codec - pass-through for both formats
 */
export class NumberCodec extends Codec<number, number> {
  public defaultValue(): number {
    return 0
  }

  protected toEncoded(value: number, format: BodyFormat): number {
    return value
  }

  protected fromEncoded(value: number, format: BodyFormat): number {
    return value
  }
}

/**
 * Boolean codec - pass-through for both formats
 */
export class BooleanCodec extends Codec<boolean, boolean> {
  public defaultValue(): boolean {
    return false
  }

  protected toEncoded(value: boolean, format: BodyFormat): boolean {
    return value
  }

  protected fromEncoded(value: boolean, format: BodyFormat): boolean {
    return value
  }
}

/**
 * BigInt codec - format-aware encoding
 * - JSON: bigint → string
 * - Msgpack: bigint → bigint | number (optimized to number if fits in 32-bit)
 */
export class BigIntCodec extends Codec<bigint, string | bigint | number> {
  public defaultValue(): bigint {
    return 0n
  }

  protected toEncoded(value: bigint, format: BodyFormat): string | bigint | number {
    if (format === 'json') {
      return value.toString()
    }

    // Msgpack: optimize to number if fits in 32-bit signed integer range
    if (value >= -(2n ** 31n) && value < 2n ** 31n) {
      return Number(value)
    }
    return value
  }

  protected fromEncoded(value: string | bigint | number, format: BodyFormat): bigint {
    if (typeof value === 'bigint') return value
    if (typeof value === 'number') return BigInt(value)
    if (typeof value === 'string') return BigInt(value)
    throw new Error(`Cannot decode bigint from ${typeof value}`)
  }
}

/**
 * Uint8Array codec - format-aware encoding
 * - JSON: Uint8Array → base64 string
 * - Msgpack: Uint8Array → Uint8Array (pass-through)
 */
export class BytesCodec extends Codec<Uint8Array, Uint8Array | string> {
  public defaultValue(): Uint8Array {
    return new Uint8Array(0)
  }

  protected toEncoded(value: Uint8Array, format: BodyFormat): Uint8Array | string {
    if (format === 'json') {
      return Buffer.from(value).toString('base64')
    }
    return value
  }

  protected fromEncoded(value: Uint8Array | string, format: BodyFormat): Uint8Array {
    if (value instanceof Uint8Array) return value
    if (typeof value === 'string') {
      return new Uint8Array(Buffer.from(value, 'base64'))
    }
    throw new Error(`Cannot decode bytes from ${typeof value}`)
  }

  protected isDefaultValue(value: Uint8Array): boolean {
    return value.length === 0
  }
}

/**
 * Fixed-length Uint8Array codec
 * Useful for hash values, public keys, etc.
 */
export class FixedBytesCodec extends Codec<Uint8Array, Uint8Array | string> {
  constructor(private readonly length: number) {
    super()
  }

  public defaultValue(): Uint8Array {
    return new Uint8Array(this.length)
  }

  protected toEncoded(value: Uint8Array, format: BodyFormat): Uint8Array | string {
    if (format === 'json') {
      return Buffer.from(value).toString('base64')
    }
    return value
  }

  protected fromEncoded(value: Uint8Array | string, format: BodyFormat): Uint8Array {
    if (value instanceof Uint8Array) return value
    if (typeof value === 'string') {
      return new Uint8Array(Buffer.from(value, 'base64'))
    }
    throw new Error(`Cannot decode fixed bytes from ${typeof value}`)
  }

  protected isDefaultValue(value: Uint8Array): boolean {
    if (value.length !== this.length) return false
    return value.every((byte) => byte === 0)
  }
}

/**
 * Address codec - format-aware encoding
 * - JSON: string → string (base32 address, pass-through)
 * - Msgpack: string → Uint8Array (raw 32 bytes)
 */
export class AddressCodec extends Codec<string, string | Uint8Array> {
  private static readonly ZERO_ADDRESS = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ'

  public defaultValue(): string {
    return AddressCodec.ZERO_ADDRESS
  }

  protected toEncoded(value: string, format: BodyFormat): string | Uint8Array {
    if (format === 'json') {
      return value
    }
    // Msgpack: encode to raw 32-byte public key
    return publicKeyFromAddress(value)
  }

  protected fromEncoded(value: string | Uint8Array, format: BodyFormat): string {
    if (typeof value === 'string') return value
    if (value instanceof Uint8Array) {
      return addressFromPublicKey(value)
    }
    throw new Error(`Cannot decode address from ${typeof value}`)
  }

  protected isDefaultValue(value: string): boolean {
    return value === AddressCodec.ZERO_ADDRESS
  }
}

// Export singleton instances for common use
export const stringCodec = new StringCodec()
export const numberCodec = new NumberCodec()
export const booleanCodec = new BooleanCodec()
export const bigIntCodec = new BigIntCodec()
export const bytesCodec = new BytesCodec()
export const addressCodec = new AddressCodec()

// Common fixed-length byte codecs
export const fixedBytes32Codec = new FixedBytesCodec(32)
export const fixedBytes64Codec = new FixedBytesCodec(64)
export const fixedBytes1793Codec = new FixedBytesCodec(1793) // For Falcon signatures (0x701)

/**
 * Unknown codec - passthrough for unknown/any types
 * Converts Maps with Uint8Array keys to objects with string keys recursively
 */
export class UnknownCodec extends Codec<unknown, unknown> {
  public defaultValue(): unknown {
    return undefined
  }

  protected toEncoded(value: unknown, format: BodyFormat): unknown {
    return value
  }

  protected fromEncoded(value: unknown, format: BodyFormat): unknown {
    return this.mapToObject(value)
  }

  /**
   * Recursively convert Maps with Uint8Array keys to objects with string keys
   */
  private mapToObject(value: unknown): unknown {
    if (value === null || value === undefined) return value
    if (value instanceof Uint8Array) return value
    if (typeof value === 'bigint') return value
    if (typeof value === 'number') return value
    if (typeof value === 'string') return value
    if (typeof value === 'boolean') return value

    if (Array.isArray(value)) {
      return value.map((item) => this.mapToObject(item))
    }

    if (value instanceof Map) {
      const result: Record<string, unknown> = {}
      for (const [k, v] of value.entries()) {
        const keyStr = k instanceof Uint8Array ? Buffer.from(k).toString('utf-8') : String(k)
        result[keyStr] = this.mapToObject(v)
      }
      return result
    }

    if (typeof value === 'object') {
      const result: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(value)) {
        result[k] = this.mapToObject(v)
      }
      return result
    }

    return value
  }
}

export const unknownCodec = new UnknownCodec()
