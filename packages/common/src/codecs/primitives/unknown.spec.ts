import { describe, expect, test } from 'vitest'
import { ADDRESS_LENGTH, PUBLIC_KEY_BYTE_LENGTH, SIGNATURE_BYTE_LENGTH } from '../../constants'
import { unknownCodec } from './unknown'

describe('UnknownCodec', () => {
  describe('defaultValue', () => {
    test('should return undefined', () => {
      expect(unknownCodec.defaultValue()).toBeUndefined()
    })
  })

  describe('encode', () => {
    test('should throw error', () => {
      expect(() => unknownCodec.encode('test', 'json')).toThrow('UnknownCodec does not support encoding')
      expect(() => unknownCodec.encode('test', 'msgpack')).toThrow('UnknownCodec does not support encoding')
    })
  })

  describe('encodeOptional', () => {
    test('should throw error', () => {
      expect(() => unknownCodec.encodeOptional('test', 'json')).toThrow('UnknownCodec does not support encoding')
      expect(() => unknownCodec.encodeOptional('test', 'msgpack')).toThrow('UnknownCodec does not support encoding')
    })
  })

  describe('decode', () => {
    describe('default values', () => {
      test.each<{ value: unknown; description: string }>([
        { value: undefined, description: 'undefined' },
        { value: null, description: 'null' },
      ])('should encode $description to empty object/map', ({ value }) => {
        expect(unknownCodec.decode(value, 'json')).toBeUndefined()
        expect(unknownCodec.decode(value, 'msgpack')).toBeUndefined()
      })
    })

    describe('primitive values', () => {
      test.each<{ value: unknown; description: string }>([
        { value: 42, description: 'number' },
        { value: 0, description: 'zero' },
        { value: -10, description: 'negative number' },
        { value: 'hello', description: 'string' },
        { value: '', description: 'empty string' },
        { value: true, description: 'boolean true' },
        { value: false, description: 'boolean false' },
        { value: 123n, description: 'bigint' },
      ])('should pass through $description unchanged', ({ value }) => {
        expect(unknownCodec.decode(value, 'json')).toBe(value)
        expect(unknownCodec.decode(value, 'msgpack')).toBe(value)
      })
    })

    describe('Uint8Array handling', () => {
      test('should decode UTF-8 encoded bytes as string', () => {
        const bytes = new TextEncoder().encode('hello world')
        const result = unknownCodec.decode(bytes, 'msgpack')
        expect(result).toBe('hello world')
      })

      test('should return invalid UTF-8 bytes unchanged', () => {
        const invalidUtf8 = new Uint8Array([0xff, 0xfe, 0xfd])
        const result = unknownCodec.decode(invalidUtf8, 'msgpack')
        expect(result).toBeInstanceOf(Uint8Array)
        expect(result).toEqual(invalidUtf8)
      })

      test('should return ADDRESS_LENGTH bytes with all zeros unchanged', () => {
        const zeroAddress = new Uint8Array(ADDRESS_LENGTH).fill(0)
        const result = unknownCodec.decode(zeroAddress, 'msgpack')
        expect(result).toBeInstanceOf(Uint8Array)
        expect(result).toEqual(zeroAddress)
      })

      test('should return PUBLIC_KEY_BYTE_LENGTH bytes with all zeros unchanged', () => {
        const zeroPublicKey = new Uint8Array(PUBLIC_KEY_BYTE_LENGTH).fill(0)
        const result = unknownCodec.decode(zeroPublicKey, 'msgpack')
        expect(result).toBeInstanceOf(Uint8Array)
        expect(result).toEqual(zeroPublicKey)
      })

      test('should return SIGNATURE_BYTE_LENGTH bytes with all zeros unchanged', () => {
        const zeroSignature = new Uint8Array(SIGNATURE_BYTE_LENGTH).fill(0)
        const result = unknownCodec.decode(zeroSignature, 'msgpack')
        expect(result).toBeInstanceOf(Uint8Array)
        expect(result).toEqual(zeroSignature)
      })

      test('should decode ADDRESS_LENGTH bytes with non-zero values as UTF-8 if possible', () => {
        // Create a valid UTF-8 string of ADDRESS_LENGTH
        const text = 'a'.repeat(ADDRESS_LENGTH)
        const bytes = new TextEncoder().encode(text)
        expect(bytes.length).toBe(ADDRESS_LENGTH)
        const result = unknownCodec.decode(bytes, 'msgpack')
        expect(result).toBe(text)
      })

      test('should return ADDRESS_LENGTH bytes with invalid UTF-8 unchanged', () => {
        const invalidBytes = new Uint8Array(ADDRESS_LENGTH).fill(0xff)
        const result = unknownCodec.decode(invalidBytes, 'msgpack')
        expect(result).toBeInstanceOf(Uint8Array)
        expect(result).toEqual(invalidBytes)
      })
    })

    describe('array handling', () => {
      test('should decode empty array', () => {
        const result = unknownCodec.decode([], 'json')
        expect(result).toEqual([])
        expect(Array.isArray(result)).toBe(true)
      })

      test('should recursively decode array elements', () => {
        const input = [1, 'hello', true, null]
        const result = unknownCodec.decode(input, 'json')
        expect(result).toEqual([1, 'hello', true, undefined])
      })

      test('should decode nested arrays', () => {
        const input = [1, [2, [3, 4]], 5]
        const result = unknownCodec.decode(input, 'json')
        expect(result).toEqual([1, [2, [3, 4]], 5])
      })

      test('should decode Uint8Array elements in array', () => {
        const bytes = new TextEncoder().encode('test')
        const input = ['before', bytes, 'after']
        const result = unknownCodec.decode(input, 'msgpack') as unknown[]
        expect(result[0]).toBe('before')
        expect(result[1]).toBe('test')
        expect(result[2]).toBe('after')
      })
    })

    describe('Map handling', () => {
      test('should convert empty Map to empty object', () => {
        const input = new Map()
        const result = unknownCodec.decode(input, 'msgpack')
        expect(result).toEqual({})
      })

      test('should convert Map with string keys to object', () => {
        const input = new Map<string, unknown>([
          ['key1', 'value1'],
          ['key2', 42],
          ['key3', true],
        ])
        const result = unknownCodec.decode(input, 'msgpack')
        expect(result).toEqual({
          key1: 'value1',
          key2: 42,
          key3: true,
        })
      })

      test('should convert Map with Uint8Array keys to object with string keys', () => {
        const key1 = new TextEncoder().encode('key1')
        const key2 = new TextEncoder().encode('key2')
        const input = new Map([
          [key1, 'value1'],
          [key2, 'value2'],
        ])
        const result = unknownCodec.decode(input, 'msgpack')
        expect(result).toEqual({
          key1: 'value1',
          key2: 'value2',
        })
      })

      test('should fail to convert Map with number keys', () => {
        const input = new Map([
          [1, 'one'],
          [2, 'two'],
          [3, 'three'],
        ])
        expect(() => unknownCodec.decode(input, 'msgpack')).toThrow('RecordCodec received a non-string key of type number')
      })

      test('should recursively decode Map values', () => {
        const nestedMap = new Map([['nested', 'value']])
        const input = new Map<string, unknown>([
          ['key1', 'simple'],
          ['key2', nestedMap],
          ['key3', [1, 2, 3]],
        ])
        const result = unknownCodec.decode(input, 'msgpack')
        expect(result).toEqual({
          key1: 'simple',
          key2: { nested: 'value' },
          key3: [1, 2, 3],
        })
      })
    })

    describe('object handling', () => {
      test('should decode empty object', () => {
        const result = unknownCodec.decode({}, 'json')
        expect(result).toEqual({})
      })

      test('should recursively decode object properties', () => {
        const input = {
          prop1: 'value1',
          prop2: 42,
          prop3: true,
        }
        const result = unknownCodec.decode(input, 'json')
        expect(result).toEqual(input)
      })

      test('should recursively decode nested objects', () => {
        const input = {
          level1: {
            level2: {
              level3: 'deep value',
            },
          },
        }
        const result = unknownCodec.decode(input, 'json')
        expect(result).toEqual(input)
      })

      test('should decode object with array values', () => {
        const input = {
          numbers: [1, 2, 3],
          strings: ['a', 'b', 'c'],
        }
        const result = unknownCodec.decode(input, 'json')
        expect(result).toEqual(input)
      })
    })

    describe('complex nested structures', () => {
      test('should handle deeply nested mixed structures', () => {
        const bytes = new TextEncoder().encode('encoded')
        const nestedMap = new Map<string, unknown>([
          ['mapKey', 'mapValue'],
          ['number', 123],
        ])
        const input = {
          array: [1, 'two', bytes],
          map: nestedMap,
          nested: {
            deep: {
              value: true,
            },
          },
        }
        const result = unknownCodec.decode(input, 'msgpack')
        expect(result).toEqual({
          array: [1, 'two', 'encoded'],
          map: {
            mapKey: 'mapValue',
            number: 123,
          },
          nested: {
            deep: {
              value: true,
            },
          },
        })
      })

      test('should handle array of maps', () => {
        const map1 = new Map([['a', 1]])
        const map2 = new Map([['b', 2]])
        const input = [map1, map2]
        const result = unknownCodec.decode(input, 'msgpack')
        expect(result).toEqual([{ a: 1 }, { b: 2 }])
      })

      test('should handle map of arrays', () => {
        const input = new Map([
          ['arr1', [1, 2, 3]],
          ['arr2', ['a', 'b', 'c']],
        ])
        const result = unknownCodec.decode(input, 'msgpack')
        expect(result).toEqual({
          arr1: [1, 2, 3],
          arr2: ['a', 'b', 'c'],
        })
      })
    })
  })

  describe('decodeOptional', () => {
    describe('default values', () => {
      test.each<{ value: unknown; description: string }>([
        { value: undefined, description: 'undefined' },
        { value: null, description: 'null' },
      ])('should encode $description to empty object/map', ({ value }) => {
        expect(unknownCodec.decodeOptional(value, 'json')).toBeUndefined()
        expect(unknownCodec.decodeOptional(value, 'msgpack')).toBeUndefined()
      })
    })

    test('should decode non-undefined values', () => {
      expect(unknownCodec.decodeOptional('test', 'json')).toBe('test')
      expect(unknownCodec.decodeOptional(42, 'json')).toBe(42)
    })

    test('should decode complex structures', () => {
      const input = new Map([['key', 'value']])
      const result = unknownCodec.decodeOptional(input, 'msgpack')
      expect(result).toEqual({ key: 'value' })
    })
  })
})
