import { Codec } from '../codec'
import type { EncodingFormat } from '../types'
import { normalizeWireString, WireString } from '../wire'

class StringCodec extends Codec<string, WireString> {
  public defaultValue(): string {
    return ''
  }

  protected fromEncoded(value: WireString, _format: EncodingFormat): string {
    // Due to how we need to configure msgpack decoding, Uint8Array values are returned for strings
    return normalizeWireString(value)
  }
}

export const stringCodec = new StringCodec()
