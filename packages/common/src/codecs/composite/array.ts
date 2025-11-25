import { Codec } from '../codec'
import { addressCodec } from '../primitives/address'
import { bigIntCodec } from '../primitives/bigint'
import { booleanCodec } from '../primitives/boolean'
import { bytesCodec } from '../primitives/bytes'
import { numberCodec } from '../primitives/number'
import { stringCodec } from '../primitives/string'
import type { EncodingFormat } from '../types'

/**
 * Array codec - encodes each element using the item codec
 */
export class ArrayCodec<T, TEncoded = T> extends Codec<T[], TEncoded[]> {
  constructor(private readonly itemCodec: Codec<T, TEncoded>) {
    super()
  }

  public defaultValue(): T[] {
    return []
  }

  protected toEncoded(value: T[], format: EncodingFormat): TEncoded[] {
    return value.map((item) => this.itemCodec.encode(item, format))
  }

  protected fromEncoded(value: TEncoded[], format: EncodingFormat): T[] {
    return value.map((item) => this.itemCodec.decode(item, format))
  }

  protected isDefaultValue(value: T[]): boolean {
    return value.length === 0
  }
}

export const bytesArrayCodec = new ArrayCodec(bytesCodec)
export const addressArrayCodec = new ArrayCodec(addressCodec)
export const bigIntArrayCodec = new ArrayCodec(bigIntCodec)
export const numberArrayCodec = new ArrayCodec(numberCodec)
export const booleanArrayCodec = new ArrayCodec(booleanCodec)
export const stringArrayCodec = new ArrayCodec(stringCodec)
