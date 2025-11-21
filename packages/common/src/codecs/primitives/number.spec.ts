import { describe, expect, test } from 'vitest'
import { numberCodec, numberWithNoDefaultCodec } from './number'

describe('NumberCodec', () => {
  describe('defaultValue', () => {
    test('should return 0', () => {
      expect(numberCodec.defaultValue()).toBe(0)
    })
  })

  describe('encode', () => {
    describe('default values', () => {
      test.each<{ value: number | undefined; description: string }>([
        { value: 0, description: '0 (default value)' },
        { value: -0, description: '-0 (treated as 0)' },
        { value: NaN, description: 'NaN (treated as 0)' },
        { value: undefined, description: 'undefined' },
      ])('should omit $description when encoding', ({ value }) => {
        expect(numberCodec.encode(value, 'json')).toBeUndefined()
        expect(numberCodec.encode(value, 'msgpack')).toBeUndefined()
      })
    })

    describe('non-zero values', () => {
      test.each<{ value: number; description: string }>([
        // Positive integers
        { value: 1, description: 'small positive (1)' },
        { value: 42, description: 'small positive (42)' },
        { value: 1_000_000_000, description: 'large positive (1 billion)' },
        { value: Number.MAX_SAFE_INTEGER, description: 'MAX_SAFE_INTEGER' },
        // Negative integers
        { value: -1, description: 'small negative (-1)' },
        { value: -42, description: 'small negative (-42)' },
        { value: -1_000_000_000, description: 'large negative (-1 billion)' },
        { value: Number.MIN_SAFE_INTEGER, description: 'MIN_SAFE_INTEGER' },
      ])('should encode $description', ({ value }) => {
        expect(numberCodec.encode(value, 'json')).toBe(value)
        expect(numberCodec.encode(value, 'msgpack')).toBe(value)
      })
    })

    describe('format independence', () => {
      test.each<{ value: number | undefined; description: string }>([
        { value: undefined, description: 'undefined' },
        { value: 1, description: '1' },
        { value: 42, description: '42' },
        { value: Number.MAX_SAFE_INTEGER, description: 'MAX_SAFE_INTEGER' },
        { value: Number.MIN_SAFE_INTEGER, description: 'MIN_SAFE_INTEGER' },
      ])('should produce same result for JSON and msgpack when encoding $description', ({ value }) => {
        expect(numberCodec.encode(value, 'json')).toBe(numberCodec.encode(value, 'msgpack'))
      })
    })
  })

  describe('decode', () => {
    describe('default values', () => {
      test.each<{ value: number | undefined; description: string }>([
        { value: 0, description: '0 (default value)' },
        { value: -0, description: '-0 (treated as 0)' },
        { value: NaN, description: 'NaN (treated as 0)' },
        { value: undefined, description: 'undefined' },
      ])('should omit $description when encoding', ({ value }) => {
        expect(numberCodec.decode(value, 'json')).toBe(0)
        expect(numberCodec.decode(value, 'msgpack')).toBe(0)
      })
    })

    describe('non-zero values', () => {
      test.each<{ value: number; description: string }>([
        // Positive integers
        { value: 1, description: 'small positive (1)' },
        { value: 42, description: 'small positive (42)' },
        { value: 1_000_000_000, description: 'large positive (1 billion)' },
        { value: Number.MAX_SAFE_INTEGER, description: 'MAX_SAFE_INTEGER' },
        // Negative integers
        { value: -1, description: 'small negative (-1)' },
        { value: -42, description: 'small negative (-42)' },
        { value: -1_000_000_000, description: 'large negative (-1 billion)' },
        { value: Number.MIN_SAFE_INTEGER, description: 'MIN_SAFE_INTEGER' },
      ])('should decode $description', ({ value }) => {
        expect(numberCodec.decode(value, 'json')).toBe(value)
        expect(numberCodec.decode(value, 'msgpack')).toBe(value)
      })
    })

    describe('format independence', () => {
      test.each<{ value: number | undefined; description: string }>([
        { value: undefined, description: 'undefined' },
        { value: 1, description: '1' },
        { value: 42, description: '42' },
        { value: Number.MAX_SAFE_INTEGER, description: 'MAX_SAFE_INTEGER' },
        { value: Number.MIN_SAFE_INTEGER, description: 'MIN_SAFE_INTEGER' },
      ])('should produce same result for JSON and msgpack when decoding $description', ({ value }) => {
        expect(numberCodec.decode(value, 'json')).toBe(numberCodec.decode(value, 'msgpack'))
      })
    })
  })

  describe('decodeOptional', () => {
    test('should preserve undefined', () => {
      expect(numberCodec.decodeOptional(undefined, 'json')).toBeUndefined()
      expect(numberCodec.decodeOptional(undefined, 'msgpack')).toBeUndefined()
    })

    test.each<{ value: number; description: string }>([
      { value: 0, description: '0 (not undefined)' },
      { value: 42, description: '42' },
      { value: -42, description: '-42' },
      { value: 3.14, description: '3.14' },
    ])('should decode $description', ({ value }) => {
      expect(numberCodec.decodeOptional(value, 'json')).toBe(value)
      expect(numberCodec.decodeOptional(value, 'msgpack')).toBe(value)
    })
  })
})

// TODO: NC - I think we can aim to try remove this code entirely
describe('NumberWithNoDefaultCodec', () => {
  describe('encode', () => {
    describe('zero values', () => {
      test('should not omit 0n when encoding', () => {
        const encodedJson = numberWithNoDefaultCodec.encode(0, 'json')
        expect(encodedJson).toBe(0)

        const encodedMsgpack = numberWithNoDefaultCodec.encode(0, 'msgpack')
        expect(encodedMsgpack).toBe(0)
      })
    })
  })
})
