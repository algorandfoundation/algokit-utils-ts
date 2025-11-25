import { describe, expect, test } from 'vitest'
import { numberCodec } from './number'

describe('NumberCodec', () => {
  describe('defaultValue', () => {
    test('should return 0', () => {
      expect(numberCodec.defaultValue()).toBe(0)
    })
  })

  describe('encode', () => {
    describe('default values', () => {
      test.each<{ value: number | undefined | null; description: string }>([
        { value: 0, description: '0 (default value)' },
        { value: -0, description: '-0 (treated as 0)' },
        { value: NaN, description: 'NaN (treated as 0)' },
        { value: undefined, description: 'undefined' },
        { value: null, description: 'null' },
      ])('should encode $description to 0', ({ value }) => {
        expect(numberCodec.encode(value, 'json')).toBe(0)
        expect(numberCodec.encode(value, 'msgpack')).toBe(0)
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
      test.each<{ value: number | undefined | null; description: string }>([
        { value: undefined, description: 'undefined' },
        { value: null, description: 'null' },
        { value: 0, description: '0' },
        { value: 1, description: '1' },
        { value: 42, description: '42' },
        { value: Number.MAX_SAFE_INTEGER, description: 'MAX_SAFE_INTEGER' },
        { value: Number.MIN_SAFE_INTEGER, description: 'MIN_SAFE_INTEGER' },
      ])('should produce same result for JSON and msgpack when encoding $description', ({ value }) => {
        expect(numberCodec.encode(value, 'json')).toBe(numberCodec.encode(value, 'msgpack'))
      })
    })
  })

  describe('encodeOptional', () => {
    describe('default values', () => {
      test.each<{ value: number | undefined; description: string }>([
        { value: 0, description: '0 (default value)' },
        { value: -0, description: '-0 (treated as 0)' },
        { value: NaN, description: 'NaN (treated as 0)' },
        { value: undefined, description: 'undefined' },
      ])('should omit $description when encoding', ({ value }) => {
        expect(numberCodec.encodeOptional(value, 'json')).toBeUndefined()
        expect(numberCodec.encodeOptional(value, 'msgpack')).toBeUndefined()
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
        expect(numberCodec.encodeOptional(value, 'json')).toBe(value)
        expect(numberCodec.encodeOptional(value, 'msgpack')).toBe(value)
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
        expect(numberCodec.encodeOptional(value, 'json')).toBe(numberCodec.encodeOptional(value, 'msgpack'))
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
    test.each<{ value: number | null | undefined; description: string }>([
      { value: undefined, description: 'undefined' },
      { value: null, description: 'null' },
    ])('should decode $description to undefined', ({ value }) => {
      expect(numberCodec.decodeOptional(value, 'json')).toBeUndefined()
      expect(numberCodec.decodeOptional(value, 'msgpack')).toBeUndefined()
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
