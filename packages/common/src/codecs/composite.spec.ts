import { describe, expect, test } from 'vitest'
import { ArrayCodec, MapCodec, RecordCodec, addressArrayCodec, bigIntArrayCodec, bytesArrayCodec } from './composite'
import { bytesCodec } from './primitives/bytes'
import { numberCodec } from './primitives/number'
import { stringCodec } from './primitives/string'

describe('ArrayCodec', () => {
  const numberArrayCodec = new ArrayCodec(numberCodec)
  const stringArrayCodec = new ArrayCodec(stringCodec)

  describe('defaultValue', () => {
    test('should return empty array', () => {
      const defaultVal = numberArrayCodec.defaultValue()
      expect(defaultVal).toEqual([])
      expect(Array.isArray(defaultVal)).toBe(true)
    })
  })

  describe('encode', () => {
    describe('default values', () => {
      test.each<{ value: number[] | undefined; description: string }>([
        { value: [], description: 'empty array (default value)' },
        { value: undefined, description: 'undefined' },
      ])('should omit $description when encoding', ({ value }) => {
        expect(numberArrayCodec.encode(value, 'json')).toBeUndefined()
        expect(numberArrayCodec.encode(value, 'msgpack')).toBeUndefined()
      })
    })

    describe('non-empty arrays', () => {
      test('should encode number array', () => {
        const arr = [1, 2, 3, 4, 5]
        const encoded = numberArrayCodec.encode(arr, 'json')
        expect(encoded).toEqual([1, 2, 3, 4, 5])
      })

      test('should encode string array', () => {
        const arr = ['a', 'b', 'c']
        const encoded = stringArrayCodec.encode(arr, 'json')
        expect(encoded).toEqual(['a', 'b', 'c'])
      })

      test('should encode mixed values', () => {
        const arr = [1, 0, 42, -10]
        const encoded = numberArrayCodec.encode(arr, 'json')
        // Note: 0 is default for number but within array it's still included
        expect(encoded).toEqual([1, 0, 42, -10])
      })
    })

    describe('format independence', () => {
      test('should produce same result for JSON and msgpack', () => {
        const arr = [1, 2, 3]
        expect(numberArrayCodec.encode(arr, 'json')).toEqual(numberArrayCodec.encode(arr, 'msgpack'))
      })
    })
  })

  describe('decode', () => {
    describe('default values', () => {
      test.each<{ value: number[] | undefined; description: string }>([
        { value: [], description: 'empty array' },
        { value: undefined, description: 'undefined' },
      ])('should decode $description to empty array', ({ value }) => {
        expect(numberArrayCodec.decode(value, 'json')).toEqual([])
        expect(numberArrayCodec.decode(value, 'msgpack')).toEqual([])
      })
    })

    describe('non-empty arrays', () => {
      test('should decode number array', () => {
        const arr = [1, 2, 3, 4, 5]
        expect(numberArrayCodec.decode(arr, 'json')).toEqual([1, 2, 3, 4, 5])
      })

      test('should decode string array', () => {
        const arr = ['a', 'b', 'c']
        expect(stringArrayCodec.decode(arr, 'json')).toEqual(['a', 'b', 'c'])
      })

      test('should decode using item codec', () => {
        const arr = ['1', '2', '3'] as unknown as bigint[]
        const decoded = bigIntArrayCodec.decode(arr, 'json')
        expect(decoded).toEqual([1n, 2n, 3n])
      })
    })

    describe('format independence', () => {
      test('should produce same result for JSON and msgpack', () => {
        const arr = [1, 2, 3]
        expect(numberArrayCodec.decode(arr, 'json')).toEqual(numberArrayCodec.decode(arr, 'msgpack'))
      })
    })
  })

  describe('decodeOptional', () => {
    test('should preserve undefined', () => {
      expect(numberArrayCodec.decodeOptional(undefined, 'json')).toBeUndefined()
    })

    test('should decode empty array (not undefined)', () => {
      expect(numberArrayCodec.decodeOptional([], 'json')).toEqual([])
    })

    test('should decode non-empty array', () => {
      expect(numberArrayCodec.decodeOptional([1, 2, 3], 'json')).toEqual([1, 2, 3])
    })
  })

  describe('round-trip encoding/decoding', () => {
    test('should round-trip number array', () => {
      const original = [1, 2, 3, 4, 5]
      const encoded = numberArrayCodec.encode(original, 'json')
      const decoded = numberArrayCodec.decode(encoded, 'json')
      expect(decoded).toEqual(original)
    })

    test('should round-trip string array', () => {
      const original = ['hello', 'world', 'test']
      const encoded = stringArrayCodec.encode(original, 'json')
      const decoded = stringArrayCodec.decode(encoded, 'json')
      expect(decoded).toEqual(original)
    })
  })

  describe('pre-defined array codecs', () => {
    test('bytesArrayCodec should work', () => {
      const arr = [new Uint8Array([1, 2, 3]), new Uint8Array([4, 5, 6])]
      const encoded = bytesArrayCodec.encode(arr, 'msgpack')
      const decoded = bytesArrayCodec.decode(encoded, 'msgpack')
      expect(decoded).toEqual(arr)
    })

    test('addressArrayCodec should work', () => {
      const addresses = [
        'VCMJKWOY5P5P7SKMZFFOCEROPJCZOTIJMNIYNUCKH7LRO45JMJP6UYBIJA',
        '7ZUECA7HFLZTXENRV24SHLU4AVPUTMTTDUFUBNBD64C73F3UHRTHAIOF6Q',
      ]
      const encoded = addressArrayCodec.encode(addresses, 'json')
      const decoded = addressArrayCodec.decode(encoded, 'json')
      expect(decoded).toEqual(addresses)
    })

    test('bigIntArrayCodec should work', () => {
      const arr = [1n, 2n, 3n, 100n, 9007199254740991n]
      const encoded = bigIntArrayCodec.encode(arr, 'msgpack')
      const decoded = bigIntArrayCodec.decode(encoded, 'msgpack')
      expect(decoded).toEqual(arr)
    })
  })
})

