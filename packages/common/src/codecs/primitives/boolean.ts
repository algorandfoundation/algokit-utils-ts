import { Codec } from '../codec'

class BooleanCodec extends Codec<boolean, boolean> {
  public defaultValue(): boolean {
    return false
  }
}

export const booleanCodec = new BooleanCodec()
