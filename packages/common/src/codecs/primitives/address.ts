import { Buffer } from 'buffer'
import { Address } from '../../address'
import { ADDRESS_LENGTH, PUBLIC_KEY_BYTE_LENGTH } from '../../constants'
import { Codec } from '../codec'
import type { EncodingFormat } from '../types'
import { WireString } from '../wire'

class AddressCodec extends Codec<Address, WireString> {
  public defaultValue(): Address {
    return Address.zeroAddress()
  }

  protected toEncoded(value: Address, format: EncodingFormat): WireString {
    if (format === 'json') {
      return value.toString()
    }
    return value.publicKey
  }

  protected fromEncoded(value: WireString, _format: EncodingFormat): Address {
    if (typeof value === 'string') return Address.fromString(value)
    if (value instanceof Uint8Array) {
      if (value.length === PUBLIC_KEY_BYTE_LENGTH) {
        return new Address(value)
      } else if (value.length === ADDRESS_LENGTH) {
        return Address.fromString(Buffer.from(value).toString('utf-8'))
      }
    }
    throw new Error(`AddressCodec cannot decode address from ${typeof value}`)
  }

  public isDefaultValue(value: Address): boolean {
    return value.equals(this.defaultValue())
  }
}

export const addressCodec = new AddressCodec()
