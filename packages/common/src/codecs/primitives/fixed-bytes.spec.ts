import { describe, expect, test } from 'vitest'
import { FixedBytesCodec, fixedBytes1793Codec, fixedBytes32Codec, fixedBytes64Codec } from './fixed-bytes'

describe('FixedBytesCodec', () => {
  describe('constructor and defaultValue', () => {
    test('should create codec with specified length', () => {
      const codec16 = new FixedBytesCodec(16)
      const defaultVal = codec16.defaultValue()
      expect(defaultVal).toBeInstanceOf(Uint8Array)
      expect(defaultVal.length).toBe(16)
      expect(Array.from(defaultVal)).toEqual(Array(16).fill(0))
    })

    test('should create codec with length 32', () => {
      const codec32 = new FixedBytesCodec(32)
      const defaultVal = codec32.defaultValue()
      expect(defaultVal.length).toBe(32)
      expect(Array.from(defaultVal)).toEqual(Array(32).fill(0))
    })

    test('should create codec with length 64', () => {
      const codec64 = new FixedBytesCodec(64)
      const defaultVal = codec64.defaultValue()
      expect(defaultVal.length).toBe(64)
      expect(Array.from(defaultVal)).toEqual(Array(64).fill(0))
    })
  })

  describe('pre-defined codecs', () => {
    test('fixedBytes32Codec should have 32-byte default', () => {
      const defaultVal = fixedBytes32Codec.defaultValue()
      expect(defaultVal.length).toBe(32)
      expect(Array.from(defaultVal)).toEqual(Array(32).fill(0))
    })

    test('fixedBytes64Codec should have 64-byte default', () => {
      const defaultVal = fixedBytes64Codec.defaultValue()
      expect(defaultVal.length).toBe(64)
      expect(Array.from(defaultVal)).toEqual(Array(64).fill(0))
    })

    test('fixedBytes1793Codec should have 1793-byte default (Falcon signature)', () => {
      const defaultVal = fixedBytes1793Codec.defaultValue()
      expect(defaultVal.length).toBe(1793)
      expect(Array.from(defaultVal)).toEqual(Array(1793).fill(0))
    })
  })

  describe('encode', () => {
    const codec32 = new FixedBytesCodec(32)

    describe('default values', () => {
      test.each<{ value: Uint8Array | undefined; description: string }>([
        { value: new Uint8Array(32), description: 'all-zero Uint8Array (default value)' },
        { value: undefined, description: 'undefined' },
      ])('should omit $description when encoding', ({ value }) => {
        expect(codec32.encode(value, 'json')).toBeUndefined()
        expect(codec32.encode(value, 'msgpack')).toBeUndefined()
      })
    })

    describe('JSON format', () => {
      test('should encode non-zero 32-byte array as base64 string', () => {
        const bytes = new Uint8Array(32)
        bytes[0] = 1
        bytes[31] = 255
        const encoded = codec32.encode(bytes, 'json')
        expect(typeof encoded).toBe('string')
        // Verify it's base64 encoded
        expect(encoded).toMatch(/^[A-Za-z0-9+/]+=*$/)
      })

      test('should encode sequence 0-31 as base64', () => {
        const bytes = new Uint8Array(Array.from({ length: 32 }, (_, i) => i))
        const encoded = codec32.encode(bytes, 'json')
        expect(encoded).toBe('AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8=')
      })
    })

    describe('msgpack format', () => {
      test('should encode as Uint8Array (pass-through)', () => {
        const bytes = new Uint8Array(32)
        bytes[0] = 1
        bytes[31] = 255
        const encoded = codec32.encode(bytes, 'msgpack')
        expect(encoded).toBeInstanceOf(Uint8Array)
        expect(encoded).toBe(bytes)
      })
    })
  })

  describe('decode', () => {
    const codec32 = new FixedBytesCodec(32)

    describe('default values', () => {
      test.each<{ value: Uint8Array | string | undefined; description: string }>([
        { value: new Uint8Array(32), description: 'all-zero 32-byte array' },
        { value: undefined, description: 'undefined' },
      ])('should decode $description to all-zero Uint8Array', ({ value }) => {
        const decoded = codec32.decode(value, 'json')
        expect(decoded).toBeInstanceOf(Uint8Array)
        expect(decoded.length).toBe(32)
        expect(Array.from(decoded)).toEqual(Array(32).fill(0))

        const decodedMsgpack = codec32.decode(value, 'msgpack')
        expect(decodedMsgpack).toBeInstanceOf(Uint8Array)
        expect(decodedMsgpack.length).toBe(32)
      })
    })

    describe('from Uint8Array', () => {
      test('should decode 32-byte array with non-zero values', () => {
        const bytes = new Uint8Array(32)
        bytes[0] = 1
        bytes[15] = 128
        bytes[31] = 255

        const decoded = codec32.decode(bytes, 'json')
        expect(decoded).toEqual(bytes)

        const decodedMsgpack = codec32.decode(bytes, 'msgpack')
        expect(decodedMsgpack).toEqual(bytes)
      })

      test('should decode sequence 0-31', () => {
        const bytes = new Uint8Array(Array.from({ length: 32 }, (_, i) => i))
        const decoded = codec32.decode(bytes, 'msgpack')
        expect(Array.from(decoded)).toEqual(Array.from({ length: 32 }, (_, i) => i))
      })
    })

    describe('from base64 string (JSON format)', () => {
      test('should decode base64 string to 32-byte array', () => {
        const base64 = 'AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8='
        const decoded = codec32.decode(base64, 'json')
        expect(decoded).toBeInstanceOf(Uint8Array)
        expect(decoded.length).toBe(32)
        expect(Array.from(decoded)).toEqual(Array.from({ length: 32 }, (_, i) => i))
      })

      test('should decode base64 with non-zero values', () => {
        const bytes = new Uint8Array(32)
        bytes[0] = 255
        bytes[31] = 1
        // First encode to get the base64 representation
        const base64 = codec32.encode(bytes, 'json') as string

        // Then decode back
        const decoded = codec32.decode(base64, 'json')
        expect(Array.from(decoded)).toEqual(Array.from(bytes))
      })
    })

    describe('format independence for Uint8Array input', () => {
      test('should produce same result for JSON and msgpack when decoding Uint8Array', () => {
        const bytes = new Uint8Array(Array.from({ length: 32 }, (_, i) => i))
        const jsonResult = codec32.decode(bytes, 'json')
        const msgpackResult = codec32.decode(bytes, 'msgpack')
        expect(jsonResult).toEqual(msgpackResult)
      })
    })
  })

  describe('decodeOptional', () => {
    const codec32 = new FixedBytesCodec(32)

    test('should preserve undefined', () => {
      expect(codec32.decodeOptional(undefined, 'json')).toBeUndefined()
      expect(codec32.decodeOptional(undefined, 'msgpack')).toBeUndefined()
    })

    test('should decode all-zero array (not undefined)', () => {
      const zeros = new Uint8Array(32)
      const decoded = codec32.decodeOptional(zeros, 'json')
      expect(decoded).toEqual(zeros)
    })

    test('should decode non-zero array', () => {
      const bytes = new Uint8Array(32)
      bytes[0] = 1
      const decoded = codec32.decodeOptional(bytes, 'msgpack')
      expect(decoded).toEqual(bytes)
    })

    test('should decode base64 string', () => {
      const base64 = 'AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8='
      const decoded = codec32.decodeOptional(base64, 'json')
      expect(decoded).toBeInstanceOf(Uint8Array)
      expect(decoded?.length).toBe(32)
    })
  })

  describe('error handling', () => {
    const codec32 = new FixedBytesCodec(32)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    test.each<{ value: any; description: string }>([
      { value: null, description: 'null' },
      { value: 123, description: 'number' },
      { value: true, description: 'boolean' },
      { value: {}, description: 'object' },
      { value: [], description: 'array' },
    ])('should throw error when decoding $description', ({ value }) => {
      expect(() => codec32.decode(value, 'json')).toThrow('Cannot decode fixed 32 bytes from')
      expect(() => codec32.decode(value, 'msgpack')).toThrow('Cannot decode fixed 32 bytes from')
    })
  })
})
