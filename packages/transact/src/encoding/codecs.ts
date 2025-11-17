/**
 * Transact-specific codec wrappers that default to msgpack format
 *
 * The common package codecs require an explicit format parameter,
 * but transact exclusively uses msgpack. These wrappers provide
 * a cleaner API by wrapping codec methods to always pass 'msgpack'.
 */

import {
  ArrayCodec,
  addressArrayCodec as baseAddressArrayCodec,
  addressCodec as baseAddressCodec,
  bigIntArrayCodec as baseBigIntArrayCodec,
  bigIntCodec as baseBigIntCodec,
  booleanCodec as baseBooleanCodec,
  bytesArrayCodec as baseBytesArrayCodec,
  bytesCodec as baseBytesCodec,
  fixedBytes1793Codec as baseFixedBytes1793Codec,
  fixedBytes32Codec as baseFixedBytes32Codec,
  fixedBytes64Codec as baseFixedBytes64Codec,
  numberCodec as baseNumberCodec,
  OmitEmptyObjectCodec as BaseOmitEmptyObjectCodec,
  stringCodec as baseStringCodec,
  FixedBytesCodec,
} from '@algorandfoundation/algokit-common'

// Re-export types and classes that can be used directly or need no wrapper
export { ArrayCodec, FixedBytesCodec }

// TODO: NC - Should we move?
// Wrapper for OmitEmptyObjectCodec that defaults to msgpack
export class OmitEmptyObjectCodec<T extends object> extends BaseOmitEmptyObjectCodec<T> {
  public encode(value: T | undefined): T | undefined {
    return super.encode(value, 'msgpack')
  }

  public decode(value: T | undefined): T | undefined {
    return super.decode(value, 'msgpack')
  }

  public decodeOptional(value: T | undefined): T | undefined {
    return super.decodeOptional(value, 'msgpack')
  }
}

// Msgpack-specific codec wrappers with explicit types
export const numberCodec = {
  defaultValue: () => baseNumberCodec.defaultValue(),
  encode: (value: number | undefined): number | undefined => baseNumberCodec.encode(value, 'msgpack'),
  decode: (value: number | undefined): number => baseNumberCodec.decode(value, 'msgpack'),
  decodeOptional: (value: number | undefined): number | undefined => baseNumberCodec.decodeOptional(value, 'msgpack'),
}

export const bigIntCodec = {
  defaultValue: () => baseBigIntCodec.defaultValue(),
  encode: (value: bigint | undefined): bigint | number | undefined =>
    baseBigIntCodec.encode(value, 'msgpack') as bigint | number | undefined,
  decode: (value: bigint | number | undefined): bigint => baseBigIntCodec.decode(value, 'msgpack'),
  decodeOptional: (value: bigint | number | undefined): bigint | undefined => baseBigIntCodec.decodeOptional(value, 'msgpack'),
}

export const stringCodec = {
  defaultValue: () => baseStringCodec.defaultValue(),
  encode: (value: string | undefined): string | undefined => baseStringCodec.encode(value, 'msgpack') as string | undefined,
  decode: (value: string | Uint8Array | undefined): string => baseStringCodec.decode(value, 'msgpack'),
  decodeOptional: (value: string | Uint8Array | undefined): string | undefined => baseStringCodec.decodeOptional(value, 'msgpack'),
}

export const addressCodec = {
  defaultValue: () => baseAddressCodec.defaultValue(),
  encode: (value: string | undefined): Uint8Array | undefined => baseAddressCodec.encode(value, 'msgpack') as Uint8Array | undefined,
  decode: (value: string | Uint8Array | undefined): string => baseAddressCodec.decode(value, 'msgpack'),
  decodeOptional: (value: string | Uint8Array | undefined): string | undefined => baseAddressCodec.decodeOptional(value, 'msgpack'),
}

export const bytesCodec = {
  defaultValue: () => baseBytesCodec.defaultValue(),
  encode: (value: Uint8Array | undefined): Uint8Array | undefined => baseBytesCodec.encode(value, 'msgpack') as Uint8Array | undefined,
  decode: (value: Uint8Array | undefined): Uint8Array => baseBytesCodec.decode(value, 'msgpack'),
  decodeOptional: (value: Uint8Array | undefined): Uint8Array | undefined => baseBytesCodec.decodeOptional(value, 'msgpack'),
}

