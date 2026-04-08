import { describe, expect, test } from 'vitest'
import { numberCodec } from '../primitives/number'
import { stringCodec } from '../primitives/string'
import { MapCodec } from './map'

describe('MapCodec', () => {
  const stringKeyMapCodec = new MapCodec(stringCodec, numberCodec)
  const numberKeyMapCodec = new MapCodec(numberCodec, stringCodec)

  describe('defaultValue', () => {
    test('should return empty Map', () => {
      const defaultValue = stringKeyMapCodec.defaultValue()
      expect(defaultValue).toEqual(new Map())
      expect(defaultValue instanceof Map).toBe(true)
      expect(defaultValue.size).toBe(0)
    })
  })

  describe('encode', () => {
    describe('with string keys', () => {
      describe('default values', () => {
        test.each<{ value: Map<string, number> | undefined | null; description: string }>([
          { value: new Map<string, number>(), description: 'empty map (default value)' },
          { value: undefined, description: 'undefined' },
          { value: null, description: 'null' },
        ])('should encode $description to empty object/map', ({ value }) => {
          expect(stringKeyMapCodec.encode(value, 'json')).toEqual({})
          expect(stringKeyMapCodec.encode(value, 'msgpack')).toEqual(new Map())
        })
      })

      describe('with values', () => {
        test('should encode to JSON object', () => {
          const value = new Map<string, number>([
            ['one', 1],
            ['two', 2],
            ['three', 3],
          ])

          expect(stringKeyMapCodec.encode(value, 'json')).toEqual({
            one: 1,
            two: 2,
            three: 3,
          })
        })

        test('should encode to msgpack Map', () => {
          const value = new Map<string, number>([
            ['one', 1],
            ['two', 2],
            ['three', 3],
          ])

          const result = stringKeyMapCodec.encode(value, 'msgpack')
          expect(result).toEqual(
            new Map([
              ['one', 1],
              ['two', 2],
              ['three', 3],
            ]),
          )
          expect(result instanceof Map).toBe(true)
        })
      })
    })

    describe('with number keys', () => {
      test('should throw error for JSON format', () => {
        const value = new Map<number, string>([[1, 'one']])

        expect(() => numberKeyMapCodec.encode(value, 'json')).toThrow("Map key of type 'number' is not supported in json format")
      })

      test('should encode to msgpack Map', () => {
        const value = new Map<number, string>([
          [0, 'zero'],
          [1, 'one'],
          [2, 'two'],
          [3, 'three'],
        ])

        const result = numberKeyMapCodec.encode(value, 'msgpack')
        expect(result).toEqual(
          new Map([
            [0, 'zero'],
            [1, 'one'],
            [2, 'two'],
            [3, 'three'],
          ]),
        )
        expect(result instanceof Map).toBe(true)
      })
    })
  })

  describe('encodeOptional', () => {
    describe('with string keys', () => {
      test('should return undefined for empty map', () => {
        expect(stringKeyMapCodec.encodeOptional(new Map(), 'json')).toBeUndefined()
        expect(stringKeyMapCodec.encodeOptional(new Map(), 'msgpack')).toBeUndefined()
      })

      test('should return undefined for undefined', () => {
        expect(stringKeyMapCodec.encodeOptional(undefined, 'json')).toBeUndefined()
        expect(stringKeyMapCodec.encodeOptional(undefined, 'msgpack')).toBeUndefined()
      })

      test('should return undefined for null', () => {
        expect(stringKeyMapCodec.encodeOptional(null, 'json')).toBeUndefined()
        expect(stringKeyMapCodec.encodeOptional(null, 'msgpack')).toBeUndefined()
      })

      test('should encode non-empty map to JSON object', () => {
        const value = new Map<string, number>([
          ['one', 1],
          ['two', 2],
        ])

        expect(stringKeyMapCodec.encodeOptional(value, 'json')).toEqual({
          one: 1,
          two: 2,
        })
      })

      test('should encode non-empty map to msgpack Map', () => {
        const value = new Map<string, number>([
          ['one', 1],
          ['two', 2],
        ])

        const result = stringKeyMapCodec.encodeOptional(value, 'msgpack')
        expect(result instanceof Map).toBe(true)
        expect(result).toEqual(
          new Map([
            ['one', 1],
            ['two', 2],
          ]),
        )
      })

      test('should encode map with default values', () => {
        const value = new Map<string, number>([
          ['zero', 0],
          ['one', 1],
        ])

        expect(stringKeyMapCodec.encodeOptional(value, 'json')).toEqual({
          zero: 0,
          one: 1,
        })
      })
    })

    describe('with number keys', () => {
      test('should throw error for JSON format', () => {
        const value = new Map<number, string>([[1, 'one']])

        expect(() => numberKeyMapCodec.encodeOptional(value, 'json')).toThrow("Map key of type 'number' is not supported in json format")
      })

      test('should encode non-empty map to msgpack Map', () => {
        const value = new Map<number, string>([
          [1, 'one'],
          [2, 'two'],
        ])

        const result = numberKeyMapCodec.encodeOptional(value, 'msgpack')
        expect(result instanceof Map).toBe(true)
        expect(result).toEqual(
          new Map([
            [1, 'one'],
            [2, 'two'],
          ]),
        )
      })
    })
  })

  describe('decode', () => {
    describe('with string keys', () => {
      test('should decode empty Map', () => {
        expect(stringKeyMapCodec.decode(new Map(), 'json')).toEqual(new Map())
        expect(stringKeyMapCodec.decode(new Map(), 'msgpack')).toEqual(new Map())
      })

      test('should decode empty object', () => {
        expect(stringKeyMapCodec.decode({}, 'json')).toEqual(new Map())
      })

      test('should decode undefined to empty Map', () => {
        expect(stringKeyMapCodec.decode(undefined, 'json')).toEqual(new Map())
        expect(stringKeyMapCodec.decode(undefined, 'msgpack')).toEqual(new Map())
      })

      test('should decode null to empty Map', () => {
        expect(stringKeyMapCodec.decode(null, 'json')).toEqual(new Map())
        expect(stringKeyMapCodec.decode(null, 'msgpack')).toEqual(new Map())
      })

      test('should decode from JSON object', () => {
        const value = {
          one: 1,
          two: 2,
          three: 3,
        }

        expect(stringKeyMapCodec.decode(value, 'json')).toEqual(
          new Map([
            ['one', 1],
            ['two', 2],
            ['three', 3],
          ]),
        )
      })

      test('should decode from msgpack Map', () => {
        const value = new Map([
          ['one', 1],
          ['two', 2],
          ['three', 3],
        ])

        const result = stringKeyMapCodec.decode(value, 'msgpack')
        expect(result instanceof Map).toBe(true)
        expect(result).toEqual(
          new Map([
            ['one', 1],
            ['two', 2],
            ['three', 3],
          ]),
        )
      })

      test('should decode with default values', () => {
        const value = {
          zero: 0,
          answer: 42,
        }

        expect(stringKeyMapCodec.decode(value, 'json')).toEqual(
          new Map([
            ['zero', 0],
            ['answer', 42],
          ]),
        )
      })
    })

    describe('with number keys', () => {
      test('should throw error for JSON format', () => {
        const value = { '1': 'one' }

        expect(() => numberKeyMapCodec.decode(value, 'json')).toThrow("Map key of type 'number' is not supported in json format")
      })

      test('should decode from msgpack Map', () => {
        const value = new Map([
          [1, 'one'],
          [2, 'two'],
          [3, 'three'],
        ])

        const result = numberKeyMapCodec.decode(value, 'msgpack')
        expect(result instanceof Map).toBe(true)
        expect(result.size).toBe(3)
        expect(result).toEqual(
          new Map([
            [1, 'one'],
            [2, 'two'],
            [3, 'three'],
          ]),
        )
      })
    })
  })

  describe('decodeOptional', () => {
    describe('with string keys', () => {
      test('should return undefined for undefined', () => {
        expect(stringKeyMapCodec.decodeOptional(undefined, 'json')).toBeUndefined()
        expect(stringKeyMapCodec.decodeOptional(undefined, 'msgpack')).toBeUndefined()
      })

      test('should return undefined for null', () => {
        expect(stringKeyMapCodec.decodeOptional(null, 'json')).toBeUndefined()
        expect(stringKeyMapCodec.decodeOptional(null, 'msgpack')).toBeUndefined()
      })

      test('should decode empty to empty Map', () => {
        expect(stringKeyMapCodec.decodeOptional({}, 'json')).toEqual(new Map())
        expect(stringKeyMapCodec.decodeOptional(new Map(), 'msgpack')).toEqual(new Map())
      })

      test('should decode from JSON object', () => {
        const value = {
          one: 1,
          two: 2,
        }

        expect(stringKeyMapCodec.decodeOptional(value, 'json')).toEqual(
          new Map([
            ['one', 1],
            ['two', 2],
          ]),
        )
      })

      test('should decode from msgpack Map', () => {
        const value = new Map([
          ['one', 1],
          ['two', 2],
        ])

        const result = stringKeyMapCodec.decodeOptional(value, 'msgpack')
        expect(result instanceof Map).toBe(true)
        expect(result?.size).toBe(2)
        expect(result).toEqual(
          new Map([
            ['one', 1],
            ['two', 2],
          ]),
        )
      })
    })

    describe('with number keys', () => {
      test('should throw error for JSON format', () => {
        const value = { '1': 'one' }

        expect(() => numberKeyMapCodec.decodeOptional(value, 'json')).toThrow("Map key of type 'number' is not supported in json format")
      })

      test('should decode from msgpack Map', () => {
        const value = new Map([
          [1, 'one'],
          [2, 'two'],
        ])

        const result = numberKeyMapCodec.decodeOptional(value, 'msgpack')
        expect(result instanceof Map).toBe(true)
        expect(result?.size).toBe(2)
        expect(result).toEqual(
          new Map([
            [1, 'one'],
            [2, 'two'],
          ]),
        )
      })
    })
  })

  describe('round-trip encoding', () => {
    describe('with string keys', () => {
      test('should round-trip with JSON format', () => {
        const original = new Map<string, number>([
          ['one', 1],
          ['two', 2],
          ['hundred', 100],
        ])

        const encoded = stringKeyMapCodec.encodeOptional(original, 'json')
        const decoded = stringKeyMapCodec.decode(encoded, 'json')

        expect(decoded).toEqual(original)
      })

      test('should round-trip with msgpack format', () => {
        const original = new Map<string, number>([
          ['one', 1],
          ['two', 2],
          ['hundred', 100],
        ])

        const encoded = stringKeyMapCodec.encodeOptional(original, 'msgpack')
        const decoded = stringKeyMapCodec.decode(encoded, 'msgpack')

        expect(decoded).toEqual(original)
      })

      test('should round-trip with default values in JSON', () => {
        const original = new Map<string, number>([
          ['zero', 0],
          ['one', 1],
          ['answer', 42],
        ])

        const encoded = stringKeyMapCodec.encode(original, 'json')
        expect(encoded).toEqual({
          zero: 0,
          one: 1,
          answer: 42,
        })

        const decoded = stringKeyMapCodec.decode(encoded, 'json')
        expect(decoded).toEqual(original)
      })
    })

    describe('with number keys', () => {
      test('should round-trip with msgpack format', () => {
        const original = new Map<number, string>([
          [1, 'one'],
          [2, 'two'],
          [100, 'hundred'],
        ])

        const encoded = numberKeyMapCodec.encodeOptional(original, 'msgpack')
        const decoded = numberKeyMapCodec.decode(encoded, 'msgpack')

        expect(decoded).toEqual(original)
      })

      test('should round-trip with default values in msgpack', () => {
        const original = new Map<number, string>([
          [0, ''],
          [1, 'test'],
          [42, ''],
        ])

        const encoded = numberKeyMapCodec.encode(original, 'msgpack')
        const decoded = numberKeyMapCodec.decode(encoded, 'msgpack')

        expect(decoded).toEqual(original)
      })
    })
  })
})
