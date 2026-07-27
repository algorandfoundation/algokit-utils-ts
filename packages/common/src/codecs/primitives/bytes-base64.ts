import { Buffer } from 'buffer'
import { Codec } from '../codec'
import type { EncodingFormat } from '../types'
import { WireString } from '../wire'

// Some fields in the msgpack encoded models are base64 encoded strings representing bytes values.
// This is a deviation from the general pattern of using raw byte arrays for bytes fields in the wire format.
// This codec explicitly handles encoding/decoding of base64 string encoded bytes fields.
class BytesBase64Codec extends Codec<Uint8Array, WireString> {
  public defaultValue(): Uint8Array {
    return new Uint8Array()
  }

  protected toEncoded(value: Uint8Array, _format: EncodingFormat): WireString {
    return Buffer.from(value).toString('base64')
  }

  protected fromEncoded(value: WireString, _format: EncodingFormat): Uint8Array {
    if (value instanceof Uint8Array) {
      return new Uint8Array(Buffer.from(Buffer.from(value).toString('utf-8'), 'base64'))
    }
    if (typeof value === 'string') {
      return new Uint8Array(Buffer.from(value, 'base64'))
    }
    throw new Error(`Cannot decode bytes from ${typeof value}`)
  }

  public isDefaultValue(value: Uint8Array): boolean {
    return value.byteLength === 0
  }
}

export const bytesBase64Codec = new BytesBase64Codec()
