import { Buffer } from 'buffer'
import { Codec } from '../codec'
import type { BodyFormat } from '../types'

class StringCodec extends Codec<string, string | Uint8Array> {
  public defaultValue(): string {
    return ''
  }

  protected fromEncoded(value: string | Uint8Array, _format: BodyFormat): string {
    // Due to how we need to configure msgpack decoding, Uint8Array values are returned for strings
    if (value instanceof Uint8Array) {
      return Buffer.from(value).toString('utf-8')
    }
    return value
  }
}

export const stringCodec = new StringCodec()
