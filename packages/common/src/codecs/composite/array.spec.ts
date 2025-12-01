import { Address } from '@algorandfoundation/algokit-common'
import { describe, expect, test } from 'vitest'
import { numberCodec } from '../primitives/number'
import {
  ArrayCodec,
  addressArrayCodec,
  bigIntArrayCodec,
  booleanArrayCodec,
  bytesArrayCodec,
  numberArrayCodec,
  stringArrayCodec,
} from './array'

describe('ArrayCodec', () => {
  const testNumberArrayCodec = new ArrayCodec(numberCodec)

  describe('defaultValue', () => {
    test('should return empty array', () => {
      const defaultValue = testNumberArrayCodec.defaultValue()
      expect(defaultValue).toEqual([])
      expect(Array.isArray(defaultValue)).toBe(true)
    })
  })

  describe('encode', () => {
    describe('default values', () => {
      test.each<{ value: number[] | undefined | null; description: string }>([
        { value: [], description: 'empty array (default value)' },
        { value: undefined, description: 'undefined' },
        { value: null, description: 'null' },
      ])('should encode $description to empty array', ({ value }) => {
        expect(testNumberArrayCodec.encode(value, 'json')).toEqual([])
        expect(testNumberArrayCodec.encode(value, 'msgpack')).toEqual([])
      })
    })

    describe('non-empty arrays', () => {
      test.each<{ value: number[]; expected: number[]; description: string }>([
        { value: [1, 2, 3, 4, 5], expected: [1, 2, 3, 4, 5], description: 'number array' },
        { value: [1, 0, 42, -10], expected: [1, 0, 42, -10], description: 'mixed values' },
      ])('should encode $description', ({ value, expected }) => {
        expect(testNumberArrayCodec.encode(value, 'json')).toEqual(expected)
        expect(testNumberArrayCodec.encode(value, 'msgpack')).toEqual(expected)
      })

      test('should encode using item codec', () => {
        const arr = [1n, BigInt(Number.MAX_SAFE_INTEGER + 1), 3n]
        expect(bigIntArrayCodec.encode(arr, 'json')).toEqual([1n, 9007199254740992n, 3n])
        expect(bigIntArrayCodec.encode(arr, 'msgpack')).toEqual([1n, 9007199254740992n, 3n])
      })
    })
  })

  describe('encodeOptional', () => {
    describe('default values', () => {
      test.each<{ value: number[] | undefined | null; description: string }>([
        { value: [], description: 'empty array (default value)' },
        { value: undefined, description: 'undefined' },
        { value: null, description: 'null' },
      ])('should encode $description to undefined', ({ value }) => {
        expect(testNumberArrayCodec.encodeOptional(value, 'json')).toBeUndefined()
        expect(testNumberArrayCodec.encodeOptional(value, 'msgpack')).toBeUndefined()
      })

      test('should encode using item codec', () => {
        const arr = [1n, BigInt(Number.MAX_SAFE_INTEGER + 1), 3n]
        expect(bigIntArrayCodec.encodeOptional(arr, 'json')).toEqual([1n, 9007199254740992n, 3n])
        expect(bigIntArrayCodec.encodeOptional(arr, 'msgpack')).toEqual([1n, 9007199254740992n, 3n])
      })
    })

    describe('non-empty arrays', () => {
      test.each<{ value: number[]; expected: number[]; description: string }>([
        { value: [1, 2, 3, 4, 5], expected: [1, 2, 3, 4, 5], description: 'number array' },
        { value: [1, 0, 42, -10], expected: [1, 0, 42, -10], description: 'mixed values including defaults' },
      ])('should encode $description', ({ value, expected }) => {
        expect(testNumberArrayCodec.encodeOptional(value, 'json')).toEqual(expected)
        expect(testNumberArrayCodec.encodeOptional(value, 'msgpack')).toEqual(expected)
      })
    })
  })

  describe('decode', () => {
    describe('default values', () => {
      test.each<{ value: number[] | undefined | null; description: string }>([
        { value: [], description: 'empty array' },
        { value: undefined, description: 'undefined' },
        { value: null, description: 'null' },
      ])('should decode $description to empty array', ({ value }) => {
        expect(testNumberArrayCodec.decode(value, 'json')).toEqual([])
        expect(testNumberArrayCodec.decode(value, 'msgpack')).toEqual([])
      })
    })

    describe('non-empty arrays', () => {
      test.each<{ value: number[]; expected: number[]; description: string }>([
        { value: [1, 2, 3, 4, 5], expected: [1, 2, 3, 4, 5], description: 'number array' },
        { value: [1, 0, 42, -10], expected: [1, 0, 42, -10], description: 'mixed values' },
      ])('should decode $description', ({ value, expected }) => {
        expect(testNumberArrayCodec.decode(value, 'json')).toEqual(expected)
        expect(testNumberArrayCodec.decode(value, 'msgpack')).toEqual(expected)
      })

      test('should decode using item codec', () => {
        const arr = [1, BigInt(Number.MAX_SAFE_INTEGER + 1), 3]
        expect(bigIntArrayCodec.decode(arr, 'json')).toEqual([1n, 9007199254740992n, 3n])
        expect(bigIntArrayCodec.decode(arr, 'msgpack')).toEqual([1n, 9007199254740992n, 3n])
      })
    })
  })

  describe('decodeOptional', () => {
    describe('default values', () => {
      test.each<{ value: number[] | undefined | null; description: string }>([
        { value: undefined, description: 'undefined' },
        { value: null, description: 'null' },
      ])('should decode $description to undefined', ({ value }) => {
        expect(testNumberArrayCodec.decodeOptional(value, 'json')).toBeUndefined()
        expect(testNumberArrayCodec.decodeOptional(value, 'msgpack')).toBeUndefined()
      })

      test('should decode empty array to empty array', () => {
        expect(testNumberArrayCodec.decodeOptional([], 'json')).toEqual([])
        expect(testNumberArrayCodec.decodeOptional([], 'msgpack')).toEqual([])
      })
    })

    describe('non-empty arrays', () => {
      test.each<{ value: number[]; expected: number[]; description: string }>([
        { value: [1, 2, 3, 4, 5], expected: [1, 2, 3, 4, 5], description: 'number array' },
        { value: [1, 0, 42, -10], expected: [1, 0, 42, -10], description: 'mixed values' },
      ])('should decode $description', ({ value, expected }) => {
        expect(testNumberArrayCodec.decodeOptional(value, 'json')).toEqual(expected)
        expect(testNumberArrayCodec.decodeOptional(value, 'msgpack')).toEqual(expected)
      })

      test('should decode using item codec', () => {
        const arr = [1, BigInt(Number.MAX_SAFE_INTEGER + 1), 3]
        expect(bigIntArrayCodec.decodeOptional(arr, 'json')).toEqual([1n, 9007199254740992n, 3n])
        expect(bigIntArrayCodec.decodeOptional(arr, 'msgpack')).toEqual([1n, 9007199254740992n, 3n])
      })
    })
  })

  describe('array codecs', () => {
    test('bytesArrayCodec can encode and decode', () => {
      const arr = [new Uint8Array([1, 2, 3]), new Uint8Array([4, 5, 6])]
      const encoded = bytesArrayCodec.encodeOptional(arr, 'msgpack')
      const decoded = bytesArrayCodec.decode(encoded, 'msgpack')
      expect(decoded).toEqual(arr)
    })

    test('addressArrayCodec can encode and decode', () => {
      const addresses = [
        Address.fromString('VCMJKWOY5P5P7SKMZFFOCEROPJCZOTIJMNIYNUCKH7LRO45JMJP6UYBIJA'),
        Address.fromString('7ZUECA7HFLZTXENRV24SHLU4AVPUTMTTDUFUBNBD64C73F3UHRTHAIOF6Q'),
      ]
      const encoded = addressArrayCodec.encodeOptional(addresses, 'json')
      const decoded = addressArrayCodec.decode(encoded, 'json')
      expect(decoded).toEqual(addresses)
    })

    test('bigIntArrayCodec can encode and decode', () => {
      const arr = [1n, 2n, 3n, 100n, 9007199254740991n]
      const encoded = bigIntArrayCodec.encodeOptional(arr, 'json')
      const decoded = bigIntArrayCodec.decode(encoded, 'json')
      expect(decoded).toEqual(arr)
    })

    test('numberArrayCodec can encode and decode', () => {
      const arr = [1, 2, 3, 42, -10, 0]
      const encoded = numberArrayCodec.encodeOptional(arr, 'json')
      const decoded = numberArrayCodec.decode(encoded, 'json')
      expect(decoded).toEqual(arr)
    })

    test('booleanArrayCodec can encode and decode', () => {
      const arr = [true, false, true, true, false]
      const encoded = booleanArrayCodec.encodeOptional(arr, 'json')
      const decoded = booleanArrayCodec.decode(encoded, 'json')
      expect(decoded).toEqual(arr)
    })

    test('stringArrayCodec can encode and decode', () => {
      const arr = ['hello', 'world', '', 'test']
      const encoded = stringArrayCodec.encodeOptional(arr, 'json')
      const decoded = stringArrayCodec.decode(encoded, 'json')
      expect(decoded).toEqual(arr)
    })
  })
})