describe('MapCodec', () => {
  const stringNumberMapCodec = new MapCodec(stringCodec, numberCodec)
  const numberStringMapCodec = new MapCodec(numberCodec, stringCodec)

  describe('defaultValue', () => {
    test('should return empty Map', () => {
      const defaultVal = stringNumberMapCodec.defaultValue()
      expect(defaultVal).toBeInstanceOf(Map)
      expect(defaultVal.size).toBe(0)
    })
  })

  describe('encode', () => {
    describe('default values', () => {
      test.each<{ value: Map<string, number> | undefined; description: string }>([
        { value: new Map(), description: 'empty Map (default value)' },
        { value: undefined, description: 'undefined' },
      ])('should omit $description when encoding', ({ value }) => {
        expect(stringNumberMapCodec.encode(value, 'json')).toBeUndefined()
        expect(stringNumberMapCodec.encode(value, 'msgpack')).toBeUndefined()
      })
    })

    describe('JSON format', () => {
      test('should encode as array of tuples', () => {
        const map = new Map([
          ['key1', 1],
          ['key2', 2],
        ])
        const encoded = stringNumberMapCodec.encode(map, 'json')
        expect(Array.isArray(encoded)).toBe(true)
        expect(encoded).toEqual([
          ['key1', 1],
          ['key2', 2],
        ])
      })

      test('should filter out default values', () => {
        const map = new Map([
          ['key1', 1],
          ['key2', 0], // 0 is default for number
        ])
        const encoded = stringNumberMapCodec.encode(map, 'json')
        // key2 with value 0 is omitted because it's the default
        expect(encoded).toEqual([['key1', 1]])
      })
    })

    describe('msgpack format', () => {
      test('should encode as Map', () => {
        const map = new Map([
          ['key1', 1],
          ['key2', 2],
        ])
        const encoded = stringNumberMapCodec.encode(map, 'msgpack')
        expect(encoded).toBeInstanceOf(Map)
        expect(encoded).toEqual(
          new Map([
            ['key1', 1],
            ['key2', 2],
          ]),
        )
      })

      test('should handle Uint8Array keys', () => {
        const bytesStringMapCodec = new MapCodec(bytesCodec, stringCodec)
        const key1 = new Uint8Array([1, 2, 3])
        const key2 = new Uint8Array([4, 5, 6])
        const map = new Map([
          [key1, 'value1'],
          [key2, 'value2'],
        ])
        const encoded = bytesStringMapCodec.encode(map, 'msgpack') as Map<Uint8Array, string>
        expect(encoded).toBeInstanceOf(Map)
        expect(encoded.size).toBe(2)
      })
    })
  })

  describe('decode', () => {
    describe('default values', () => {
      test.each<{ value: unknown; description: string }>([
        { value: new Map(), description: 'empty Map' },
        { value: undefined, description: 'undefined' },
        { value: null, description: 'null' },
        { value: [], description: 'empty array' },
      ])('should decode $description to empty Map', ({ value }) => {
        const decoded = stringNumberMapCodec.decode(value as Map<string, number>, 'json')
        expect(decoded).toBeInstanceOf(Map)
        expect(decoded.size).toBe(0)
      })
    })

    describe('from array of tuples', () => {
      test('should decode array of tuples to Map', () => {
        const arr: Array<[string, number]> = [
          ['key1', 1],
          ['key2', 2],
        ]
        const decoded = stringNumberMapCodec.decode(arr as unknown as Map<string, number>, 'json')
        expect(decoded).toEqual(
          new Map([
            ['key1', 1],
            ['key2', 2],
          ]),
        )
      })
    })

    describe('from Map', () => {
      test('should decode Map to Map', () => {
        const map = new Map([
          ['key1', 1],
          ['key2', 2],
        ])
        const decoded = stringNumberMapCodec.decode(map, 'msgpack')
        expect(decoded).toEqual(map)
      })
    })

    describe('from plain object', () => {
      test('should decode object to Map', () => {
        const obj = { key1: 1, key2: 2 }
        const decoded = stringNumberMapCodec.decode(obj as unknown as Map<string, number>, 'json')
        expect(decoded).toEqual(
          new Map([
            ['key1', 1],
            ['key2', 2],
          ]),
        )
      })
    })
  })

  describe('decodeOptional', () => {
    test('should preserve undefined', () => {
      expect(stringNumberMapCodec.decodeOptional(undefined, 'json')).toBeUndefined()
    })

    test('should decode empty Map (not undefined)', () => {
      const decoded = stringNumberMapCodec.decodeOptional(new Map(), 'json')
      expect(decoded).toBeInstanceOf(Map)
      expect(decoded?.size).toBe(0)
    })

    test('should decode non-empty Map', () => {
      const map = new Map([['key', 1]])
      expect(stringNumberMapCodec.decodeOptional(map, 'json')).toEqual(map)
    })
  })

  describe('round-trip encoding/decoding', () => {
    test('should round-trip through msgpack format', () => {
      const original = new Map([
        ['key1', 1],
        ['key2', 2],
        ['key3', 3],
      ])
      const encoded = stringNumberMapCodec.encode(original, 'msgpack')
      const decoded = stringNumberMapCodec.decode(encoded, 'msgpack')
      expect(decoded).toEqual(original)
    })

    test('should round-trip through JSON format (as array)', () => {
      const original = new Map([
        ['key1', 1],
        ['key2', 2],
      ])
      const encoded = stringNumberMapCodec.encode(original, 'json')
      const decoded = stringNumberMapCodec.decode(encoded as unknown as Map<string, number>, 'json')
      expect(decoded).toEqual(original)
    })
  })
})

