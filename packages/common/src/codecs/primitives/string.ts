import { Buffer } from 'buffer'
import { Codec } from '../codec'
import { WireStringOrBytes } from '../model-serializer'
import type { EncodingFormat } from '../types'

class StringCodec extends Codec<string, WireStringOrBytes> {
  public defaultValue(): string {
    return ''
  }

  protected fromEncoded(value: WireStringOrBytes, _format: EncodingFormat): string {
    // Due to how we need to configure msgpack decoding, Uint8Array values are returned for strings
    if (value instanceof Uint8Array) {
      return Buffer.from(value).toString('utf-8')
    }
    return value
  }
}

export const stringCodec = new StringCodec()
