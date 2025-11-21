import { describe, expect, test } from 'vitest'
import { stringCodec } from './string'

describe('StringCodec', () => {
  describe('defaultValue', () => {
    test('should return empty string', () => {
      expect(stringCodec.defaultValue()).toBe('')
    })
  })

  describe('encode', () => {
    describe('default values', () => {
      test.each<{ value: string | undefined; description: string }>([
        { value: '', description: 'empty string (default value)' },
        { value: undefined, description: 'undefined' },
      ])('should omit $description when encoding', ({ value }) => {
        expect(stringCodec.encode(value, 'json')).toBeUndefined()
        expect(stringCodec.encode(value, 'msgpack')).toBeUndefined()
      })
    })

    describe('non-empty strings', () => {
      test.each<{ value: string; description: string }>([
        // Simple strings
        { value: 'a', description: 'single character' },
        { value: 'hello', description: 'simple word' },
        { value: 'Hello World', description: 'string with space' },
        { value: 'The quick brown fox jumps over the lazy dog', description: 'long sentence' },
        // Special characters
        { value: '!@#$%^&*()', description: 'special characters' },
        { value: 'line1\nline2', description: 'string with newline' },
        { value: 'tab\there', description: 'string with tab' },
        { value: '"quoted"', description: 'string with quotes' },
        { value: "it's", description: 'string with apostrophe' },
        { value: '\\backslash\\', description: 'string with backslashes' },
        // Unicode
        { value: 'café', description: 'string with accents' },
        { value: '你好', description: 'Chinese characters' },
        { value: '🎉🎊', description: 'emojis' },
        { value: 'Ω≈ç√', description: 'mathematical symbols' },
        // Whitespace
        { value: ' ', description: 'single space' },
        { value: '  ', description: 'multiple spaces' },
        { value: '\t', description: 'tab character' },
        { value: '\n', description: 'newline character' },
        // Numbers as strings
        { value: '0', description: 'zero as string' },
        { value: '123', description: 'number as string' },
        { value: '3.14', description: 'decimal as string' },
      ])('should encode $description', ({ value }) => {
        expect(stringCodec.encode(value, 'json')).toBe(value)
        expect(stringCodec.encode(value, 'msgpack')).toBe(value)
      })
    })

    describe('format independence', () => {
      test.each<{ value: string | undefined; description: string }>([
        { value: undefined, description: 'undefined' },
        { value: '', description: 'empty string' },
        { value: 'hello', description: 'simple string' },
        { value: 'Hello World', description: 'string with space' },
        { value: '你好', description: 'Unicode string' },
        { value: '🎉', description: 'emoji' },
      ])('should produce same result for JSON and msgpack when encoding $description', ({ value }) => {
        expect(stringCodec.encode(value, 'json')).toBe(stringCodec.encode(value, 'msgpack'))
      })
    })
  })

  describe('decode', () => {
    describe('default values', () => {
      test.each<{ value: string | Uint8Array | undefined; description: string }>([
        { value: '', description: 'empty string (default value)' },
        { value: undefined, description: 'undefined' },
        { value: new Uint8Array(), description: 'empty bytes' },
      ])('should decode $description to empty string', ({ value }) => {
        expect(stringCodec.decode(value, 'json')).toBe('')
        expect(stringCodec.decode(value, 'msgpack')).toBe('')
      })
    })

    describe('non-empty strings', () => {
      test.each<{ value: string; description: string }>([
        // Simple strings
        { value: 'a', description: 'single character' },
        { value: 'hello', description: 'simple word' },
        { value: 'Hello World', description: 'string with space' },
        { value: 'The quick brown fox jumps over the lazy dog', description: 'long sentence' },
        // Special characters
        { value: '!@#$%^&*()', description: 'special characters' },
        { value: 'line1\nline2', description: 'string with newline' },
        { value: 'tab\there', description: 'string with tab' },
        { value: '"quoted"', description: 'string with quotes' },
        // Unicode
        { value: 'café', description: 'string with accents' },
        { value: '你好', description: 'Chinese characters' },
        { value: '🎉🎊', description: 'emojis' },
      ])('should decode $description', ({ value }) => {
        expect(stringCodec.decode(value, 'json')).toBe(value)
        expect(stringCodec.decode(value, 'msgpack')).toBe(value)
      })
    })

    describe('Uint8Array decoding (msgpack)', () => {
      test.each<{ bytes: number[]; expected: string; description: string }>([
        // ASCII strings
        { bytes: [104, 101, 108, 108, 111], expected: 'hello', description: 'simple ASCII string' },
        { bytes: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100], expected: 'Hello World', description: 'ASCII with space' },
        { bytes: [97], expected: 'a', description: 'single character' },
        // UTF-8 encoded strings
        { bytes: [99, 97, 102, 195, 169], expected: 'café', description: 'UTF-8 with accents' },
        { bytes: [228, 189, 160, 229, 165, 189], expected: '你好', description: 'UTF-8 Chinese characters' },
        { bytes: [240, 159, 142, 137], expected: '🎉', description: 'UTF-8 emoji' },
        // Special characters
        { bytes: [33, 64, 35], expected: '!@#', description: 'special characters' },
        { bytes: [10], expected: '\n', description: 'newline' },
        { bytes: [9], expected: '\t', description: 'tab' },
        // Empty
        { bytes: [], expected: '', description: 'empty bytes' },
      ])('should decode Uint8Array to $description', ({ bytes, expected }) => {
        const uint8Array = new Uint8Array(bytes)
        expect(stringCodec.decode(uint8Array, 'msgpack')).toBe(expected)
        // JSON format should also handle Uint8Array (though less common)
        expect(stringCodec.decode(uint8Array, 'json')).toBe(expected)
      })
    })

    test('should handle Uint8Array with invalid UTF-8 sequences gracefully', () => {
      // Invalid UTF-8: byte 0xFF is not valid UTF-8 start byte
      const invalidUtf8 = new Uint8Array([0xff, 0xfe])
      // Buffer.from().toString('utf-8') replaces invalid sequences with replacement character
      const decoded = stringCodec.decode(invalidUtf8, 'msgpack')
      expect(decoded).toBeDefined()
      expect(typeof decoded).toBe('string')
    })

    describe('format independence', () => {
      test.each<{ value: string | undefined; description: string }>([
        { value: undefined, description: 'undefined' },
        { value: '', description: 'empty string' },
        { value: 'hello', description: 'simple string' },
        { value: 'Hello World', description: 'string with space' },
        { value: '你好', description: 'Unicode string' },
      ])('should produce same result for JSON and msgpack when decoding $description', ({ value }) => {
        expect(stringCodec.decode(value, 'json')).toBe(stringCodec.decode(value, 'msgpack'))
      })
    })
  })

  describe('decodeOptional', () => {
    test('should preserve undefined', () => {
      expect(stringCodec.decodeOptional(undefined, 'json')).toBeUndefined()
      expect(stringCodec.decodeOptional(undefined, 'msgpack')).toBeUndefined()
    })

    test.each<{ value: string; description: string }>([
      { value: '', description: 'empty string (not undefined)' },
      { value: 'hello', description: 'simple string' },
      { value: 'Hello World', description: 'string with space' },
      { value: '你好', description: 'Unicode string' },
    ])('should decode $description', ({ value }) => {
      expect(stringCodec.decodeOptional(value, 'json')).toBe(value)
      expect(stringCodec.decodeOptional(value, 'msgpack')).toBe(value)
    })

    test('should decode Uint8Array in optional mode', () => {
      const bytes = new Uint8Array([104, 101, 108, 108, 111]) // 'hello'
      expect(stringCodec.decodeOptional(bytes, 'msgpack')).toBe('hello')
    })
  })
})
