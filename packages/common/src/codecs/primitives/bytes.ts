import { Buffer } from 'buffer'
import { Codec } from '../codec'
import { WireStringOrBytes } from '../model-serializer'
import type { EncodingFormat } from '../types'

class BytesCodec extends Codec<Uint8Array, WireStringOrBytes> {
  public defaultValue(): Uint8Array {
    return new Uint8Array()
  }

  protected toEncoded(value: Uint8Array, format: EncodingFormat): WireStringOrBytes {
    if (format === 'json') {
      return Buffer.from(value).toString('base64')
    }
    return value
  }

  protected fromEncoded(value: WireStringOrBytes, _format: EncodingFormat): Uint8Array {
    if (value instanceof Uint8Array) return value
    if (typeof value === 'string') {
      return new Uint8Array(Buffer.from(value, 'base64'))
    }
    throw new Error(`Cannot decode bytes from ${typeof value}`)
  }

  public isDefaultValue(value: Uint8Array): boolean {
    return value.byteLength === 0
  }
}

export const bytesCodec = new BytesCodec()
