import { Buffer } from 'buffer'
import { addressFromPublicKey, publicKeyFromAddress } from '../../address'
import { ADDRESS_LENGTH, PUBLIC_KEY_BYTE_LENGTH, ZERO_ADDRESS } from '../../constants'
import { Codec } from '../codec'
import type { EncodingFormat } from '../types'
import { WireString } from '../wire'

class AddressCodec extends Codec<string, WireString> {
  public defaultValue(): string {
    return ZERO_ADDRESS
  }

  protected toEncoded(value: string, format: EncodingFormat): WireString {
    if (format === 'json') {
      return value
    }
    return publicKeyFromAddress(value)
  }

  protected fromEncoded(value: WireString, _format: EncodingFormat): string {
    if (typeof value === 'string') return value
    if (value instanceof Uint8Array) {
      if (value.length === PUBLIC_KEY_BYTE_LENGTH) {
        return addressFromPublicKey(value)
      } else if (value.length === ADDRESS_LENGTH) {
        return Buffer.from(value).toString('utf-8')
      }
    }
    throw new Error(`AddressCodec cannot decode address from ${typeof value}`)
  }
}

export const addressCodec = new AddressCodec()