export const fixedBytes32Codec = {
  defaultValue: () => baseFixedBytes32Codec.defaultValue(),
  encode: (value: Uint8Array | undefined): Uint8Array | undefined =>
    baseFixedBytes32Codec.encode(value, 'msgpack') as Uint8Array | undefined,
  decode: (value: Uint8Array | undefined): Uint8Array => baseFixedBytes32Codec.decode(value, 'msgpack'),
  decodeOptional: (value: Uint8Array | undefined): Uint8Array | undefined => baseFixedBytes32Codec.decodeOptional(value, 'msgpack'),
}

export const fixedBytes64Codec = {
  defaultValue: () => baseFixedBytes64Codec.defaultValue(),
  encode: (value: Uint8Array | undefined): Uint8Array | undefined =>
    baseFixedBytes64Codec.encode(value, 'msgpack') as Uint8Array | undefined,
  decode: (value: Uint8Array | undefined): Uint8Array => baseFixedBytes64Codec.decode(value, 'msgpack'),
  decodeOptional: (value: Uint8Array | undefined): Uint8Array | undefined => baseFixedBytes64Codec.decodeOptional(value, 'msgpack'),
}

export const fixedBytes1793Codec = {
  defaultValue: () => baseFixedBytes1793Codec.defaultValue(),
  encode: (value: Uint8Array | undefined): Uint8Array | undefined =>
    baseFixedBytes1793Codec.encode(value, 'msgpack') as Uint8Array | undefined,
  decode: (value: Uint8Array | undefined): Uint8Array => baseFixedBytes1793Codec.decode(value, 'msgpack'),
  decodeOptional: (value: Uint8Array | undefined): Uint8Array | undefined => baseFixedBytes1793Codec.decodeOptional(value, 'msgpack'),
}

export const booleanCodec = {
  defaultValue: () => baseBooleanCodec.defaultValue(),
  encode: (value: boolean | undefined): boolean | undefined => baseBooleanCodec.encode(value, 'msgpack'),
  decode: (value: boolean | undefined): boolean => baseBooleanCodec.decode(value, 'msgpack'),
  decodeOptional: (value: boolean | undefined): boolean | undefined => baseBooleanCodec.decodeOptional(value, 'msgpack'),
}

export const bytesArrayCodec = {
  defaultValue: () => baseBytesArrayCodec.defaultValue(),
  encode: (value: Uint8Array[] | undefined): Uint8Array[] | undefined =>
    baseBytesArrayCodec.encode(value, 'msgpack') as Uint8Array[] | undefined,
  decode: (value: Uint8Array[] | undefined): Uint8Array[] => baseBytesArrayCodec.decode(value, 'msgpack'),
  decodeOptional: (value: Uint8Array[] | undefined): Uint8Array[] | undefined => baseBytesArrayCodec.decodeOptional(value, 'msgpack'),
}

export const addressArrayCodec = {
  defaultValue: () => baseAddressArrayCodec.defaultValue(),
  encode: (value: string[] | undefined): Uint8Array[] | undefined =>
    baseAddressArrayCodec.encode(value, 'msgpack') as Uint8Array[] | undefined,
  decode: (value: Uint8Array[] | undefined): string[] => baseAddressArrayCodec.decode(value, 'msgpack'),
  decodeOptional: (value: Uint8Array[] | undefined): string[] | undefined => baseAddressArrayCodec.decodeOptional(value, 'msgpack'),
}

export const bigIntArrayCodec = {
  defaultValue: () => baseBigIntArrayCodec.defaultValue(),
  encode: (value: bigint[] | undefined): (bigint | number)[] | undefined =>
    baseBigIntArrayCodec.encode(value, 'msgpack') as (bigint | number)[] | undefined,
  decode: (value: (bigint | number)[] | undefined): bigint[] => baseBigIntArrayCodec.decode(value, 'msgpack'),
  decodeOptional: (value: (bigint | number)[] | undefined): bigint[] | undefined => baseBigIntArrayCodec.decodeOptional(value, 'msgpack'),
}
