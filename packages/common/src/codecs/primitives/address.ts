import { addressFromPublicKey, publicKeyFromAddress } from '../../address'
import { ZERO_ADDRESS } from '../../constants'
import { Codec } from '../codec'
import { WireBytes } from '../model-serializer'
import type { BodyFormat } from '../types'

class AddressCodec extends Codec<string, WireBytes> {
  public defaultValue(): string {
    return ZERO_ADDRESS
  }

  protected toEncoded(value: string, format: BodyFormat): WireBytes {
    if (format === 'json') {
      return value
    }
    return publicKeyFromAddress(value)
  }

  protected fromEncoded(value: WireBytes, _format: BodyFormat): string {
    if (typeof value === 'string') return value
    if (value instanceof Uint8Array) {
      return addressFromPublicKey(value)
    }
    throw new Error(`Cannot decode address from ${typeof value}`)
  }
}

export const addressCodec = new AddressCodec()