describe('RecordCodec', () => {
  const stringRecordCodec = new RecordCodec(stringCodec)
  const numberRecordCodec = new RecordCodec(numberCodec)

  describe('defaultValue', () => {
    test('should return empty object', () => {
      const defaultVal = stringRecordCodec.defaultValue()
      expect(defaultVal).toEqual({})
      expect(typeof defaultVal).toBe('object')
    })
  })

  describe('encode', () => {
    describe('default values', () => {
      test.each<{ value: Record<string, string> | undefined; description: string }>([
        { value: {}, description: 'empty object (default value)' },
        { value: undefined, description: 'undefined' },
      ])('should omit $description when encoding', ({ value }) => {
        expect(stringRecordCodec.encode(value, 'json')).toBeUndefined()
        expect(stringRecordCodec.encode(value, 'msgpack')).toBeUndefined()
      })
    })

    describe('non-empty records', () => {
      test('should encode string record', () => {
        const record = { key1: 'value1', key2: 'value2' }
        const encoded = stringRecordCodec.encode(record, 'json')
        expect(encoded).toEqual({ key1: 'value1', key2: 'value2' })
      })

      test('should encode number record', () => {
        const record = { a: 1, b: 2, c: 3 }
        const encoded = numberRecordCodec.encode(record, 'json')
        expect(encoded).toEqual({ a: 1, b: 2, c: 3 })
      })

      test('should filter out default values', () => {
        const record = { key1: 'value1', key2: '' } // empty string is default
        const encoded = stringRecordCodec.encode(record, 'json')
        expect(encoded).toEqual({ key1: 'value1' })
      })
    })

    describe('format independence', () => {
      test('should produce same result for JSON and msgpack', () => {
        const record = { key1: 'value1', key2: 'value2' }
        expect(stringRecordCodec.encode(record, 'json')).toEqual(stringRecordCodec.encode(record, 'msgpack'))
      })
    })
  })

  describe('decode', () => {
    describe('from object', () => {
      test('should decode string record', () => {
        const obj = { key1: 'value1', key2: 'value2' }
        expect(stringRecordCodec.decode(obj, 'json')).toEqual({ key1: 'value1', key2: 'value2' })
      })

      test('should decode number record', () => {
        const obj = { a: 1, b: 2, c: 3 }
        expect(numberRecordCodec.decode(obj, 'json')).toEqual({ a: 1, b: 2, c: 3 })
      })
    })

    describe('from Map', () => {
      test('should decode Map with string keys to record', () => {
        const map = new Map([
          ['key1', 'value1'],
          ['key2', 'value2'],
        ])
        const decoded = stringRecordCodec.decode(map as unknown as Record<string, string>, 'msgpack')
        expect(decoded).toEqual({ key1: 'value1', key2: 'value2' })
      })

      test('should decode Map with Uint8Array keys to record (UTF-8 conversion)', () => {
        const key1 = new Uint8Array([107, 101, 121, 49]) // "key1" in UTF-8
        const key2 = new Uint8Array([107, 101, 121, 50]) // "key2" in UTF-8
        const map = new Map([
          [key1, 'value1'],
          [key2, 'value2'],
        ])
        const decoded = stringRecordCodec.decode(map as unknown as Record<string, string>, 'msgpack')
        expect(decoded).toEqual({ key1: 'value1', key2: 'value2' })
      })
    })

    describe('format independence', () => {
      test('should produce same result for JSON and msgpack when decoding object', () => {
        const obj = { key1: 'value1', key2: 'value2' }
        expect(stringRecordCodec.decode(obj, 'json')).toEqual(stringRecordCodec.decode(obj, 'msgpack'))
      })
    })
  })

  describe('decodeOptional', () => {
    test('should preserve undefined', () => {
      expect(stringRecordCodec.decodeOptional(undefined, 'json')).toBeUndefined()
    })

    test('should decode empty object (not undefined)', () => {
      expect(stringRecordCodec.decodeOptional({}, 'json')).toEqual({})
    })

    test('should decode non-empty record', () => {
      const record = { key: 'value' }
      expect(stringRecordCodec.decodeOptional(record, 'json')).toEqual(record)
    })
  })

  describe('round-trip encoding/decoding', () => {
    test('should round-trip string record', () => {
      const original = { key1: 'value1', key2: 'value2', key3: 'value3' }
      const encoded = stringRecordCodec.encode(original, 'json')
      const decoded = stringRecordCodec.decode(encoded!, 'json')
      expect(decoded).toEqual(original)
    })

    test('should round-trip number record', () => {
      const original = { a: 1, b: 2, c: 3 }
      const encoded = numberRecordCodec.encode(original, 'json')
      const decoded = numberRecordCodec.decode(encoded!, 'json')
      expect(decoded).toEqual(original)
    })
  })
})
