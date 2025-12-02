import { describe, expect, test } from 'vitest'
import { booleanCodec } from './boolean'

describe('BooleanCodec', () => {
  describe('defaultValue', () => {
    test('should return false', () => {
      expect(booleanCodec.defaultValue()).toBe(false)
    })
  })

  describe('encode', () => {
    describe('default values', () => {
      test.each<{ value: boolean | undefined | null; description: string }>([
        { value: false, description: 'false (default value)' },
        { value: undefined, description: 'undefined' },
        { value: null, description: 'null' },
      ])('should encode $description to false', ({ value }) => {
        expect(booleanCodec.encode(value, 'json')).toBe(false)
        expect(booleanCodec.encode(value, 'msgpack')).toBe(false)
      })
    })

    describe('values', () => {
      test('should encode true', () => {
        const encodedJson = booleanCodec.encode(true, 'json')
        expect(encodedJson).toBe(true)
        expect(typeof encodedJson).toBe('boolean')

        const encodedMsgpack = booleanCodec.encode(true, 'msgpack')
        expect(encodedMsgpack).toBe(true)
        expect(typeof encodedMsgpack).toBe('boolean')
      })
    })

    describe('format independence', () => {
      test.each<{ value: boolean | undefined | null; description: string }>([
        { value: undefined, description: 'undefined' },
        { value: null, description: 'null' },
        { value: false, description: 'false' },
        { value: true, description: 'true' },
      ])('should produce same result for JSON and msgpack when encoding $description', ({ value }) => {
        expect(booleanCodec.encode(value, 'json')).toBe(booleanCodec.encode(value, 'msgpack'))
      })
    })
  })

  describe('encodeOptional', () => {
    describe('default values', () => {
      test.each<{ value: boolean | undefined; description: string }>([
        { value: false, description: 'false (default value)' },
        { value: undefined, description: 'undefined' },
      ])('should omit $description when encoding', ({ value }) => {
        expect(booleanCodec.encodeOptional(value, 'json')).toBeUndefined()
        expect(booleanCodec.encodeOptional(value, 'msgpack')).toBeUndefined()
      })
    })

    describe('values', () => {
      test('should encode true', () => {
        const encodedJson = booleanCodec.encodeOptional(true, 'json')
        expect(encodedJson).toBe(true)
        expect(typeof encodedJson).toBe('boolean')

        const encodedMsgpack = booleanCodec.encodeOptional(true, 'msgpack')
        expect(encodedMsgpack).toBe(true)
        expect(typeof encodedMsgpack).toBe('boolean')
      })
    })

    describe('format independence', () => {
      test.each<{ value: boolean | undefined; description: string }>([
        { value: undefined, description: 'undefined' },
        { value: false, description: 'false' },
        { value: true, description: 'true' },
      ])('should produce same result for JSON and msgpack when encoding $description', ({ value }) => {
        expect(booleanCodec.encodeOptional(value, 'json')).toBe(booleanCodec.encodeOptional(value, 'msgpack'))
      })
    })
  })

  describe('decode', () => {
    describe('default values', () => {
      test.each<{ value: boolean | undefined; description: string }>([
        { value: false, description: 'false (default value)' },
        { value: undefined, description: 'undefined' },
      ])('should decode $description to false', ({ value }) => {
        expect(booleanCodec.decode(value, 'json')).toBe(false)
        expect(booleanCodec.decode(value, 'msgpack')).toBe(false)
      })
    })

    describe('true value', () => {
      test('should decode true', () => {
        expect(booleanCodec.decode(true, 'json')).toBe(true)
        expect(booleanCodec.decode(true, 'msgpack')).toBe(true)
      })
    })

    describe('format independence', () => {
      test.each<{ value: boolean | undefined; description: string }>([
        { value: undefined, description: 'undefined' },
        { value: false, description: 'false' },
        { value: true, description: 'true' },
      ])('should produce same result for JSON and msgpack when decoding $description', ({ value }) => {
        expect(booleanCodec.decode(value, 'json')).toBe(booleanCodec.decode(value, 'msgpack'))
      })
    })
  })

  describe('decodeOptional', () => {
    test.each<{ value: boolean | null | undefined; description: string }>([
      { value: undefined, description: 'undefined' },
      { value: null, description: 'null' },
    ])('should decode $description to undefined', ({ value }) => {
      expect(booleanCodec.decodeOptional(value, 'json')).toBeUndefined()
      expect(booleanCodec.decodeOptional(value, 'msgpack')).toBeUndefined()
    })

    test.each<{ value: boolean; description: string }>([
      { value: false, description: 'false (not undefined)' },
      { value: true, description: 'true' },
    ])('should decode $description', ({ value }) => {
      expect(booleanCodec.decodeOptional(value, 'json')).toBe(value)
      expect(booleanCodec.decodeOptional(value, 'msgpack')).toBe(value)
    })
  })
})
