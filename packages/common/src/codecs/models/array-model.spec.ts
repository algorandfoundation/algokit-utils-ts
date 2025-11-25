import { describe, expect, test } from 'vitest'
import { ArrayCodec } from '../composite/array'
import { numberCodec } from '../primitives/number'
import { stringCodec } from '../primitives/string'
import { ArrayModelCodec } from './array-model'

describe('ArrayModelCodec', () => {
  describe('with number array codec', () => {
    const codec = new ArrayModelCodec({
      name: 'NumberArray',
      kind: 'array',
      codec: new ArrayCodec(numberCodec),
    })

    describe('defaultValue', () => {
      test('should return empty array', () => {
        expect(codec.defaultValue()).toEqual([])
      })
    })

    describe('encode', () => {
      describe('default values', () => {
        test.each<{ value: number[] | undefined | null; description: string }>([
          { value: [], description: 'empty array (default value)' },
          { value: undefined, description: 'undefined' },
          { value: null, description: 'null' },
        ])('should encode $description to undefined', ({ value }) => {
          expect(codec.encode(value, 'json')).toBeUndefined()
          expect(codec.encode(value, 'msgpack')).toBeUndefined()
        })
      })

      describe('non-empty arrays', () => {
        test.each<{ value: number[]; description: string }>([
          { value: [1], description: 'single element array' },
          { value: [1, 2, 3], description: 'simple array' },
          { value: [0, 0, 0], description: 'array with zeros' },
          { value: [1, 2, 3, 4, 5], description: 'longer array' },
          { value: [-1, -2, -3], description: 'negative numbers' },
          { value: [1, -1, 0, 42], description: 'mixed values' },
        ])('should encode $description', ({ value }) => {
          expect(codec.encode(value, 'json')).toEqual(value)
          expect(codec.encode(value, 'msgpack')).toEqual(value)
        })
      })

      describe('format independence', () => {
        test.each<{ value: number[] | undefined | null; description: string }>([
          { value: undefined, description: 'undefined' },
          { value: null, description: 'null' },
          { value: [], description: 'empty array' },
          { value: [1], description: 'single element' },
          { value: [1, 2, 3], description: 'multiple elements' },
        ])('should produce same result for JSON and msgpack when encoding $description', ({ value }) => {
          expect(codec.encode(value, 'json')).toEqual(codec.encode(value, 'msgpack'))
        })
      })
    })

    describe('encodeOptional', () => {
      describe('default values', () => {
        test.each<{ value: number[] | undefined; description: string }>([
          { value: [], description: 'empty array (default value)' },
          { value: undefined, description: 'undefined' },
        ])('should omit $description when encoding', ({ value }) => {
          expect(codec.encodeOptional(value, 'json')).toBeUndefined()
          expect(codec.encodeOptional(value, 'msgpack')).toBeUndefined()
        })
      })

      describe('non-empty arrays', () => {
        test.each<{ value: number[]; description: string }>([
          { value: [1], description: 'single element array' },
          { value: [1, 2, 3], description: 'simple array' },
          { value: [0, 0, 0], description: 'array with zeros' },
          { value: [1, 2, 3, 4, 5], description: 'longer array' },
          { value: [-1, -2, -3], description: 'negative numbers' },
          { value: [1, -1, 0, 42], description: 'mixed values' },
        ])('should encode $description', ({ value }) => {
          expect(codec.encodeOptional(value, 'json')).toEqual(value)
          expect(codec.encodeOptional(value, 'msgpack')).toEqual(value)
        })
      })

      describe('format independence', () => {
        test.each<{ value: number[] | undefined; description: string }>([
          { value: undefined, description: 'undefined' },
          { value: [], description: 'empty array' },
          { value: [1], description: 'single element' },
          { value: [1, 2, 3], description: 'multiple elements' },
        ])('should produce same result for JSON and msgpack when encoding $description', ({ value }) => {
          expect(codec.encodeOptional(value, 'json')).toEqual(codec.encodeOptional(value, 'msgpack'))
        })
      })
    })

    describe('decode', () => {
      describe('default values', () => {
        test.each<{ value: number[] | undefined | null; description: string }>([
          { value: [], description: 'empty array (default value)' },
          { value: undefined, description: 'undefined' },
          { value: null, description: 'null' },
        ])('should decode $description to empty array', ({ value }) => {
          expect(codec.decode(value, 'json')).toEqual([])
          expect(codec.decode(value, 'msgpack')).toEqual([])
        })
      })

      describe('non-empty arrays', () => {
        test.each<{ value: number[]; description: string }>([
          { value: [1], description: 'single element array' },
          { value: [1, 2, 3], description: 'simple array' },
          { value: [0, 0, 0], description: 'array with zeros' },
          { value: [1, 2, 3, 4, 5], description: 'longer array' },
          { value: [-1, -2, -3], description: 'negative numbers' },
          { value: [1, -1, 0, 42], description: 'mixed values' },
        ])('should decode $description', ({ value }) => {
          expect(codec.decode(value, 'json')).toEqual(value)
          expect(codec.decode(value, 'msgpack')).toEqual(value)
        })
      })

      describe('format independence', () => {
        test.each<{ value: number[] | undefined | null; description: string }>([
          { value: undefined, description: 'undefined' },
          { value: null, description: 'null' },
          { value: [], description: 'empty array' },
          { value: [1], description: 'single element' },
          { value: [1, 2, 3], description: 'multiple elements' },
        ])('should produce same result for JSON and msgpack when decoding $description', ({ value }) => {
          expect(codec.decode(value, 'json')).toEqual(codec.decode(value, 'msgpack'))
        })
      })
    })

    describe('decodeOptional', () => {
      describe('default values', () => {
        test.each<{ value: number[] | undefined | null; description: string }>([
          { value: undefined, description: 'undefined' },
          { value: null, description: 'null' },
        ])('should decode $description to undefined', ({ value }) => {
          expect(codec.decodeOptional(value, 'json')).toBeUndefined()
          expect(codec.decodeOptional(value, 'msgpack')).toBeUndefined()
        })
      })

      describe('non-empty arrays', () => {
        test.each<{ value: number[]; description: string }>([
          { value: [1], description: 'single element array' },
          { value: [1, 2, 3], description: 'simple array' },
          { value: [0, 0, 0], description: 'array with zeros' },
          { value: [1, 2, 3, 4, 5], description: 'longer array' },
        ])('should decode $description', ({ value }) => {
          expect(codec.decodeOptional(value, 'json')).toEqual(value)
          expect(codec.decodeOptional(value, 'msgpack')).toEqual(value)
        })
      })

      describe('format independence', () => {
        test.each<{ value: number[] | undefined | null; description: string }>([
          { value: undefined, description: 'undefined' },
          { value: null, description: 'null' },
          { value: [1], description: 'single element' },
          { value: [1, 2, 3], description: 'multiple elements' },
        ])('should produce same result for JSON and msgpack when decoding $description', ({ value }) => {
          expect(codec.decodeOptional(value, 'json')).toEqual(codec.decodeOptional(value, 'msgpack'))
        })
      })
    })
  })

  describe('with string array codec', () => {
    const codec = new ArrayModelCodec({
      name: 'StringArray',
      kind: 'array',
      codec: new ArrayCodec(stringCodec),
    })

    describe('defaultValue', () => {
      test('should return empty array', () => {
        expect(codec.defaultValue()).toEqual([])
      })
    })

    describe('encode', () => {
      describe('non-empty arrays', () => {
        test.each<{ value: string[]; description: string }>([
          { value: ['a'], description: 'single element array' },
          { value: ['foo', 'bar'], description: 'simple strings' },
          { value: ['hello', 'world', 'test'], description: 'multiple strings' },
          { value: ['', 'non-empty', ''], description: 'mixed empty and non-empty' },
        ])('should encode $description', ({ value }) => {
          expect(codec.encode(value, 'json')).toEqual(value)
          expect(codec.encode(value, 'msgpack')).toEqual(value)
        })
      })
    })

    describe('decode', () => {
      describe('non-empty arrays', () => {
        test.each<{ value: string[]; description: string }>([
          { value: ['a'], description: 'single element array' },
          { value: ['foo', 'bar'], description: 'simple strings' },
          { value: ['hello', 'world', 'test'], description: 'multiple strings' },
        ])('should decode $description', ({ value }) => {
          expect(codec.decode(value, 'json')).toEqual(value)
          expect(codec.decode(value, 'msgpack')).toEqual(value)
        })
      })
    })
  })
})
