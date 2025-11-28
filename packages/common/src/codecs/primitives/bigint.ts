import { Codec } from '../codec'
import type { EncodingFormat } from '../types'
import { WireBigInt } from '../wire'

class BigIntCodec extends Codec<bigint, WireBigInt> {
  public defaultValue(): bigint {
    return 0n
  }

  protected fromEncoded(value: WireBigInt, _format: EncodingFormat): bigint {
    if (typeof value === 'bigint') return value
    if (typeof value === 'number' || typeof value === 'string') return BigInt(value)
    throw new Error(`Cannot decode bigint from ${typeof value}`)
  }
}

export const bigIntCodec = new BigIntCodec()
