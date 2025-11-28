import { Buffer } from 'buffer'
import { Codec } from '../codec'
import type { EncodingFormat } from '../types'
import { WireString } from '../wire'

export class FixedBytesCodec extends Codec<Uint8Array, WireString> {
  constructor(private readonly length: number) {
    super()
  }

  public defaultValue(): Uint8Array {
    return new Uint8Array(this.length)
  }

  protected toEncoded(value: Uint8Array, format: EncodingFormat): WireString {
    if (format === 'json') {
      return Buffer.from(value).toString('base64')
    }
    return value
  }

  protected fromEncoded(value: WireString, _format: EncodingFormat): Uint8Array {
    if (value instanceof Uint8Array) return value
    if (typeof value === 'string') {
      return new Uint8Array(Buffer.from(value, 'base64'))
    }
    throw new Error(`Cannot decode fixed ${this.length} bytes from ${typeof value}`)
  }

  public isDefaultValue(value: Uint8Array): boolean {
    if (value.byteLength !== this.length) return false
    return value.every((byte) => byte === 0)
  }
}

export const fixedBytes32Codec = new FixedBytesCodec(32)
export const fixedBytes64Codec = new FixedBytesCodec(64)
export const fixedBytes1793Codec = new FixedBytesCodec(1793) // For Falcon signatures (0x701)
