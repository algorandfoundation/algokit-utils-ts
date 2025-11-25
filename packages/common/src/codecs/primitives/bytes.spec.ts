import { describe, expect, test } from 'vitest'
import { bytesCodec } from './bytes'

describe('BytesCodec', () => {
  describe('defaultValue', () => {
    test('should return empty Uint8Array', () => {
      const defaultVal = bytesCodec.defaultValue()
      expect(defaultVal).toBeInstanceOf(Uint8Array)
      expect(defaultVal.length).toBe(0)
      expect(defaultVal.byteLength).toBe(0)
    })
  })

  describe('encode', () => {
    describe('default values', () => {
      test.each<{ value: Uint8Array | undefined | null; description: string }>([
        { value: new Uint8Array(0), description: 'empty Uint8Array (default value)' },
        { value: new Uint8Array([]), description: 'empty Uint8Array literal' },
        { value: undefined, description: 'undefined' },
        { value: null, description: 'null' },
      ])('should encode $description to empty Uint8Array/base64', ({ value }) => {
        const encoded = bytesCodec.encode(value, 'json')
        expect(encoded).toBe('')

        const encodedMsgpack = bytesCodec.encode(value, 'msgpack')
        expect(encodedMsgpack).toBeInstanceOf(Uint8Array)
        expect(encodedMsgpack.length).toBe(0)
      })
    })

    describe('JSON format', () => {
      test.each<{ bytes: number[]; expectedBase64: string; description: string }>([
        { bytes: [72, 101, 108, 108, 111], expectedBase64: 'SGVsbG8=', description: '"Hello" in ASCII' },
        { bytes: [0, 1, 2, 3, 4], expectedBase64: 'AAECAwQ=', description: 'small byte sequence' },
        { bytes: [255, 254, 253, 252], expectedBase64: '//79/A==', description: 'high byte values' },
        { bytes: [0], expectedBase64: 'AA==', description: 'single zero byte' },
        { bytes: [255], expectedBase64: '/w==', description: 'single max byte' },
        {
          bytes: Array.from({ length: 32 }, (_, i) => i),
          expectedBase64: 'AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8=',
          description: '32-byte sequence (0-31)',
        },
      ])('should encode $description as base64 string', ({ bytes, expectedBase64 }) => {
        const uint8Array = new Uint8Array(bytes)
        const encoded = bytesCodec.encode(uint8Array, 'json')
        expect(encoded).toBe(expectedBase64)
        expect(typeof encoded).toBe('string')
      })
    })

    describe('msgpack format', () => {
      test.each<{ bytes: number[]; description: string }>([
        { bytes: [72, 101, 108, 108, 111], description: '"Hello" in ASCII' },
        { bytes: [0, 1, 2, 3, 4], description: 'small byte sequence' },
        { bytes: [255, 254, 253, 252], description: 'high byte values' },
        { bytes: [0], description: 'single zero byte' },
        { bytes: [255], description: 'single max byte' },
        { bytes: Array.from({ length: 100 }, (_, i) => i % 256), description: '100-byte sequence' },
      ])('should encode $description as Uint8Array (pass-through)', ({ bytes }) => {
        const uint8Array = new Uint8Array(bytes)
        const encoded = bytesCodec.encode(uint8Array, 'msgpack')
        expect(encoded).toBeInstanceOf(Uint8Array)
        expect(encoded).toEqual(uint8Array)
        expect(encoded).toBe(uint8Array)
      })
    })
  })

  describe('encodeOptional', () => {
    describe('default values', () => {
      test.each<{ value: Uint8Array | undefined; description: string }>([
        { value: new Uint8Array(0), description: 'empty Uint8Array (default value)' },
        { value: new Uint8Array([]), description: 'empty Uint8Array literal' },
        { value: undefined, description: 'undefined' },
      ])('should omit $description when encoding', ({ value }) => {
        expect(bytesCodec.encodeOptional(value, 'json')).toBeUndefined()
        expect(bytesCodec.encodeOptional(value, 'msgpack')).toBeUndefined()
      })
    })

    describe('JSON format', () => {
      test.each<{ bytes: number[]; expectedBase64: string; description: string }>([
        { bytes: [72, 101, 108, 108, 111], expectedBase64: 'SGVsbG8=', description: '"Hello" in ASCII' },
        { bytes: [0, 1, 2, 3, 4], expectedBase64: 'AAECAwQ=', description: 'small byte sequence' },
        { bytes: [255, 254, 253, 252], expectedBase64: '//79/A==', description: 'high byte values' },
        { bytes: [0], expectedBase64: 'AA==', description: 'single zero byte' },
        { bytes: [255], expectedBase64: '/w==', description: 'single max byte' },
        {
          bytes: Array.from({ length: 32 }, (_, i) => i),
          expectedBase64: 'AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8=',
          description: '32-byte sequence (0-31)',
        },
      ])('should encode $description as base64 string', ({ bytes, expectedBase64 }) => {
        const uint8Array = new Uint8Array(bytes)
        const encoded = bytesCodec.encodeOptional(uint8Array, 'json')
        expect(encoded).toBe(expectedBase64)
        expect(typeof encoded).toBe('string')
      })
    })

    describe('msgpack format', () => {
      test.each<{ bytes: number[]; description: string }>([
        { bytes: [72, 101, 108, 108, 111], description: '"Hello" in ASCII' },
        { bytes: [0, 1, 2, 3, 4], description: 'small byte sequence' },
        { bytes: [255, 254, 253, 252], description: 'high byte values' },
        { bytes: [0], description: 'single zero byte' },
        { bytes: [255], description: 'single max byte' },
        { bytes: Array.from({ length: 100 }, (_, i) => i % 256), description: '100-byte sequence' },
      ])('should encode $description as Uint8Array (pass-through)', ({ bytes }) => {
        const uint8Array = new Uint8Array(bytes)
        const encoded = bytesCodec.encodeOptional(uint8Array, 'msgpack')
        expect(encoded).toBeInstanceOf(Uint8Array)
        expect(encoded).toEqual(uint8Array)
        expect(encoded).toBe(uint8Array)
      })
    })
  })

  describe('decode', () => {
    describe('default values', () => {
      test.each<{ value: Uint8Array | string | undefined; description: string }>([
        { value: new Uint8Array(0), description: 'empty Uint8Array' },
        { value: new Uint8Array([]), description: 'empty Uint8Array literal' },
        { value: '', description: 'empty string (decodes to empty bytes via base64)' },
        { value: undefined, description: 'undefined' },
      ])('should decode $description to empty Uint8Array', ({ value }) => {
        const decoded = bytesCodec.decode(value, 'json')
        expect(decoded).toBeInstanceOf(Uint8Array)
        expect(decoded.length).toBe(0)

        const decodedMsgpack = bytesCodec.decode(value, 'msgpack')
        expect(decodedMsgpack).toBeInstanceOf(Uint8Array)
        expect(decodedMsgpack.length).toBe(0)
      })
    })

    describe('from Uint8Array', () => {
      test.each<{ bytes: number[]; description: string }>([
        { bytes: [72, 101, 108, 108, 111], description: '"Hello" in ASCII' },
        { bytes: [0, 1, 2, 3, 4], description: 'small byte sequence' },
        { bytes: [255, 254, 253, 252], description: 'high byte values' },
        { bytes: [0], description: 'single zero byte' },
        { bytes: [255], description: 'single max byte' },
        { bytes: Array.from({ length: 32 }, (_, i) => i), description: '32-byte sequence' },
      ])('should decode Uint8Array $description', ({ bytes }) => {
        const uint8Array = new Uint8Array(bytes)
        const decoded = bytesCodec.decode(uint8Array, 'json')
        expect(decoded).toEqual(uint8Array)

        const decodedMsgpack = bytesCodec.decode(uint8Array, 'msgpack')
        expect(decodedMsgpack).toEqual(uint8Array)
      })
    })

    describe('from base64 string (JSON format)', () => {
      test.each<{ base64: string; expectedBytes: number[]; description: string }>([
        { base64: 'SGVsbG8=', expectedBytes: [72, 101, 108, 108, 111], description: '"Hello" in ASCII' },
        { base64: 'AAECAwQ=', expectedBytes: [0, 1, 2, 3, 4], description: 'small byte sequence' },
        { base64: '//79/A==', expectedBytes: [255, 254, 253, 252], description: 'high byte values' },
        { base64: 'AA==', expectedBytes: [0], description: 'single zero byte' },
        { base64: '/w==', expectedBytes: [255], description: 'single max byte' },
        {
          base64: 'AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8=',
          expectedBytes: Array.from({ length: 32 }, (_, i) => i),
          description: '32-byte sequence (0-31)',
        },
      ])('should decode base64 string $description', ({ base64, expectedBytes }) => {
        const decoded = bytesCodec.decode(base64, 'json')
        expect(decoded).toBeInstanceOf(Uint8Array)
        expect(Array.from(decoded)).toEqual(expectedBytes)

        const decodedMsgpack = bytesCodec.decode(base64, 'msgpack')
        expect(decodedMsgpack).toBeInstanceOf(Uint8Array)
        expect(Array.from(decodedMsgpack)).toEqual(expectedBytes)
      })
    })

    describe('format independence for Uint8Array input', () => {
      test.each<{ bytes: number[]; description: string }>([
        { bytes: [], description: 'empty bytes' },
        { bytes: [72, 101, 108, 108, 111], description: 'Hello bytes' },
        { bytes: [0, 1, 2, 3, 4], description: 'small byte sequence' },
      ])('should produce same result for JSON and msgpack when decoding Uint8Array $description', ({ bytes }) => {
        const uint8Array = new Uint8Array(bytes)
        const jsonResult = bytesCodec.decode(uint8Array, 'json')
        const msgpackResult = bytesCodec.decode(uint8Array, 'msgpack')
        expect(jsonResult).toEqual(msgpackResult)
      })
    })
  })

  describe('decodeOptional', () => {
    test.each<{ value: Uint8Array | null | undefined; description: string }>([
      { value: undefined, description: 'undefined' },
      { value: null, description: 'null' },
    ])('should decode $description to undefined', ({ value }) => {
      expect(bytesCodec.decodeOptional(value, 'json')).toBeUndefined()
      expect(bytesCodec.decodeOptional(value, 'msgpack')).toBeUndefined()
    })

    test.each<{ bytes: number[]; description: string }>([
      { bytes: [], description: 'empty Uint8Array' },
      { bytes: [72, 101, 108, 108, 111], description: 'Hello bytes' },
      { bytes: [0, 1, 2, 3, 4], description: 'small byte sequence' },
    ])('should decode Uint8Array $description', ({ bytes }) => {
      const uint8Array = new Uint8Array(bytes)
      const decoded = bytesCodec.decodeOptional(uint8Array, 'json')
      expect(decoded).toEqual(uint8Array)

      const decodedMsgpack = bytesCodec.decodeOptional(uint8Array, 'msgpack')
      expect(decodedMsgpack).toEqual(uint8Array)
    })

    test('should decode base64 string', () => {
      const base64 = 'SGVsbG8='
      const expectedBytes = new Uint8Array([72, 101, 108, 108, 111])
      expect(bytesCodec.decodeOptional(base64, 'json')).toEqual(expectedBytes)
      expect(bytesCodec.decodeOptional(base64, 'msgpack')).toEqual(expectedBytes)
    })
  })

  describe('error handling', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    test.each<{ value: any; description: string }>([
      { value: 123, description: 'number' },
      { value: true, description: 'boolean' },
      { value: {}, description: 'object' },
      { value: [], description: 'array' },
    ])('should throw error when decoding $description', ({ value }) => {
      expect(() => bytesCodec.decode(value, 'json')).toThrow('Cannot decode bytes from')
      expect(() => bytesCodec.decode(value, 'msgpack')).toThrow('Cannot decode bytes from')
    })
  })
})
