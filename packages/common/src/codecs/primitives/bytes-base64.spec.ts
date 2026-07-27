import { describe, expect, test } from 'vitest'
import { bytesBase64Codec } from './bytes-base64'

describe('BytesBase64Codec', () => {
  describe('defaultValue', () => {
    test('should return empty Uint8Array', () => {
      const defaultVal = bytesBase64Codec.defaultValue()
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
      ])('should encode $description to empty base64 string', ({ value }) => {
        const encodedJson = bytesBase64Codec.encode(value, 'json')
        expect(encodedJson).toBe('')

        const encodedMsgpack = bytesBase64Codec.encode(value, 'msgpack')
        expect(encodedMsgpack).toBe('')
      })
    })

    describe('non default values', () => {
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
        const encodedJson = bytesBase64Codec.encode(uint8Array, 'json')
        const encodedMsgpack = bytesBase64Codec.encode(uint8Array, 'msgpack')

        expect(typeof encodedJson).toBe('string')
        expect(encodedJson).toBe(expectedBase64)
        expect(typeof encodedMsgpack).toBe('string')
        expect(encodedMsgpack).toBe(expectedBase64)
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
        expect(bytesBase64Codec.encodeOptional(value, 'json')).toBeUndefined()
        expect(bytesBase64Codec.encodeOptional(value, 'msgpack')).toBeUndefined()
      })
    })

    describe('non default values', () => {
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
        const encodedJson = bytesBase64Codec.encodeOptional(uint8Array, 'json')
        const encodedMsgpack = bytesBase64Codec.encodeOptional(uint8Array, 'msgpack')

        expect(typeof encodedJson).toBe('string')
        expect(encodedJson).toBe(expectedBase64)
        expect(typeof encodedMsgpack).toBe('string')
        expect(encodedMsgpack).toBe(expectedBase64)
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
        const decoded = bytesBase64Codec.decode(value, 'json')
        expect(decoded).toBeInstanceOf(Uint8Array)
        expect(decoded.length).toBe(0)

        const decodedMsgpack = bytesBase64Codec.decode(value, 'msgpack')
        expect(decodedMsgpack).toBeInstanceOf(Uint8Array)
        expect(decodedMsgpack.length).toBe(0)
      })
    })

    describe('from Uint8Array containing base64 encoded string bytes', () => {
      test.each<{ base64: string; expectedBytes: number[]; description: string }>([
        { base64: 'SGVsbG8=', expectedBytes: [72, 101, 108, 108, 111], description: '"Hello" in ASCII' },
        { base64: 'AAECAwQ=', expectedBytes: [0, 1, 2, 3, 4], description: 'small byte sequence' },
        { base64: '//79/A==', expectedBytes: [255, 254, 253, 252], description: 'high byte values' },
        { base64: 'AA==', expectedBytes: [0], description: 'single zero byte' },
        { base64: '/w==', expectedBytes: [255], description: 'single max byte' },
        {
          base64: 'AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8=',
          expectedBytes: Array.from({ length: 32 }, (_, i) => i),
          description: '32-byte sequence',
        },
      ])('should decode Uint8Array containing base64 string for $description', ({ base64, expectedBytes }) => {
        // Convert base64 string to Uint8Array (as if from msgpack wire format)
        const uint8Array = new Uint8Array(Buffer.from(base64, 'utf-8'))
        const decoded = bytesBase64Codec.decode(uint8Array, 'json')
        expect(decoded).toBeInstanceOf(Uint8Array)
        expect(Array.from(decoded)).toEqual(expectedBytes)

        const decodedMsgpack = bytesBase64Codec.decode(uint8Array, 'msgpack')
        expect(decodedMsgpack).toBeInstanceOf(Uint8Array)
        expect(Array.from(decodedMsgpack)).toEqual(expectedBytes)
      })
    })

    describe('from base64 string', () => {
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
        const decoded = bytesBase64Codec.decode(base64, 'json')
        expect(decoded).toBeInstanceOf(Uint8Array)
        expect(Array.from(decoded)).toEqual(expectedBytes)

        const decodedMsgpack = bytesBase64Codec.decode(base64, 'msgpack')
        expect(decodedMsgpack).toBeInstanceOf(Uint8Array)
        expect(Array.from(decodedMsgpack)).toEqual(expectedBytes)
      })
    })

    describe('format independence', () => {
      test.each<{ base64: string; description: string }>([
        { base64: '', description: 'empty string' },
        { base64: 'SGVsbG8=', description: 'Hello base64' },
        { base64: 'AAECAwQ=', description: 'small byte sequence base64' },
      ])('should produce same result for JSON and msgpack when decoding string $description', ({ base64 }) => {
        const jsonResult = bytesBase64Codec.decode(base64, 'json')
        const msgpackResult = bytesBase64Codec.decode(base64, 'msgpack')
        expect(jsonResult).toEqual(msgpackResult)
      })
    })
  })

  describe('decodeOptional', () => {
    test.each<{ value: Uint8Array | null | undefined; description: string }>([
      { value: undefined, description: 'undefined' },
      { value: null, description: 'null' },
    ])('should decode $description to undefined', ({ value }) => {
      expect(bytesBase64Codec.decodeOptional(value, 'json')).toBeUndefined()
      expect(bytesBase64Codec.decodeOptional(value, 'msgpack')).toBeUndefined()
    })

    test('should decode empty Uint8Array', () => {
      const uint8Array = new Uint8Array([])
      const decoded = bytesBase64Codec.decodeOptional(uint8Array, 'json')
      expect(decoded).toBeInstanceOf(Uint8Array)
      expect(decoded!.length).toBe(0)

      const decodedMsgpack = bytesBase64Codec.decodeOptional(uint8Array, 'msgpack')
      expect(decodedMsgpack).toBeInstanceOf(Uint8Array)
      expect(decodedMsgpack!.length).toBe(0)
    })

    test('should decode base64 string', () => {
      const base64 = 'SGVsbG8='
      const expectedBytes = new Uint8Array([72, 101, 108, 108, 111])
      expect(bytesBase64Codec.decodeOptional(base64, 'json')).toEqual(expectedBytes)
      expect(bytesBase64Codec.decodeOptional(base64, 'msgpack')).toEqual(expectedBytes)
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
      expect(() => bytesBase64Codec.decode(value, 'json')).toThrow('Cannot decode bytes from')
      expect(() => bytesBase64Codec.decode(value, 'msgpack')).toThrow('Cannot decode bytes from')
    })
  })

  describe('roundtrip', () => {
    test.each<{ bytes: number[]; description: string }>([
      { bytes: [], description: 'empty bytes' },
      { bytes: [72, 101, 108, 108, 111], description: 'Hello bytes' },
      { bytes: [0, 1, 2, 3, 4], description: 'small byte sequence' },
      { bytes: [255, 254, 253, 252], description: 'high byte values' },
      { bytes: Array.from({ length: 100 }, (_, i) => i % 256), description: '100-byte sequence' },
    ])('should roundtrip $description through encode/decode', ({ bytes }) => {
      const original = new Uint8Array(bytes)

      // JSON roundtrip
      const encodedJson = bytesBase64Codec.encode(original, 'json')
      const decodedJson = bytesBase64Codec.decode(encodedJson, 'json')
      expect(Array.from(decodedJson)).toEqual(bytes)

      // msgpack roundtrip
      const encodedMsgpack = bytesBase64Codec.encode(original, 'msgpack')
      const decodedMsgpack = bytesBase64Codec.decode(encodedMsgpack, 'msgpack')
      expect(Array.from(decodedMsgpack)).toEqual(bytes)
    })
  })
})
