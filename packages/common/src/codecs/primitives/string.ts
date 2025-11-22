import { Buffer } from 'buffer'
import { Codec } from '../codec'
import { WireBytes } from '../model-serializer'
import type { BodyFormat } from '../types'

class StringCodec extends Codec<string, WireBytes> {
  public defaultValue(): string {
    return ''
  }

  protected fromEncoded(value: WireBytes, _format: BodyFormat): string {
    // Due to how we need to configure msgpack decoding, Uint8Array values are returned for strings
    if (value instanceof Uint8Array) {
      return Buffer.from(value).toString('utf-8')
    }
    return value
  }
}

export const stringCodec = new StringCodec()
