import { describe, expect, test } from 'vitest'
import { ArrayCodec } from '../composite/array'
import { numberCodec } from '../primitives/number'
import { stringCodec } from '../primitives/string'
import type { ObjectModelMetadata } from '../types'
import { ArrayModelCodec } from './array-model'
import { ObjectModelCodec } from './object-model'

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

  describe('with object array codec', () => {
    type Person = {
      name?: string
      age?: number
      email?: string
    }

    const personMetadata: ObjectModelMetadata<Person> = {
      name: 'Person',
      kind: 'object',
      fields: [
        { name: 'name', wireKey: 'n', codec: stringCodec, optional: true },
        { name: 'age', wireKey: 'a', codec: numberCodec, optional: true },
        { name: 'email', wireKey: 'e', codec: stringCodec, optional: true },
      ],
    }

    const codec = new ArrayModelCodec({
      name: 'PersonArray',
      kind: 'array',
      codec: new ArrayCodec(new ObjectModelCodec(personMetadata)),
    })

    describe('encode', () => {
      describe('default values', () => {
        test.each<{ value: Person[] | undefined | null; description: string }>([
          { value: [], description: 'empty array (default value)' },
          { value: undefined, description: 'undefined' },
          { value: null, description: 'null' },
        ])('should encode $description to undefined', ({ value }) => {
          expect(codec.encode(value, 'json')).toBeUndefined()
          expect(codec.encode(value, 'msgpack')).toBeUndefined()
        })
      })

      describe('arrays with objects', () => {
        test('should encode array with empty objects (all fields optional)', () => {
          const value: Person[] = [{}, {}]
          const expected = [{}, {}]
          expect(codec.encode(value, 'json')).toEqual(expected)
          expect(codec.encode(value, 'msgpack')).toEqual(expected)
        })

        test('should encode array with mix of empty and populated objects', () => {
          const value: Person[] = [{ name: 'Alice', age: 30 }, {}, { email: 'bob@example.com' }, {}]
          const expected = [{ n: 'Alice', a: 30 }, {}, { e: 'bob@example.com' }, {}]
          expect(codec.encode(value, 'json')).toEqual(expected)
          expect(codec.encode(value, 'msgpack')).toEqual(expected)
        })

        test('should encode array with objects at default values', () => {
          const value: Person[] = [{ name: '', age: 0, email: '' }]
          const expected = [{}]
          expect(codec.encode(value, 'json')).toEqual(expected)
          expect(codec.encode(value, 'msgpack')).toEqual(expected)
        })
      })
    })

    describe('encodeOptional', () => {
      describe('default values', () => {
        test.each<{ value: Person[] | undefined; description: string }>([
          { value: [], description: 'empty array (default value)' },
          { value: undefined, description: 'undefined' },
        ])('should omit $description when encoding', ({ value }) => {
          expect(codec.encodeOptional(value, 'json')).toBeUndefined()
          expect(codec.encodeOptional(value, 'msgpack')).toBeUndefined()
        })
      })

      describe('arrays with objects', () => {
        test('should encode array with empty objects (all fields optional)', () => {
          const value: Person[] = [{}, {}]
          const expected = [{}, {}]
          expect(codec.encodeOptional(value, 'json')).toEqual(expected)
          expect(codec.encodeOptional(value, 'msgpack')).toEqual(expected)
        })

        test('should encode array with mix of empty and populated objects', () => {
          const value: Person[] = [{ name: 'Alice', age: 30 }, {}, { email: 'bob@example.com' }, {}]
          const expected = [{ n: 'Alice', a: 30 }, {}, { e: 'bob@example.com' }, {}]
          expect(codec.encodeOptional(value, 'json')).toEqual(expected)
          expect(codec.encodeOptional(value, 'msgpack')).toEqual(expected)
        })

        test('should encode array with objects at default values', () => {
          const value: Person[] = [{ name: '', age: 0, email: '' }]
          const expected = [{}]
          expect(codec.encodeOptional(value, 'json')).toEqual(expected)
          expect(codec.encodeOptional(value, 'msgpack')).toEqual(expected)
        })
      })
    })

    describe('decode', () => {
      describe('default values', () => {
        test.each<{ value: unknown[] | undefined | null; description: string }>([
          { value: [], description: 'empty array (default value)' },
          { value: undefined, description: 'undefined' },
          { value: null, description: 'null' },
        ])('should decode $description to empty array', ({ value }) => {
          expect(codec.decode(value, 'json')).toEqual([])
          expect(codec.decode(value, 'msgpack')).toEqual([])
        })
      })

      describe('non-empty arrays', () => {
        test('should decode array with multiple objects', () => {
          const wireValue = [
            { n: 'Alice', a: 30, e: 'alice@example.com' },
            { n: 'Bob', a: 25 },
            { n: 'Charlie', a: 35 },
          ]
          const expected: Person[] = [
            { name: 'Alice', age: 30, email: 'alice@example.com' },
            { name: 'Bob', age: 25 },
            { name: 'Charlie', age: 35 },
          ]
          expect(codec.decode(wireValue, 'json')).toEqual(expected)
          expect(codec.decode(wireValue, 'msgpack')).toEqual(expected)
        })
      })

      describe('arrays with empty objects', () => {
        test('should decode array with empty objects (all optional fields) to array with empty objects', () => {
          const wireValue = [{}]
          const expected: Person[] = [{}]
          expect(codec.decode(wireValue, 'json')).toEqual(expected)
          expect(codec.decode(wireValue, 'msgpack')).toEqual(expected)
        })

        test('should decode array with mix of empty and populated objects', () => {
          const wireValue = [{ n: 'Alice', a: 30 }, {}, { e: 'bob@example.com' }, {}]
          const expected: Person[] = [{ name: 'Alice', age: 30 }, {}, { email: 'bob@example.com' }, {}]
          expect(codec.decode(wireValue, 'json')).toEqual(expected)
          expect(codec.decode(wireValue, 'msgpack')).toEqual(expected)
        })
      })
    })

    describe('decodeOptional', () => {
      describe('default values', () => {
        test.each<{ value: unknown[] | undefined | null; description: string }>([
          { value: undefined, description: 'undefined' },
          { value: null, description: 'null' },
        ])('should decode $description to undefined', ({ value }) => {
          expect(codec.decodeOptional(value, 'json')).toBeUndefined()
          expect(codec.decodeOptional(value, 'msgpack')).toBeUndefined()
        })
      })

      describe('non-empty arrays', () => {
        test('should decode array with multiple objects', () => {
          const wireValue = [
            { n: 'Alice', a: 30, e: 'alice@example.com' },
            { n: 'Bob', a: 25 },
            { n: 'Charlie', a: 35 },
          ]
          const expected: Person[] = [
            { name: 'Alice', age: 30, email: 'alice@example.com' },
            { name: 'Bob', age: 25 },
            { name: 'Charlie', age: 35 },
          ]
          expect(codec.decodeOptional(wireValue, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireValue, 'msgpack')).toEqual(expected)
        })
      })

      describe('arrays with empty objects', () => {
        test('should decode array with empty objects (all optional fields) to array with empty objects', () => {
          const wireValue = [{}]
          const expected: Person[] = [{}]
          expect(codec.decodeOptional(wireValue, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireValue, 'msgpack')).toEqual(expected)
        })

        test('should decode array with mix of empty and populated objects', () => {
          const wireValue = [{ n: 'Alice', a: 30 }, {}, { e: 'bob@example.com' }, {}]
          const expected: Person[] = [{ name: 'Alice', age: 30 }, {}, { email: 'bob@example.com' }, {}]
          expect(codec.decodeOptional(wireValue, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireValue, 'msgpack')).toEqual(expected)
        })
      })
    })
  })
})
