import { describe, expect, test } from 'vitest'
import { numberCodec } from '../primitives/number'
import { stringCodec } from '../primitives/string'
import { PrimitiveModelCodec } from './primitive-model'

describe('PrimitiveModelCodec', () => {
  describe('with number codec', () => {
    const codec = new PrimitiveModelCodec({
      name: 'NumberModel',
      kind: 'primitive',
      codec: numberCodec,
    })

    describe('defaultValue', () => {
      test('should return default value from inner codec', () => {
        expect(codec.defaultValue()).toBe(0)
      })
    })

    describe('encode', () => {
      describe('default values', () => {
        test.each<{ value: number | undefined | null; description: string }>([
          { value: 0, description: '0 (default value)' },
          { value: undefined, description: 'undefined' },
          { value: null, description: 'null' },
        ])('should encode $description to undefined', ({ value }) => {
          expect(codec.encode(value, 'json')).toBeUndefined()
          expect(codec.encode(value, 'msgpack')).toBeUndefined()
        })
      })

      describe('non-zero values', () => {
        test.each<{ value: number; description: string }>([
          { value: 1, description: 'small positive (1)' },
          { value: 123, description: 'positive number (123)' },
          { value: 456, description: 'positive number (456)' },
          { value: -1, description: 'small negative (-1)' },
          { value: -42, description: 'negative number (-42)' },
        ])('should encode $description', ({ value }) => {
          expect(codec.encode(value, 'json')).toBe(value)
          expect(codec.encode(value, 'msgpack')).toBe(value)
        })
      })

      describe('format independence', () => {
        test.each<{ value: number | undefined | null; description: string }>([
          { value: undefined, description: 'undefined' },
          { value: null, description: 'null' },
          { value: 0, description: '0' },
          { value: 123, description: '123' },
          { value: -42, description: '-42' },
        ])('should produce same result for JSON and msgpack when encoding $description', ({ value }) => {
          expect(codec.encode(value, 'json')).toBe(codec.encode(value, 'msgpack'))
        })
      })
    })

    describe('encodeOptional', () => {
      describe('default values', () => {
        test.each<{ value: number | undefined | null; description: string }>([
          { value: 0, description: '0 (default value)' },
          { value: undefined, description: 'undefined' },
          { value: null, description: 'null' },
        ])('should omit $description when encoding', ({ value }) => {
          expect(codec.encodeOptional(value, 'json')).toBeUndefined()
          expect(codec.encodeOptional(value, 'msgpack')).toBeUndefined()
        })
      })

      describe('non-zero values', () => {
        test.each<{ value: number; description: string }>([
          { value: 1, description: 'small positive (1)' },
          { value: 42, description: 'positive number (42)' },
          { value: 789, description: 'positive number (789)' },
          { value: -1, description: 'small negative (-1)' },
          { value: -99, description: 'negative number (-99)' },
        ])('should encode $description', ({ value }) => {
          expect(codec.encodeOptional(value, 'json')).toBe(value)
          expect(codec.encodeOptional(value, 'msgpack')).toBe(value)
        })
      })

      describe('format independence', () => {
        test.each<{ value: number | undefined | null; description: string }>([
          { value: undefined, description: 'undefined' },
          { value: null, description: 'null' },
          { value: 0, description: '0' },
          { value: 42, description: '42' },
          { value: -42, description: '-42' },
        ])('should produce same result for JSON and msgpack when encoding $description', ({ value }) => {
          expect(codec.encodeOptional(value, 'json')).toBe(codec.encodeOptional(value, 'msgpack'))
        })
      })
    })

    describe('decode', () => {
      describe('default values', () => {
        test.each<{ value: number | undefined | null; description: string }>([
          { value: 0, description: '0 (default value)' },
          { value: undefined, description: 'undefined' },
          { value: null, description: 'null' },
        ])('should decode $description to default value', ({ value }) => {
          expect(codec.decode(value, 'json')).toBe(0)
          expect(codec.decode(value, 'msgpack')).toBe(0)
        })
      })

      describe('non-zero values', () => {
        test.each<{ value: number; description: string }>([
          { value: 1, description: 'small positive (1)' },
          { value: 789, description: 'positive number (789)' },
          { value: 321, description: 'positive number (321)' },
          { value: -1, description: 'small negative (-1)' },
          { value: -100, description: 'negative number (-100)' },
        ])('should decode $description', ({ value }) => {
          expect(codec.decode(value, 'json')).toBe(value)
          expect(codec.decode(value, 'msgpack')).toBe(value)
        })
      })

      describe('format independence', () => {
        test.each<{ value: number | undefined | null; description: string }>([
          { value: undefined, description: 'undefined' },
          { value: null, description: 'null' },
          { value: 0, description: '0' },
          { value: 789, description: '789' },
          { value: -42, description: '-42' },
        ])('should produce same result for JSON and msgpack when decoding $description', ({ value }) => {
          expect(codec.decode(value, 'json')).toBe(codec.decode(value, 'msgpack'))
        })
      })
    })

    describe('decodeOptional', () => {
      describe('default values', () => {
        test.each<{ value: undefined | null; description: string }>([
          { value: undefined, description: 'undefined' },
          { value: null, description: 'null' },
        ])('should decode $description to undefined', ({ value }) => {
          expect(codec.decodeOptional(value, 'json')).toBeUndefined()
          expect(codec.decodeOptional(value, 'msgpack')).toBeUndefined()
        })
      })

      describe('non-zero values', () => {
        test.each<{ value: number; description: string }>([
          { value: 1, description: 'small positive (1)' },
          { value: 999, description: 'positive number (999)' },
          { value: -1, description: 'small negative (-1)' },
        ])('should decode $description', ({ value }) => {
          expect(codec.decodeOptional(value, 'json')).toBe(value)
          expect(codec.decodeOptional(value, 'msgpack')).toBe(value)
        })
      })

      describe('format independence', () => {
        test.each<{ value: number | undefined | null; description: string }>([
          { value: undefined, description: 'undefined' },
          { value: null, description: 'null' },
          { value: 999, description: '999' },
          { value: -42, description: '-42' },
        ])('should produce same result for JSON and msgpack when decoding $description', ({ value }) => {
          expect(codec.decodeOptional(value, 'json')).toBe(codec.decodeOptional(value, 'msgpack'))
        })
      })
    })
  })

  describe('with string codec', () => {
    const codec = new PrimitiveModelCodec({
      name: 'StringModel',
      kind: 'primitive',
      codec: stringCodec,
    })

    describe('defaultValue', () => {
      test('should return default value from inner codec', () => {
        expect(codec.defaultValue()).toBe('')
      })
    })

    describe('encode', () => {
      describe('default values', () => {
        test.each<{ value: string | undefined | null; description: string }>([
          { value: '', description: 'empty string (default value)' },
          { value: undefined, description: 'undefined' },
          { value: null, description: 'null' },
        ])('should encode $description to undefined', ({ value }) => {
          expect(codec.encode(value, 'json')).toBeUndefined()
          expect(codec.encode(value, 'msgpack')).toBeUndefined()
        })
      })

      describe('non-empty strings', () => {
        test.each<{ value: string; description: string }>([
          { value: 'world', description: 'simple word' },
          { value: 'test', description: 'another word' },
          { value: 'Hello World', description: 'string with space' },
        ])('should encode $description', ({ value }) => {
          expect(codec.encode(value, 'json')).toBe(value)
          expect(codec.encode(value, 'msgpack')).toBe(value)
        })
      })

      describe('format independence', () => {
        test.each<{ value: string | undefined | null; description: string }>([
          { value: undefined, description: 'undefined' },
          { value: null, description: 'null' },
          { value: '', description: 'empty string' },
          { value: 'world', description: 'simple string' },
        ])('should produce same result for JSON and msgpack when encoding $description', ({ value }) => {
          expect(codec.encode(value, 'json')).toBe(codec.encode(value, 'msgpack'))
        })
      })
    })

    describe('encodeOptional', () => {
      describe('default values', () => {
        test.each<{ value: string | undefined | null; description: string }>([
          { value: '', description: 'empty string (default value)' },
          { value: undefined, description: 'undefined' },
          { value: null, description: 'null' },
        ])('should omit $description when encoding', ({ value }) => {
          expect(codec.encodeOptional(value, 'json')).toBeUndefined()
          expect(codec.encodeOptional(value, 'msgpack')).toBeUndefined()
        })
      })

      describe('non-empty strings', () => {
        test.each<{ value: string; description: string }>([
          { value: 'hello', description: 'simple word' },
          { value: 'test', description: 'another word' },
        ])('should encode $description', ({ value }) => {
          expect(codec.encodeOptional(value, 'json')).toBe(value)
          expect(codec.encodeOptional(value, 'msgpack')).toBe(value)
        })
      })

      describe('format independence', () => {
        test.each<{ value: string | undefined | null; description: string }>([
          { value: undefined, description: 'undefined' },
          { value: null, description: 'null' },
          { value: '', description: 'empty string' },
          { value: 'hello', description: 'simple string' },
        ])('should produce same result for JSON and msgpack when encoding $description', ({ value }) => {
          expect(codec.encodeOptional(value, 'json')).toBe(codec.encodeOptional(value, 'msgpack'))
        })
      })
    })

    describe('decode', () => {
      describe('default values', () => {
        test.each<{ value: string | undefined | null; description: string }>([
          { value: '', description: 'empty string (default value)' },
          { value: undefined, description: 'undefined' },
          { value: null, description: 'null' },
        ])('should decode $description to empty string', ({ value }) => {
          expect(codec.decode(value, 'json')).toBe('')
          expect(codec.decode(value, 'msgpack')).toBe('')
        })
      })

      describe('non-empty strings', () => {
        test.each<{ value: string; description: string }>([
          { value: 'decoded', description: 'simple word' },
          { value: 'test', description: 'another word' },
        ])('should decode $description', ({ value }) => {
          expect(codec.decode(value, 'json')).toBe(value)
          expect(codec.decode(value, 'msgpack')).toBe(value)
        })
      })

      describe('format independence', () => {
        test.each<{ value: string | undefined | null; description: string }>([
          { value: undefined, description: 'undefined' },
          { value: null, description: 'null' },
          { value: '', description: 'empty string' },
          { value: 'decoded', description: 'simple string' },
        ])('should produce same result for JSON and msgpack when decoding $description', ({ value }) => {
          expect(codec.decode(value, 'json')).toBe(codec.decode(value, 'msgpack'))
        })
      })
    })

    describe('decodeOptional', () => {
      describe('default values', () => {
        test.each<{ value: undefined | null; description: string }>([
          { value: undefined, description: 'undefined' },
          { value: null, description: 'null' },
        ])('should decode $description to undefined', ({ value }) => {
          expect(codec.decodeOptional(value, 'json')).toBeUndefined()
          expect(codec.decodeOptional(value, 'msgpack')).toBeUndefined()
        })
      })

      describe('non-empty strings', () => {
        test.each<{ value: string; description: string }>([{ value: 'test', description: 'simple word' }])(
          'should decode $description',
          ({ value }) => {
            expect(codec.decodeOptional(value, 'json')).toBe(value)
            expect(codec.decodeOptional(value, 'msgpack')).toBe(value)
          },
        )
      })

      describe('format independence', () => {
        test.each<{ value: string | undefined | null; description: string }>([
          { value: undefined, description: 'undefined' },
          { value: null, description: 'null' },
          { value: 'test', description: 'simple string' },
        ])('should produce same result for JSON and msgpack when decoding $description', ({ value }) => {
          expect(codec.decodeOptional(value, 'json')).toBe(codec.decodeOptional(value, 'msgpack'))
        })
      })
    })
  })
})
