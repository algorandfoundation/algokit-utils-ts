import { Codec } from '../codec'

class NumberCodec extends Codec<number> {
  public defaultValue(): number {
    return 0
  }

  protected override isDefaultValue(value: number): boolean {
    return value === this.defaultValue() || Number.isNaN(value)
  }
}

export const numberCodec = new NumberCodec()
