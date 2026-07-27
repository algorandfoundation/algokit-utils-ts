import { Buffer } from 'buffer'
import { Codec } from '../codec'
import type { EncodingFormat } from '../types'
import { WireObject } from '../wire'

/**
 * Record codec - for string-keyed objects with homogeneous values
 */
export class RecordCodec<V, VEncoded = V> extends Codec<Record<string, V>, Record<string, VEncoded>, WireObject<VEncoded>> {
  constructor(private readonly valueCodec: Codec<V, VEncoded>) {
    super()
  }

  public defaultValue(): Record<string, V> {
    return {}
  }

  protected toEncoded(value: Record<string, V>, format: EncodingFormat): Record<string, VEncoded> {
    const result: Record<string, VEncoded> = {}

    for (const [key, val] of Object.entries(value)) {
      const encoded = this.valueCodec.encode(val, format)
      result[key] = encoded
    }

    return result
  }

  protected fromEncoded(value: WireObject<VEncoded>, format: EncodingFormat): Record<string, V> {
    const result: Record<string, V> = {}
    if (value instanceof Map) {
      for (const [_key, val] of value.entries()) {
        const keyType = typeof _key
        if (keyType === 'number' || keyType === 'bigint') {
          throw new Error(`RecordCodec received a non-string key of type ${keyType}`)
        }
        const key = _key instanceof Uint8Array ? Buffer.from(_key).toString('utf-8') : String(_key)
        result[key] = this.valueCodec.decode(val, format)
      }
    } else {
      for (const [key, val] of Object.entries(value)) {
        result[key] = this.valueCodec.decode(val, format)
      }
    }

    return result
  }

  public isDefaultValue(value: Record<string, V>): boolean {
    return Object.keys(value).length === 0
  }
}
