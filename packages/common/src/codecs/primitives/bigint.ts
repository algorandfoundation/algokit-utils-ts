import { Codec } from '../codec'
import { WireBigInt } from '../model-serializer'
import type { BodyFormat } from '../types'

class BigIntCodec extends Codec<bigint, WireBigInt> {
  public defaultValue(): bigint {
    return 0n
  }

  protected toEncoded(value: bigint, _format: BodyFormat): WireBigInt {
    // Use number if it fits in 32-bit signed integer range, matching expected msgpack encoding behavior
    if (value <= BigInt(0x7fffffff) && value >= BigInt(-0x7fffffff - 1)) {
      return Number(value)
    }

    return value
  }

  protected fromEncoded(value: WireBigInt, _format: BodyFormat): bigint {
    if (typeof value === 'bigint') return value
    if (typeof value === 'number' || typeof value === 'string') return BigInt(value)
    throw new Error(`Cannot decode bigint from ${typeof value}`)
  }
}

class BigIntWithNoDefaultCodec extends BigIntCodec {
  protected toEncoded(value: bigint, _format: BodyFormat): WireBigInt {
    return value
  }

  // This ensures that the default value is never omitted from serialisation
  protected override isDefaultValue(_value: bigint): boolean {
    return false
  }
}

export const bigIntCodec = new BigIntCodec()
export const bigIntWithNoDefaultCodec = new BigIntWithNoDefaultCodec() // TODO: NC - I think we can get rid of this
