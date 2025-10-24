import { addressFromPublicKey, PUBLIC_KEY_BYTE_LENGTH, publicKeyFromAddress } from '@algorandfoundation/algokit-common'

abstract class Codec<T, TEncoded = T> {
  public abstract defaultValue(): TEncoded
  protected toEncoded(value: T): TEncoded {
    return value as unknown as TEncoded
  }
  protected fromEncoded(value: TEncoded): T {
    return value as unknown as T
  }
  protected isDefaultValue(value: T): boolean {
    return this.toEncoded(value) === this.defaultValue()
  }
  public encode(value?: T): TEncoded | undefined {
    return value !== undefined && !this.isDefaultValue(value) ? this.toEncoded(value) : undefined
  }
  public decode(value: TEncoded | undefined): T {
    return this.fromEncoded(value !== undefined ? value : this.defaultValue())
  }
  public decodeOptional(value: TEncoded | undefined): T | undefined {
    if (value === undefined) {
      return undefined
    }
    return this.fromEncoded(value)
  }
}

class NumberCodec extends Codec<number> {
  public defaultValue(): number {
    return 0
  }
}

class BigIntCodec extends Codec<bigint, bigint | number> {
  public defaultValue(): bigint {
    return 0n
  }

  protected isDefaultValue(value: bigint): boolean {
    return BigInt(this.toEncoded(value)) === this.defaultValue()
  }

  protected toEncoded(value: bigint): bigint | number {
    // Use number if it fits in 32-bit signed integer range, matching expected msgpack encoding behavior
    if (value <= BigInt(0x7fffffff) && value >= BigInt(-0x7fffffff - 1)) {
      return Number(value)
    }
    return value
  }

  protected fromEncoded(value: number | bigint): bigint {
    return typeof value === 'bigint' ? value : BigInt(value)
  }
}

class StringCodec extends Codec<string> {
  public defaultValue(): string {
    return ''
  }
}

class AddressCodec extends Codec<string, Uint8Array> {
  public defaultValue(): Uint8Array {
    return new Uint8Array(PUBLIC_KEY_BYTE_LENGTH)
  }

  protected toEncoded(value: string): Uint8Array {
    return publicKeyFromAddress(value)
  }

  protected fromEncoded(value: Uint8Array): string {
    return addressFromPublicKey(value)
  }

  protected isDefaultValue(value: string): boolean {
    const encoded = this.toEncoded(value)
    const defaultValue = this.defaultValue()

    // Compare byte arrays element by element
    if (encoded.length !== defaultValue.length) {
      return false
    }

    for (let i = 0; i < encoded.length; i++) {
      if (encoded[i] !== defaultValue[i]) {
        return false
      }
    }

    return true
  }
}

class BytesCodec extends Codec<Uint8Array> {
  public defaultValue(): Uint8Array {
    return new Uint8Array()
  }

  protected isDefaultValue(value: Uint8Array): boolean {
    return value.byteLength === 0
  }
}

class BooleanCodec extends Codec<boolean> {
  public defaultValue(): boolean {
    return false
  }
}

export class OmitEmptyObjectCodec<T extends object> extends Codec<T, T | undefined> {
  public defaultValue(): T | undefined {
    return undefined
  }

  protected isDefaultValue(value: T): boolean {
    return Object.values(value).filter((x) => x !== undefined).length === 0
  }
}

export const numberCodec = new NumberCodec()
export const bigIntCodec = new BigIntCodec()
export const stringCodec = new StringCodec()
export const addressCodec = new AddressCodec()
export const bytesCodec = new BytesCodec()
export const booleanCodec = new BooleanCodec()
