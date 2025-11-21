import { describe, expect, test } from 'vitest'
import { unknownCodec } from './unknown'

describe('UnknownCodec', () => {
  describe('defaultValue', () => {
    test('should return undefined', () => {
      expect(unknownCodec.defaultValue()).toBeUndefined()
    })
  })

  describe('encode', () => {
    describe('all values pass through (no encoding)', () => {
      test.each<{ value: unknown; description: string }>([
        { value: undefined, description: 'undefined' },
        { value: null, description: 'null' },
        { value: true, description: 'boolean true' },
        { value: false, description: 'boolean false' },
        { value: 0, description: 'number 0' },
        { value: 42, description: 'number 42' },
        { value: 3.14, description: 'number 3.14' },
        { value: -100, description: 'negative number' },
        { value: '', description: 'empty string' },
        { value: 'hello', description: 'string' },
        { value: 0n, description: 'bigint 0n' },
        { value: 42n, description: 'bigint 42n' },
        { value: new Uint8Array([1, 2, 3]), description: 'Uint8Array' },
        { value: [1, 2, 3], description: 'array' },
        { value: { foo: 'bar' }, description: 'object' },
        { value: new Map([['key', 'value']]), description: 'Map' },
      ])('should pass through $description unchanged', ({ value }) => {
        const encoded = unknownCodec.encode(value, 'json')
        expect(encoded).toBe(value)

        const encodedMsgpack = unknownCodec.encode(value, 'msgpack')
        expect(encodedMsgpack).toBe(value)
      })
    })

    describe('format independence', () => {
      test.each<{ value: unknown; description: string }>([
        { value: undefined, description: 'undefined' },
        { value: 42, description: 'number' },
        { value: 'hello', description: 'string' },
        { value: true, description: 'boolean' },
        { value: null, description: 'null' },
      ])('should produce same result for JSON and msgpack when encoding $description', ({ value }) => {
        expect(unknownCodec.encode(value, 'json')).toBe(unknownCodec.encode(value, 'msgpack'))
      })
    })
  })

  describe('decode', () => {
    describe('primitives pass through unchanged', () => {
      test.each<{ value: unknown; description: string }>([
        { value: undefined, description: 'undefined' },
        { value: null, description: 'null' },
        { value: true, description: 'boolean true' },
        { value: false, description: 'boolean false' },
        { value: 0, description: 'number 0' },
        { value: 42, description: 'number 42' },
        { value: -100, description: 'negative number' },
        { value: '', description: 'empty string' },
        { value: 'hello', description: 'string' },
        { value: 0n, description: 'bigint 0n' },
        { value: 42n, description: 'bigint 42n' },
        { value: new Uint8Array([1, 2, 3]), description: 'Uint8Array' },
      ])('should pass through $description unchanged', ({ value }) => {
        expect(unknownCodec.decode(value, 'json')).toBe(value)
        expect(unknownCodec.decode(value, 'msgpack')).toBe(value)
      })
    })

    describe('arrays are processed recursively', () => {
      test('should process simple array', () => {
        const arr = [1, 2, 3]
        const decoded = unknownCodec.decode(arr, 'json')
        expect(decoded).toEqual([1, 2, 3])
        expect(Array.isArray(decoded)).toBe(true)
      })

      test('should process nested array', () => {
        const arr = [1, [2, [3, 4]], 5]
        const decoded = unknownCodec.decode(arr, 'json')
        expect(decoded).toEqual([1, [2, [3, 4]], 5])
      })

      test('should process array with Maps', () => {
        const map = new Map([
          ['key1', 'value1'],
          ['key2', 'value2'],
        ])
        const arr = [1, map, 3]
        const decoded = unknownCodec.decode(arr, 'json')
        expect(decoded).toEqual([1, { key1: 'value1', key2: 'value2' }, 3])
      })

      test('should process array with mixed types', () => {
        const arr = [1, 'hello', true, null, 42n, new Uint8Array([1, 2])]
        const decoded = unknownCodec.decode(arr, 'json')
        expect(decoded).toEqual([1, 'hello', true, null, 42n, new Uint8Array([1, 2])])
      })
    })

    describe('Maps are converted to objects', () => {
      test('should convert simple Map to object', () => {
        const map = new Map([
          ['key1', 'value1'],
          ['key2', 'value2'],
        ])
        const decoded = unknownCodec.decode(map, 'json')
        expect(decoded).toEqual({ key1: 'value1', key2: 'value2' })
      })

      test('should convert Map with number keys to object', () => {
        const map = new Map([
          [1, 'one'],
          [2, 'two'],
        ])
        const decoded = unknownCodec.decode(map, 'json')
        expect(decoded).toEqual({ '1': 'one', '2': 'two' })
      })

      test('should convert Map with Uint8Array keys to object with string keys', () => {
        const key1 = new Uint8Array([72, 101, 108, 108, 111]) // "Hello" in UTF-8
        const key2 = new Uint8Array([87, 111, 114, 108, 100]) // "World" in UTF-8
        const map = new Map([
          [key1, 'value1'],
          [key2, 'value2'],
        ])
        const decoded = unknownCodec.decode(map, 'json') as Record<string, unknown>
        expect(decoded).toHaveProperty('Hello')
        expect(decoded).toHaveProperty('World')
        expect(decoded.Hello).toBe('value1')
        expect(decoded.World).toBe('value2')
      })

      test('should convert nested Maps recursively', () => {
        const innerMap = new Map([
          ['inner1', 'innerValue1'],
          ['inner2', 'innerValue2'],
        ])
        const outerMap = new Map<string, unknown>([
          ['outer1', 'outerValue1'],
          ['outer2', innerMap],
        ])
        const decoded = unknownCodec.decode(outerMap, 'json')
        expect(decoded).toEqual({
          outer1: 'outerValue1',
          outer2: {
            inner1: 'innerValue1',
            inner2: 'innerValue2',
          },
        })
      })

      test('should handle Map with array values', () => {
        const map = new Map([
          ['key1', [1, 2, 3]],
          ['key2', ['a', 'b', 'c']],
        ])
        const decoded = unknownCodec.decode(map, 'json')
        expect(decoded).toEqual({
          key1: [1, 2, 3],
          key2: ['a', 'b', 'c'],
        })
      })

      test('should handle Map with object values', () => {
        const map = new Map([
          ['key1', { nested: 'object1' }],
          ['key2', { nested: 'object2' }],
        ])
        const decoded = unknownCodec.decode(map, 'json')
        expect(decoded).toEqual({
          key1: { nested: 'object1' },
          key2: { nested: 'object2' },
        })
      })
    })

    describe('objects are processed recursively', () => {
      test('should process simple object', () => {
        const obj = { foo: 'bar', baz: 42 }
        const decoded = unknownCodec.decode(obj, 'json')
        expect(decoded).toEqual({ foo: 'bar', baz: 42 })
      })

      test('should process nested object', () => {
        const obj = {
          level1: {
            level2: {
              level3: 'deep',
            },
          },
        }
        const decoded = unknownCodec.decode(obj, 'json')
        expect(decoded).toEqual({
          level1: {
            level2: {
              level3: 'deep',
            },
          },
        })
      })

      test('should process object with Map values', () => {
        const map = new Map([
          ['mapKey1', 'mapValue1'],
          ['mapKey2', 'mapValue2'],
        ])
        const obj = {
          regularKey: 'regularValue',
          mapKey: map,
        }
        const decoded = unknownCodec.decode(obj, 'json')
        expect(decoded).toEqual({
          regularKey: 'regularValue',
          mapKey: {
            mapKey1: 'mapValue1',
            mapKey2: 'mapValue2',
          },
        })
      })

      test('should process object with array values', () => {
        const obj = {
          arr1: [1, 2, 3],
          arr2: ['a', 'b', 'c'],
        }
        const decoded = unknownCodec.decode(obj, 'json')
        expect(decoded).toEqual({
          arr1: [1, 2, 3],
          arr2: ['a', 'b', 'c'],
        })
      })
    })

    describe('complex nested structures', () => {
      test('should handle deeply nested structure with Maps, arrays, and objects', () => {
        const innerMap = new Map([['mapKey', 'mapValue']])
        const middleMap = new Map<string, unknown>([
          ['inner', innerMap],
          ['array', [1, 2, new Map([['nested', 'value']])]],
        ])
        const outerObj = {
          topLevel: 'value',
          map: middleMap,
          array: [1, new Map([['key', 'val']]), { nested: 'obj' }],
        }

        const decoded = unknownCodec.decode(outerObj, 'json')
        expect(decoded).toEqual({
          topLevel: 'value',
          map: {
            inner: { mapKey: 'mapValue' },
            array: [1, 2, { nested: 'value' }],
          },
          array: [1, { key: 'val' }, { nested: 'obj' }],
        })
      })
    })

    describe('format independence', () => {
      test.each<{ value: unknown; description: string }>([
        { value: undefined, description: 'undefined' },
        { value: 42, description: 'number' },
        { value: 'hello', description: 'string' },
        { value: [1, 2, 3], description: 'array' },
        { value: { foo: 'bar' }, description: 'object' },
      ])('should produce same result for JSON and msgpack when decoding $description', ({ value }) => {
        expect(unknownCodec.decode(value, 'json')).toEqual(unknownCodec.decode(value, 'msgpack'))
      })

      test('should produce same result for JSON and msgpack when decoding Map', () => {
        const map = new Map([
          ['key1', 'value1'],
          ['key2', 'value2'],
        ])
        expect(unknownCodec.decode(map, 'json')).toEqual(unknownCodec.decode(map, 'msgpack'))
      })
    })
  })

  describe('decodeOptional', () => {
    test('should preserve undefined', () => {
      expect(unknownCodec.decodeOptional(undefined, 'json')).toBeUndefined()
      expect(unknownCodec.decodeOptional(undefined, 'msgpack')).toBeUndefined()
    })

    test.each<{ value: unknown; description: string }>([
      { value: null, description: 'null (not undefined)' },
      { value: 0, description: '0' },
      { value: '', description: 'empty string' },
      { value: false, description: 'false' },
      { value: 42, description: '42' },
      { value: 'hello', description: 'string' },
    ])('should decode $description', ({ value }) => {
      expect(unknownCodec.decodeOptional(value, 'json')).toBe(value)
      expect(unknownCodec.decodeOptional(value, 'msgpack')).toBe(value)
    })

    test('should convert Map in optional mode', () => {
      const map = new Map([['key', 'value']])
      const decoded = unknownCodec.decodeOptional(map, 'json')
      expect(decoded).toEqual({ key: 'value' })
    })
  })

  describe('edge cases', () => {
    test('should handle empty Map', () => {
      const map = new Map()
      const decoded = unknownCodec.decode(map, 'json')
      expect(decoded).toEqual({})
    })

    test('should handle empty array', () => {
      const arr: unknown[] = []
      const decoded = unknownCodec.decode(arr, 'json')
      expect(decoded).toEqual([])
    })

    test('should handle empty object', () => {
      const obj = {}
      const decoded = unknownCodec.decode(obj, 'json')
      expect(decoded).toEqual({})
    })

    test('should handle Map with undefined values', () => {
      const map = new Map([
        ['key1', undefined],
        ['key2', 'value2'],
      ])
      const decoded = unknownCodec.decode(map, 'json')
      expect(decoded).toEqual({
        key1: undefined,
        key2: 'value2',
      })
    })

    test('should handle Map with null values', () => {
      const map = new Map([
        ['key1', null],
        ['key2', 'value2'],
      ])
      const decoded = unknownCodec.decode(map, 'json')
      expect(decoded).toEqual({
        key1: null,
        key2: 'value2',
      })
    })

    test('should throw on circular references (expected limitation)', () => {
      // Circular references cause stack overflow due to recursive processing
      // This is an expected limitation - circular references should be avoided
      const obj: { self?: unknown } = {}
      obj.self = obj

      // The codec will throw due to stack overflow on circular references
      expect(() => unknownCodec.decode(obj, 'json')).toThrow()
    })

    test('should handle Uint8Array keys with different encodings', () => {
      // UTF-8 encoded strings
      const key1 = new Uint8Array([0xc3, 0xa9]) // "é" in UTF-8
      const key2 = new Uint8Array([0xe2, 0x82, 0xac]) // "€" in UTF-8
      const map = new Map([
        [key1, 'value1'],
        [key2, 'value2'],
      ])
      const decoded = unknownCodec.decode(map, 'json') as Record<string, unknown>
      expect(decoded).toHaveProperty('é')
      expect(decoded).toHaveProperty('€')
    })
  })

  describe('round-trip encoding/decoding', () => {
    test('should round-trip primitive values', () => {
      const values = [undefined, null, true, 42, 'hello', 0n, new Uint8Array([1, 2, 3])]
      values.forEach((value) => {
        const encoded = unknownCodec.encode(value, 'json')
        const decoded = unknownCodec.decode(encoded, 'json')
        expect(decoded).toBe(value)
      })
    })

    test('should round-trip arrays', () => {
      const arr = [1, 'hello', true, null]
      const encoded = unknownCodec.encode(arr, 'json')
      const decoded = unknownCodec.decode(encoded, 'json')
      expect(decoded).toEqual(arr)
    })

    test('should round-trip objects', () => {
      const obj = { foo: 'bar', baz: 42, nested: { key: 'value' } }
      const encoded = unknownCodec.encode(obj, 'json')
      const decoded = unknownCodec.decode(encoded, 'json')
      expect(decoded).toEqual(obj)
    })

    test('should convert Map to object (one-way transformation)', () => {
      const map = new Map([
        ['key1', 'value1'],
        ['key2', 'value2'],
      ])
      const encoded = unknownCodec.encode(map, 'json')
      const decoded = unknownCodec.decode(encoded, 'json')
      // Map is converted to object during decode
      expect(decoded).toEqual({ key1: 'value1', key2: 'value2' })
      expect(decoded).not.toBeInstanceOf(Map)
    })
  })
})
