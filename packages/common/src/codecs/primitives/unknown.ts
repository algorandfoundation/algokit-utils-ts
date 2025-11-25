import { ADDRESS_LENGTH, PUBLIC_KEY_BYTE_LENGTH, SIGNATURE_BYTE_LENGTH } from '../../constants'
import { Codec } from '../codec'
import { ArrayCodec } from '../composite/array'
import { RecordCodec } from '../composite/record'
import type { EncodingFormat } from '../types'
import { bigIntCodec } from './bigint'
import { booleanCodec } from './boolean'
import { numberCodec } from './number'
import { stringCodec } from './string'

/**
 * Unknown codec - passthrough for unknown/any types
 * Converts Maps with Uint8Array keys to objects with string keys recursively
 */
class UnknownCodec extends Codec<unknown, unknown> {
  private textDecoder = new TextDecoder('utf-8', { fatal: true })
  private recordCodec: RecordCodec<unknown, unknown>
  private arrayCodec: ArrayCodec<unknown, unknown>

  constructor() {
    super()
    this.recordCodec = new RecordCodec(this)
    this.arrayCodec = new ArrayCodec(this)
  }

  public defaultValue(): unknown {
    return undefined
  }

  protected toEncoded(_value: unknown, _format: EncodingFormat): unknown {
    throw new Error('UnknownCodec does not support encoding')
  }

  protected fromEncoded(value: unknown, format: EncodingFormat): unknown {
    return this.processValue(value, format)
  }

  private maybeDecodeAsUtf8(bytes: Uint8Array): string | Uint8Array {
    try {
      if (
        (bytes.length === ADDRESS_LENGTH || bytes.length === PUBLIC_KEY_BYTE_LENGTH || bytes.length === SIGNATURE_BYTE_LENGTH) &&
        bytes.every((byte) => byte === 0)
      ) {
        return bytes
      }
      return this.textDecoder.decode(bytes)
    } catch {
      // Not valid UTF-8, return the original bytes
      return bytes
    }
  }

  /**
   * Recursively process unknown values, using various codecs where appropriate
   */
  private processValue(value: unknown, format: EncodingFormat): unknown {
    if (value === null || value === undefined) return value
    if (value instanceof Uint8Array) return this.maybeDecodeAsUtf8(value)
    if (typeof value === 'bigint') return bigIntCodec.decode(value, format)
    if (typeof value === 'number') return numberCodec.decode(value, format)
    if (typeof value === 'string') return stringCodec.decode(value, format)
    if (typeof value === 'boolean') return booleanCodec.decode(value, format)

    if (Array.isArray(value)) {
      return this.arrayCodec.decode(value, format)
    }

    if (value instanceof Map || typeof value === 'object') {
      return this.recordCodec.decode(value as Parameters<typeof this.recordCodec.decode>[0], format)
    }

    return value
  }
}

export const unknownCodec = new UnknownCodec()
