import { PUBLIC_KEY_BYTE_LENGTH, Address, arrayEqual } from '@algorandfoundation/algokit-common'

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

class AddressCodec extends Codec<Address, Uint8Array> {
  public defaultValue(): Uint8Array {
    return new Uint8Array(PUBLIC_KEY_BYTE_LENGTH)
  }

  protected toEncoded(value: Address): Uint8Array {
    return value.publicKey
  }

  protected fromEncoded(value: Uint8Array): Address {
    return new Address(value)
  }

  protected isDefaultValue(value: Address): boolean {
    const encoded = this.toEncoded(value)
    const defaultValue = this.defaultValue()

    return arrayEqual(encoded, defaultValue)
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

export class ArrayCodec<T, TEncoded = T> extends Codec<Array<T>, Array<TEncoded> | undefined> {
  constructor(private elementCodec: Codec<T, TEncoded>) {
    super()
  }

  public defaultValue(): Array<TEncoded> | undefined {
    return undefined
  }

  protected toEncoded(value: Array<T>): Array<TEncoded> | undefined {
    if (value.length === 0) {
      return undefined
    }
    return value.map((item) => this.elementCodec.encode(item) ?? this.elementCodec.defaultValue())
  }

  protected fromEncoded(value: Array<TEncoded> | undefined): Array<T> {
    if (value === undefined || value.length === 0) {
      return []
    }
    return value.map((item) => this.elementCodec.decode(item))
  }

  protected isDefaultValue(value: Array<T>): boolean {
    return value.length === 0
  }
}

export const numberCodec = new NumberCodec()
export const bigIntCodec = new BigIntCodec()
export const stringCodec = new StringCodec()
export const addressCodec = new AddressCodec()
export const bytesCodec = new BytesCodec()
export const booleanCodec = new BooleanCodec()
export const bytesArrayCodec = new ArrayCodec(bytesCodec)
export const addressArrayCodec = new ArrayCodec(addressCodec)
export const bigIntArrayCodec = new ArrayCodec(bigIntCodec)
