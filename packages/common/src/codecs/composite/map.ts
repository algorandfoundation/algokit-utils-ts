import { Codec } from '../codec'
import type { EncodingFormat } from '../types'

/**
 * Map codec - handles Maps with any key type (including Uint8Array, bigint, number)
 * Depending on the encoding format, the map is encoded differently:
 * - json: Supports string and bigint keys. The map is represented as an object when encoding.
 *   Bigint keys are converted to/from strings (e.g., 1n becomes "1").
 *   An exception is thrown upon encountering an unsupported key type.
 * - msgpack: Preserves key types and is represented as a Map when encoding.
 */
export class MapCodec<K, V, KEncoded = K, VEncoded = V> extends Codec<Map<K, V>, Map<KEncoded, VEncoded> | Record<string, VEncoded>> {
  private keyType: string

  constructor(
    private readonly keyCodec: Codec<K, KEncoded>,
    private readonly valueCodec: Codec<V, VEncoded>,
  ) {
    super()
    const defaultKeyValue = this.keyCodec.defaultValue()
    this.keyType = defaultKeyValue instanceof Uint8Array ? 'Uint8Array' : typeof defaultKeyValue
  }

  public defaultValue(): Map<K, V> {
    return new Map()
  }

  private ensureKeyIsSupported(format: EncodingFormat) {
    if (format === 'msgpack') {
      return true
    }
    if (this.keyType !== 'string' && this.keyType !== 'bigint') {
      throw new Error(`Map key of type '${this.keyType}' is not supported in ${format} format`)
    }
  }

  protected toEncoded(value: Map<K, V>, format: EncodingFormat): Map<KEncoded, VEncoded> | Record<string, VEncoded> {
    this.ensureKeyIsSupported(format)

    const entries: Array<[KEncoded, VEncoded]> = []

    for (const [k, v] of value.entries()) {
      const encodedKey = this.keyCodec.encode(k, format)
      const encodedValue = this.valueCodec.encode(v, format)
      entries.push([encodedKey, encodedValue])
    }
    if (format === 'json') {
      const obj: Record<string, VEncoded> = {}
      for (const [k, v] of entries) {
        const keyStr = typeof k === 'string' ? k : String(k)
        obj[keyStr] = v
      }
      return obj
    }

    return new Map(entries)
  }

  protected fromEncoded(value: Map<KEncoded, VEncoded> | Record<string, VEncoded>, format: EncodingFormat): Map<K, V> {
    this.ensureKeyIsSupported(format)

    const result = new Map<K, V>()

    let entries: Array<[KEncoded, VEncoded]>
    if (value instanceof Map) {
      entries = Array.from(value.entries())
    } else {
      entries = Object.entries(value) as Array<[KEncoded, VEncoded]>
    }

    for (const [encodedKey, encodedValue] of entries) {
      let keyToDecode = encodedKey as KEncoded
      if (format === 'json' && this.keyType === 'bigint' && typeof encodedKey === 'string') {
        keyToDecode = BigInt(encodedKey) as KEncoded
      }
      const key = this.keyCodec.decode(keyToDecode, format)
      const val = this.valueCodec.decode(encodedValue, format)
      result.set(key, val)
    }

    return result
  }

  public isDefaultValue(value: Map<K, V>): boolean {
    return value.size === 0
  }
}
