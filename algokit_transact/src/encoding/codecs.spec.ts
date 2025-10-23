import { describe, expect, test } from 'vitest'
import { PUBLIC_KEY_BYTE_LENGTH, ZERO_ADDRESS } from '@algorandfoundation/algokit-common'
import { addressCodec, bigIntCodec, booleanCodec, bytesCodec, numberCodec, OmitEmptyObjectCodec, stringCodec } from './codecs'

describe('Codecs', () => {
  describe('AddressCodec', () => {
    describe('zero address handling', () => {
      test('should have zero address as default value', () => {
        const defaultValue = addressCodec.defaultValue()
        expect(defaultValue).toEqual(new Uint8Array(PUBLIC_KEY_BYTE_LENGTH))
      })

      test('should omit undefined address when encoding', () => {
        const encoded = addressCodec.encode(undefined)
        expect(encoded).toBeUndefined()
      })

      test('should omit zero address when encoding', () => {
        const encoded = addressCodec.encode(ZERO_ADDRESS)
        expect(encoded).toBeUndefined()
      })

      test('should not omit non-zero address when encoding', () => {
        const nonZeroAddress = 'VCMJKWOY5P5P7SKMZFFOCEROPJCZOTIJMNIYNUCKH7LRO45JMJP6UYBIJA'
        const encoded = addressCodec.encode(nonZeroAddress)
        expect(encoded).toMatchInlineSnapshot(`
          Uint8Array [
            168,
            152,
            149,
            89,
            216,
            235,
            250,
            255,
            201,
            76,
            201,
            74,
            225,
            18,
            46,
            122,
            69,
            151,
            77,
            9,
            99,
            81,
            134,
            208,
            74,
            63,
            215,
            23,
            115,
            169,
            98,
            95,
          ]
        `)
      })

      test('should correctly decode undefined', () => {
        const decoded = addressCodec.decode(undefined)
        const optionallyDecoded = addressCodec.decodeOptional(undefined)

        expect(decoded).toBe(ZERO_ADDRESS)
        expect(optionallyDecoded).toBe(undefined)
      })

      test('should correctly decode zero address', () => {
        const decoded = addressCodec.decode(new Uint8Array(PUBLIC_KEY_BYTE_LENGTH))
        const optionallyDecoded = addressCodec.decodeOptional(new Uint8Array(PUBLIC_KEY_BYTE_LENGTH))

        expect(decoded).toBe(ZERO_ADDRESS)
        expect(optionallyDecoded).toBe(ZERO_ADDRESS)
      })

      test('should correctly decode non-zero address', () => {
        const nonZeroAddress = 'VCMJKWOY5P5P7SKMZFFOCEROPJCZOTIJMNIYNUCKH7LRO45JMJP6UYBIJA'
        const encoded = addressCodec.encode(nonZeroAddress)

        const decoded = addressCodec.decode(encoded)
        const optionallyDecoded = addressCodec.decodeOptional(encoded)

        expect(decoded).toBe(nonZeroAddress)
        expect(optionallyDecoded).toBe(nonZeroAddress)
      })
    })
  })

  describe('NumberCodec', () => {
    test('should have 0 as default value', () => {
      expect(numberCodec.defaultValue()).toBe(0)
    })

    test('should omit default value when encoding', () => {
      expect(numberCodec.encode(0)).toBeUndefined()
      expect(numberCodec.encode(42)).toBe(42)
    })

    test('should decode undefined to default value', () => {
      expect(numberCodec.decode(undefined)).toBe(0)
      expect(numberCodec.decode(0)).toBe(0)
      expect(numberCodec.decode(42)).toBe(42)
    })

    test('should handle optional decoding', () => {
      expect(numberCodec.decodeOptional(undefined)).toBeUndefined()
      expect(numberCodec.decodeOptional(0)).toBe(0)
      expect(numberCodec.decodeOptional(42)).toBe(42)
    })
  })

  describe('BigIntCodec', () => {
    test('should have 0n as default value', () => {
      expect(bigIntCodec.defaultValue()).toBe(0n)
    })

    test('should omit default value when encoding', () => {
      expect(bigIntCodec.encode(0n)).toBeUndefined()
    })

    test('should encode with smallest size', () => {
      expect(bigIntCodec.encode(BigInt(0x7fffffff))).toBe(2147483647)
      expect(bigIntCodec.encode(BigInt(-0x7fffffff) - 1n)).toBe(-2147483648)
      expect(bigIntCodec.encode(BigInt(0x7fffffff) + 1n)).toBe(2147483648n)
      expect(bigIntCodec.encode(BigInt(-0x7fffffff) - 2n)).toBe(-2147483649n)
    })

    test('should decode undefined to default value', () => {
      expect(bigIntCodec.decode(undefined)).toBe(0n)
      expect(bigIntCodec.decode(0n)).toBe(0n)
      expect(bigIntCodec.decode(42n)).toBe(42n)
    })

    test('should convert number to bigint when decoding', () => {
      expect(bigIntCodec.decode(42 as unknown as bigint)).toBe(42n)
      expect(bigIntCodec.decodeOptional(42 as unknown as bigint)).toBe(42n)
      expect(bigIntCodec.decode(42n)).toBe(42n)
      expect(bigIntCodec.decodeOptional(42n)).toBe(42n)
    })

    test('should handle optional decoding', () => {
      expect(bigIntCodec.decodeOptional(undefined)).toBeUndefined()
      expect(bigIntCodec.decodeOptional(0n)).toBe(0n)
      expect(bigIntCodec.decodeOptional(42n)).toBe(42n)
    })
  })

  describe('StringCodec', () => {
    test('should have empty string as default value', () => {
      expect(stringCodec.defaultValue()).toBe('')
    })

    test('should omit default value when encoding', () => {
      expect(stringCodec.encode('')).toBeUndefined()
      expect(stringCodec.encode('hello')).toBe('hello')
    })

    test('should decode undefined to default value', () => {
      expect(stringCodec.decode(undefined)).toBe('')
      expect(stringCodec.decode('hello')).toBe('hello')
    })

    test('should handle optional decoding', () => {
      expect(stringCodec.decodeOptional(undefined)).toBeUndefined()
      expect(stringCodec.decodeOptional('')).toBe('')
      expect(stringCodec.decodeOptional('hello')).toBe('hello')
    })
  })

  describe('BytesCodec', () => {
    test('should have empty Uint8Array as default value', () => {
      const defaultValue = bytesCodec.defaultValue()
      expect(defaultValue).toBeInstanceOf(Uint8Array)
      expect(defaultValue.length).toBe(0)
    })

    test('should omit default value when encoding', () => {
      expect(bytesCodec.encode(new Uint8Array(0))).toBeUndefined()
      expect(bytesCodec.encode(new Uint8Array([1, 2, 3]))).toEqual(new Uint8Array([1, 2, 3]))
    })

    test('should decode undefined to default value', () => {
      const decoded = bytesCodec.decode(undefined)
      expect(decoded).toMatchInlineSnapshot(`Uint8Array []`)
    })

    test('should handle optional decoding', () => {
      expect(bytesCodec.decodeOptional(undefined)).toBeUndefined()
      expect(bytesCodec.decodeOptional(new Uint8Array(0))).toEqual(new Uint8Array(0))
      expect(bytesCodec.decodeOptional(new Uint8Array([1, 2, 3]))).toEqual(new Uint8Array([1, 2, 3]))
    })
  })

  describe('BooleanCodec', () => {
    test('should have false as default value', () => {
      expect(booleanCodec.defaultValue()).toBe(false)
    })

    test('should omit default value when encoding', () => {
      expect(booleanCodec.encode(false)).toBeUndefined()
      expect(booleanCodec.encode(true)).toBe(true)
    })

    test('should decode undefined to default value', () => {
      expect(booleanCodec.decode(undefined)).toBe(false)
      expect(booleanCodec.decode(true)).toBe(true)
    })

    test('should handle optional decoding', () => {
      expect(booleanCodec.decodeOptional(undefined)).toBeUndefined()
      expect(booleanCodec.decodeOptional(false)).toBe(false)
      expect(booleanCodec.decodeOptional(true)).toBe(true)
    })
  })

  describe('OmitEmptyObjectCodec', () => {
    test('should have undefined as default value', () => {
      const codec = new OmitEmptyObjectCodec<{ a?: number; b?: string }>()
      expect(codec.defaultValue()).toBeUndefined()
    })

    test('should omit empty objects when encoding', () => {
      const codec = new OmitEmptyObjectCodec<{ a?: number; b?: string }>()
      expect(codec.encode({})).toBeUndefined()
      expect(codec.encode({ a: undefined })).toBeUndefined()
      expect(codec.encode({ a: numberCodec.encode(0) })).toBeUndefined()
      expect(codec.encode({ a: 1 })).toEqual({ a: 1 })
    })

    test('should decode undefined to default value', () => {
      const codec = new OmitEmptyObjectCodec<{ a?: number; b?: string }>()
      expect(codec.decode(undefined)).toBeUndefined()
      expect(codec.decode({ a: 1 })).toEqual({ a: 1 })
    })

    test('should handle optional decoding', () => {
      const codec = new OmitEmptyObjectCodec<{ a?: number; b?: string }>()
      expect(codec.decodeOptional(undefined)).toBeUndefined()
      expect(codec.decodeOptional({ a: 1 })).toEqual({ a: 1 })
    })
  })
})
