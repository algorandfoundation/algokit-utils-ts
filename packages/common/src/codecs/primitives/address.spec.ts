import { publicKeyFromAddress } from '@algorandfoundation/algokit-common'
import { describe, expect, test } from 'vitest'
import { ZERO_ADDRESS } from '../../constants'
import { addressCodec } from './address'

describe('AddressCodec', () => {
  const VALID_ADDRESSES = {
    address1: 'VCMJKWOY5P5P7SKMZFFOCEROPJCZOTIJMNIYNUCKH7LRO45JMJP6UYBIJA',
    address2: '7ZUECA7HFLZTXENRV24SHLU4AVPUTMTTDUFUBNBD64C73F3UHRTHAIOF6Q',
    address3: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
    address4: ZERO_ADDRESS,
  }

  describe('defaultValue', () => {
    test('should return ZERO_ADDRESS', () => {
      expect(addressCodec.defaultValue()).toBe(ZERO_ADDRESS)
    })
  })

  describe('encode', () => {
    describe('default values', () => {
      test.each<{ value: string | undefined | null; description: string }>([
        { value: ZERO_ADDRESS, description: 'ZERO_ADDRESS' },
        { value: undefined, description: 'undefined' },
        { value: null, description: 'null' },
      ])('should encode $description to ZERO_ADDRESS', ({ value }) => {
        expect(addressCodec.encode(value, 'json')).toBe(ZERO_ADDRESS)
        const encodedMsgpack = addressCodec.encode(value, 'msgpack')
        expect(encodedMsgpack).toBeInstanceOf(Uint8Array)
        expect(encodedMsgpack.length).toBe(32)
      })
    })

    describe('JSON format', () => {
      test.each<{ value: string; description: string }>([
        { value: VALID_ADDRESSES.address1, description: 'address 1' },
        { value: VALID_ADDRESSES.address2, description: 'address 2' },
        { value: VALID_ADDRESSES.address3, description: 'address 3' },
      ])('should encode $description as string (pass-through)', ({ value }) => {
        const encoded = addressCodec.encode(value, 'json')
        expect(encoded).toBe(value)
        expect(typeof encoded).toBe('string')
      })
    })

    describe('msgpack format', () => {
      test.each<{ value: string; description: string }>([
        { value: VALID_ADDRESSES.address1, description: 'address 1' },
        { value: VALID_ADDRESSES.address2, description: 'address 2' },
        { value: VALID_ADDRESSES.address3, description: 'address 3' },
      ])('should encode $description as Uint8Array (32 bytes)', ({ value }) => {
        const encoded = addressCodec.encode(value, 'msgpack')
        expect(encoded).toBeInstanceOf(Uint8Array)
        expect((encoded as Uint8Array).length).toBe(32)
        expect(encoded).toEqual(publicKeyFromAddress(value))
      })
    })
  })

  describe('encodeOptional', () => {
    describe('default values', () => {
      test.each<{ value: string | undefined; description: string }>([
        { value: ZERO_ADDRESS, description: 'ZERO_ADDRESS' },
        { value: undefined, description: 'undefined' },
      ])('should omit $description when encoding', ({ value }) => {
        expect(addressCodec.encodeOptional(value, 'json')).toBeUndefined()
        expect(addressCodec.encodeOptional(value, 'msgpack')).toBeUndefined()
      })
    })

    describe('JSON format', () => {
      test.each<{ value: string; description: string }>([
        { value: VALID_ADDRESSES.address1, description: 'address 1' },
        { value: VALID_ADDRESSES.address2, description: 'address 2' },
        { value: VALID_ADDRESSES.address3, description: 'address 3' },
      ])('should encode $description as string (pass-through)', ({ value }) => {
        const encoded = addressCodec.encodeOptional(value, 'json')
        expect(encoded).toBe(value)
        expect(typeof encoded).toBe('string')
      })
    })

    describe('msgpack format', () => {
      test.each<{ value: string; description: string }>([
        { value: VALID_ADDRESSES.address1, description: 'address 1' },
        { value: VALID_ADDRESSES.address2, description: 'address 2' },
        { value: VALID_ADDRESSES.address3, description: 'address 3' },
      ])('should encode $description as Uint8Array (32 bytes)', ({ value }) => {
        const encoded = addressCodec.encodeOptional(value, 'msgpack')
        expect(encoded).toBeInstanceOf(Uint8Array)
        expect((encoded as Uint8Array).length).toBe(32)
        expect(encoded).toEqual(publicKeyFromAddress(value))
      })
    })
  })

  describe('decode', () => {
    describe('default values', () => {
      test('should decode undefined to ZERO_ADDRESS', () => {
        expect(addressCodec.decode(undefined, 'json')).toBe(ZERO_ADDRESS)
        expect(addressCodec.decode(undefined, 'msgpack')).toBe(ZERO_ADDRESS)
      })

      test('should decode ZERO_ADDRESS string to ZERO_ADDRESS', () => {
        expect(addressCodec.decode(ZERO_ADDRESS, 'json')).toBe(ZERO_ADDRESS)
        expect(addressCodec.decode(ZERO_ADDRESS, 'msgpack')).toBe(ZERO_ADDRESS)
      })

      test('should decode zero bytes (32 zeros) to ZERO_ADDRESS', () => {
        const zeroBytes = new Uint8Array(32)
        expect(addressCodec.decode(zeroBytes, 'json')).toBe(ZERO_ADDRESS)
        expect(addressCodec.decode(zeroBytes, 'msgpack')).toBe(ZERO_ADDRESS)
      })
    })

    describe('from string', () => {
      test.each<{ value: string; description: string }>([
        { value: VALID_ADDRESSES.address1, description: 'address 1' },
        { value: VALID_ADDRESSES.address2, description: 'address 2' },
        { value: VALID_ADDRESSES.address3, description: 'address 3' },
      ])('should decode string $description', ({ value }) => {
        expect(addressCodec.decode(value, 'json')).toBe(value)
        expect(addressCodec.decode(value, 'msgpack')).toBe(value)
      })
    })

    describe('from Uint8Array', () => {
      test.each<{ address: string; description: string }>([
        { address: VALID_ADDRESSES.address1, description: 'address 1' },
        { address: VALID_ADDRESSES.address2, description: 'address 2' },
        { address: VALID_ADDRESSES.address3, description: 'address 3' },
      ])('should decode Uint8Array to $description', ({ address }) => {
        // First encode to get the byte representation
        const bytes = addressCodec.encodeOptional(address, 'msgpack') as Uint8Array

        // Then decode back
        expect(addressCodec.decode(bytes, 'json')).toBe(address)
        expect(addressCodec.decode(bytes, 'msgpack')).toBe(address)
      })

      test('should decode public key Uint8Array', () => {
        const bytes = addressCodec.encodeOptional(VALID_ADDRESSES.address1, 'msgpack') as Uint8Array
        expect(addressCodec.decode(bytes, 'msgpack')).toBe(VALID_ADDRESSES.address1)
      })

      test('should decode address Uint8Array', () => {
        const bytes = Buffer.from(VALID_ADDRESSES.address1, 'utf-8')
        expect(addressCodec.decode(bytes, 'msgpack')).toBe(VALID_ADDRESSES.address1)
      })
    })

    describe('format independence for strings', () => {
      test.each<{ value: string | undefined; description: string }>([
        { value: undefined, description: 'undefined' },
        { value: ZERO_ADDRESS, description: 'ZERO_ADDRESS' },
        { value: VALID_ADDRESSES.address1, description: 'address 1' },
        { value: VALID_ADDRESSES.address2, description: 'address 2' },
      ])('should produce same result for JSON and msgpack when decoding string $description', ({ value }) => {
        expect(addressCodec.decode(value, 'json')).toBe(addressCodec.decode(value, 'msgpack'))
      })
    })

    describe('format independence for Uint8Array', () => {
      test.each<{ address: string; description: string }>([
        { address: VALID_ADDRESSES.address1, description: 'address 1 bytes' },
        { address: VALID_ADDRESSES.address2, description: 'address 2 bytes' },
      ])('should produce same result for JSON and msgpack when decoding $description', ({ address }) => {
        const bytes = addressCodec.encodeOptional(address, 'msgpack') as Uint8Array
        expect(addressCodec.decode(bytes, 'json')).toBe(addressCodec.decode(bytes, 'msgpack'))
      })
    })
  })

  describe('decodeOptional', () => {
    test.each<{ value: string | null | undefined; description: string }>([
      { value: undefined, description: 'undefined' },
      { value: null, description: 'null' },
    ])('should decode $description to undefined', ({ value }) => {
      expect(addressCodec.decodeOptional(value, 'json')).toBeUndefined()
      expect(addressCodec.decodeOptional(value, 'msgpack')).toBeUndefined()
    })

    test.each<{ value: string; description: string }>([
      { value: ZERO_ADDRESS, description: 'ZERO_ADDRESS (not undefined)' },
      { value: VALID_ADDRESSES.address1, description: 'address 1' },
      { value: VALID_ADDRESSES.address2, description: 'address 2' },
    ])('should decode string $description', ({ value }) => {
      expect(addressCodec.decodeOptional(value, 'json')).toBe(value)
      expect(addressCodec.decodeOptional(value, 'msgpack')).toBe(value)
    })

    test('should decode public key Uint8Array', () => {
      const bytes = addressCodec.encodeOptional(VALID_ADDRESSES.address1, 'msgpack') as Uint8Array
      expect(addressCodec.decodeOptional(bytes, 'msgpack')).toBe(VALID_ADDRESSES.address1)
    })

    test('should decode address Uint8Array', () => {
      const bytes = Buffer.from(VALID_ADDRESSES.address1, 'utf-8')
      expect(addressCodec.decodeOptional(bytes, 'msgpack')).toBe(VALID_ADDRESSES.address1)
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
      expect(() => addressCodec.decode(value, 'json')).toThrow('Cannot decode address from')
      expect(() => addressCodec.decode(value, 'msgpack')).toThrow('Cannot decode address from')
    })

    test('should throw error on invalid Uint8Array length', () => {
      const invalidBytes = new Uint8Array(16) // Wrong length
      expect(() => addressCodec.decode(invalidBytes, 'msgpack')).toThrow()
    })

    test('should throw error on invalid address string format', () => {
      const invalidAddress = 'INVALID_ADDRESS'
      expect(() => addressCodec.encodeOptional(invalidAddress, 'msgpack')).toThrow()
    })
  })
})
