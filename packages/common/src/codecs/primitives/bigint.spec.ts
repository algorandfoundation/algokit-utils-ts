import { describe, expect, test } from 'vitest'
import { WireBigInt } from '../model-serializer'
import { bigIntCodec, bigIntWithNoDefaultCodec } from './bigint'

describe('BigIntCodec', () => {
  describe('defaultValue', () => {
    test('should return 0n', () => {
      expect(bigIntCodec.defaultValue()).toBe(0n)
    })
  })

  describe('encode', () => {
    describe('default values', () => {
      test.each<{ value: bigint | undefined; description: string }>([
        { value: 0n, description: '0n (default value)' },
        { value: undefined, description: 'undefined' },
      ])('should omit $description when encoding', ({ value }) => {
        expect(bigIntCodec.encode(value, 'json')).toBeUndefined()
        expect(bigIntCodec.encode(value, 'msgpack')).toBeUndefined()
      })
    })

    describe('values that fit in 32-bit signed integer', () => {
      test.each<{ value: bigint; expected: number; description: string }>([
        // Small positive values
        { value: 1n, expected: 1, description: '1n' },
        { value: 42n, expected: 42, description: '42n' },
        { value: 100n, expected: 100, description: '100n' },
        { value: 1_000_000_000n, expected: 1_000_000_000, description: 'one billion' },
        // Small negative values
        { value: -1n, expected: -1, description: '-1n' },
        { value: -42n, expected: -42, description: '-42n' },
        { value: -100n, expected: -100, description: '-100n' },
        { value: -1_000_000_000n, expected: -1_000_000_000, description: 'negative one billion' },
        // 32-bit boundary - upper bound exclusive (< 2^31)
        { value: 2147483646n, expected: 2147483646, description: '2^31 - 2' },
        { value: 2147483647n, expected: 2147483647, description: '2^31 - 1 (max that fits in 32-bit)' },
        // 32-bit boundary - lower bound inclusive (>= -2^31)
        { value: -2147483648n, expected: -2147483648, description: '-2^31 (min 32-bit)' },
      ])('should encode $description as number', ({ value, expected }) => {
        const encoded = bigIntCodec.encode(value, 'msgpack')
        expect(encoded).toBe(expected)
        expect(typeof encoded).toBe('number')

        const encoded2 = bigIntCodec.encode(value, 'json')
        expect(encoded2).toBe(expected)
        expect(typeof encoded2).toBe('number')
      })
    })

    describe('values that exceed 32-bit range', () => {
      test.each<{ value: bigint; description: string }>([
        // Just outside 32-bit range
        { value: 2147483648n, description: '2^31 (exceeds 32-bit positive)' },
        { value: -2147483649n, description: '-2^31 - 1 (exceeds 32-bit negative)' },
        // Large values
        { value: BigInt(Number.MAX_SAFE_INTEGER), description: 'MAX_SAFE_INTEGER' },
        { value: BigInt(Number.MIN_SAFE_INTEGER), description: 'MIN_SAFE_INTEGER' },
        { value: 18446744073709551615n, description: 'max 64-bit unsigned' },
      ])('should encode $description as bigint (msgpack) or string (json)', ({ value }) => {
        const encoded = bigIntCodec.encode(value, 'msgpack')
        expect(encoded).toBe(value)
        expect(typeof encoded).toBe('bigint')

        const encodedJson = bigIntCodec.encode(value, 'json')
        expect(encodedJson).toBe(value)
        expect(typeof encodedJson).toBe('bigint')
      })
    })
  })

  describe('decode', () => {
    describe('default values', () => {
      test.each<{ value: WireBigInt | undefined; description: string }>([
        { value: 0n, description: '0n' },
        { value: 0, description: '0' },
        { value: undefined, description: 'undefined' },
      ])('should decode $description to 0n', ({ value }) => {
        expect(bigIntCodec.decode(value, 'json')).toBe(0n)
        expect(bigIntCodec.decode(value, 'msgpack')).toBe(0n)
      })
    })

    describe('from bigint', () => {
      test.each<{ value: bigint; description: string }>([
        { value: 1n, description: '1n' },
        { value: 42n, description: '42n' },
        { value: -1n, description: '-1n' },
        { value: -42n, description: '-42n' },
        { value: 2147483647n, description: '2^31 - 1' },
        { value: 2147483648n, description: '2^31' },
        { value: -2147483648n, description: '-2^31' },
        { value: -2147483649n, description: '-2^31 - 1' },
        { value: BigInt(Number.MAX_SAFE_INTEGER), description: 'MAX_SAFE_INTEGER' },
        { value: 18446744073709551615n, description: 'max 64-bit unsigned' },
      ])('should decode bigint $description', ({ value }) => {
        expect(bigIntCodec.decode(value, 'json')).toBe(value)
        expect(bigIntCodec.decode(value, 'msgpack')).toBe(value)
      })
    })

    describe('from number', () => {
      test.each<{ value: number; expected: bigint; description: string }>([
        { value: 1, expected: 1n, description: '1' },
        { value: 42, expected: 42n, description: '42' },
        { value: -1, expected: -1n, description: '-1' },
        { value: -42, expected: -42n, description: '-42' },
        { value: 2147483647, expected: 2147483647n, description: '2^31 - 1' },
        { value: -2147483648, expected: -2147483648n, description: '-2^31' },
        { value: 1000000000, expected: 1000000000n, description: 'one billion' },
        { value: Number.MAX_SAFE_INTEGER, expected: 9007199254740991n, description: 'MAX_SAFE_INTEGER' },
        { value: Number.MIN_SAFE_INTEGER, expected: -9007199254740991n, description: 'MIN_SAFE_INTEGER' },
      ])('should decode number $description to bigint', ({ value, expected }) => {
        expect(bigIntCodec.decode(value, 'json')).toBe(expected)
        expect(bigIntCodec.decode(value, 'msgpack')).toBe(expected)
      })
    })

    describe('format independence', () => {
      test.each<{ value: WireBigInt | undefined; description: string }>([
        { value: undefined, description: 'undefined' },
        { value: 0n, description: '0n' },
        { value: 0, description: '0' },
        { value: 42n, description: '42n' },
        { value: 42, description: '42' },
      ])('should produce same result for JSON and msgpack when decoding $description', ({ value }) => {
        expect(bigIntCodec.decode(value, 'json')).toBe(bigIntCodec.decode(value, 'msgpack'))
      })
    })
  })

  describe('decodeOptional', () => {
    test('should preserve undefined', () => {
      expect(bigIntCodec.decodeOptional(undefined, 'json')).toBeUndefined()
      expect(bigIntCodec.decodeOptional(undefined, 'msgpack')).toBeUndefined()
    })

    test.each<{ value: WireBigInt; expected: bigint; description: string }>([
      { value: 0n, expected: 0n, description: '0n (not undefined)' },
      { value: 0, expected: 0n, description: '0' },
      { value: 42n, expected: 42n, description: '42n' },
      { value: 42, expected: 42n, description: '42' },
    ])('should decode $description', ({ value, expected }) => {
      expect(bigIntCodec.decodeOptional(value, 'json')).toBe(expected)
      expect(bigIntCodec.decodeOptional(value, 'msgpack')).toBe(expected)
    })
  })
})

describe('BigIntWithNoDefaultCodec', () => {
  describe('encode', () => {
    describe('zero values', () => {
      test('should not omit 0n when encoding', () => {
        const encodedJson = bigIntWithNoDefaultCodec.encode(0n, 'json')
        expect(encodedJson).toBe(0n)

        const encodedMsgpack = bigIntWithNoDefaultCodec.encode(0n, 'msgpack')
        expect(encodedMsgpack).toBe(0n)
      })
    })
  })
})
