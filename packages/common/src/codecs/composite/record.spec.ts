import { describe, expect, test } from 'vitest'
import { numberCodec } from '../primitives/number'
import { stringCodec } from '../primitives/string'
import { RecordCodec } from './record'

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

  describe('encodeOptional', () => {
    describe('default values', () => {
      test.each<{ value: Record<string, string> | undefined; description: string }>([
        { value: {}, description: 'empty object (default value)' },
        { value: undefined, description: 'undefined' },
      ])('should omit $description when encoding', ({ value }) => {
        expect(stringRecordCodec.encodeOptional(value, 'json')).toBeUndefined()
        expect(stringRecordCodec.encodeOptional(value, 'msgpack')).toBeUndefined()
      })
    })

    describe('non-empty records', () => {
      test('should encode string record', () => {
        const record = { key1: 'value1', key2: 'value2' }
        const encoded = stringRecordCodec.encodeOptional(record, 'json')
        expect(encoded).toEqual({ key1: 'value1', key2: 'value2' })
      })

      test('should encode number record', () => {
        const record = { a: 1, b: 2, c: 3 }
        const encoded = numberRecordCodec.encodeOptional(record, 'json')
        expect(encoded).toEqual({ a: 1, b: 2, c: 3 })
      })

      test('should not filter out default values', () => {
        const record = { key1: 'value1', key2: '' } // empty string is default
        const encoded = stringRecordCodec.encodeOptional(record, 'json')
        expect(encoded).toEqual({ key1: 'value1', key2: '' })
      })
    })

    describe('format independence', () => {
      test('should produce same result for JSON and msgpack', () => {
        const record = { key1: 'value1', key2: 'value2' }
        expect(stringRecordCodec.encodeOptional(record, 'json')).toEqual(stringRecordCodec.encodeOptional(record, 'msgpack'))
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
      test('should decode Map with Uint8Array keys to record (UTF-8 conversion)', () => {
        const map = new Map([
          [Buffer.from('key1', 'utf-8'), 'value1'],
          [Buffer.from('key2', 'utf-8'), 'value2'],
        ])

        const decoded = stringRecordCodec.decode(map as unknown as Record<string, string>, 'msgpack')
        expect(decoded).toEqual({ key1: 'value1', key2: 'value2' })

        const decodedJson = stringRecordCodec.decode(map as unknown as Record<string, string>, 'json')
        expect(decodedJson).toEqual({ key1: 'value1', key2: 'value2' })
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
})
