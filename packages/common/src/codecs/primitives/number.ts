import { Codec } from '../codec'

class NumberCodec extends Codec<number> {
  public defaultValue(): number {
    return 0
  }

  protected override isDefaultValue(value: number): boolean {
    return value === this.defaultValue() || Number.isNaN(value)
  }
}

class NumberWithNoDefaultCodec extends NumberCodec {
  // This ensures that the default value is never omitted from serialisation
  protected override isDefaultValue(_value: number): boolean {
    return false
  }
}

export const numberCodec = new NumberCodec()
export const numberWithNoDefaultCodec = new NumberWithNoDefaultCodec()
