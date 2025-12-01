import { Address } from '@algorandfoundation/algokit-common'
import { describe, expect, test } from 'vitest'
import { addressCodec } from './address'

describe('AddressCodec', () => {
  const ZERO_ADDRESS = Address.zeroAddress()
  const VALID_ADDRESSES = {
    address1: Address.fromString('VCMJKWOY5P5P7SKMZFFOCEROPJCZOTIJMNIYNUCKH7LRO45JMJP6UYBIJA'),
    address2: Address.fromString('7ZUECA7HFLZTXENRV24SHLU4AVPUTMTTDUFUBNBD64C73F3UHRTHAIOF6Q'),
    address3: Address.fromString('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'),
    address4: ZERO_ADDRESS,
  }

  describe('defaultValue', () => {
    test('should return ZERO_ADDRESS', () => {
      expect(addressCodec.defaultValue()).toEqual(ZERO_ADDRESS)
    })
  })

  describe('encode', () => {
    describe('default values', () => {
      test.each<{ value: Address | undefined | null; description: string }>([
        { value: ZERO_ADDRESS, description: 'ZERO_ADDRESS' },
        { value: undefined, description: 'undefined' },
        { value: null, description: 'null' },
      ])('should encode $description to ZERO_ADDRESS', ({ value }) => {
        expect(addressCodec.encode(value, 'json')).toEqual(ZERO_ADDRESS.toString())
        const encodedMsgpack = addressCodec.encode(value, 'msgpack')
        expect(encodedMsgpack).toBeInstanceOf(Uint8Array)
        expect(encodedMsgpack.length).toBe(32)
      })
    })

    describe('JSON format', () => {
      test.each<{ value: Address; description: string }>([
        { value: VALID_ADDRESSES.address1, description: 'address 1' },
        { value: VALID_ADDRESSES.address2, description: 'address 2' },
        { value: VALID_ADDRESSES.address3, description: 'address 3' },
      ])('should encode $description as string (pass-through)', ({ value }) => {
        const encoded = addressCodec.encode(value, 'json')
        expect(encoded).toBe(value.toString())
        expect(typeof encoded).toBe('string')
      })
    })

    describe('msgpack format', () => {
      test.each<{ value: Address; description: string }>([
        { value: VALID_ADDRESSES.address1, description: 'address 1' },
        { value: VALID_ADDRESSES.address2, description: 'address 2' },
        { value: VALID_ADDRESSES.address3, description: 'address 3' },
      ])('should encode $description as Uint8Array (32 bytes)', ({ value }) => {
        const encoded = addressCodec.encode(value, 'msgpack')
        expect(encoded).toBeInstanceOf(Uint8Array)
        expect((encoded as Uint8Array).length).toBe(32)
        expect(encoded).toEqual(value.publicKey)
      })
    })
  })

  describe('encodeOptional', () => {
    describe('default values', () => {
      test.each<{ value: Address | undefined; description: string }>([
        { value: ZERO_ADDRESS, description: 'ZERO_ADDRESS' },
        { value: undefined, description: 'undefined' },
      ])('should omit $description when encoding', ({ value }) => {
        expect(addressCodec.encodeOptional(value, 'json')).toBeUndefined()
        expect(addressCodec.encodeOptional(value, 'msgpack')).toBeUndefined()
      })
    })

    describe('JSON format', () => {
      test.each<{ value: Address; description: string }>([
        { value: VALID_ADDRESSES.address1, description: 'address 1' },
        { value: VALID_ADDRESSES.address2, description: 'address 2' },
        { value: VALID_ADDRESSES.address3, description: 'address 3' },
      ])('should encode $description as string (pass-through)', ({ value }) => {
        const encoded = addressCodec.encodeOptional(value, 'json')
        expect(encoded).toBe(value.toString())
        expect(typeof encoded).toBe('string')
      })
    })

    describe('msgpack format', () => {
      test.each<{ value: Address; description: string }>([
        { value: VALID_ADDRESSES.address1, description: 'address 1' },
        { value: VALID_ADDRESSES.address2, description: 'address 2' },
        { value: VALID_ADDRESSES.address3, description: 'address 3' },
      ])('should encode $description as Uint8Array (32 bytes)', ({ value }) => {
        const encoded = addressCodec.encodeOptional(value, 'msgpack')
        expect(encoded).toBeInstanceOf(Uint8Array)
        expect((encoded as Uint8Array).length).toBe(32)
        expect(encoded).toEqual(value.publicKey)
      })
    })
  })

  describe('decode', () => {
    describe('default values', () => {
      test('should decode undefined to ZERO_ADDRESS', () => {
        expect(addressCodec.decode(undefined, 'json')).toEqual(ZERO_ADDRESS)
        expect(addressCodec.decode(undefined, 'msgpack')).toEqual(ZERO_ADDRESS)
      })

      test('should decode ZERO_ADDRESS string to ZERO_ADDRESS', () => {
        expect(addressCodec.decode(ZERO_ADDRESS.toString(), 'json')).toEqual(ZERO_ADDRESS)
        expect(addressCodec.decode(ZERO_ADDRESS.toString(), 'msgpack')).toEqual(ZERO_ADDRESS)
      })

      test('should decode zero bytes (32 zeros) to ZERO_ADDRESS', () => {
        expect(addressCodec.decode(ZERO_ADDRESS.publicKey, 'json')).toEqual(ZERO_ADDRESS)
        expect(addressCodec.decode(ZERO_ADDRESS.publicKey, 'msgpack')).toEqual(ZERO_ADDRESS)
      })
    })

    describe('from string', () => {
      test.each<{ value: Address; description: string }>([
        { value: VALID_ADDRESSES.address1, description: 'address 1' },
        { value: VALID_ADDRESSES.address2, description: 'address 2' },
        { value: VALID_ADDRESSES.address3, description: 'address 3' },
      ])('should decode string $description', ({ value }) => {
        expect(addressCodec.decode(value.toString(), 'json')).toEqual(value)
        expect(addressCodec.decode(value.toString(), 'msgpack')).toEqual(value)
      })
    })

    describe('from Uint8Array', () => {
      test.each<{ address: Address; description: string }>([
        { address: VALID_ADDRESSES.address1, description: 'address 1' },
        { address: VALID_ADDRESSES.address2, description: 'address 2' },
        { address: VALID_ADDRESSES.address3, description: 'address 3' },
      ])('should decode Uint8Array to $description', ({ address }) => {
        // First encode to get the byte representation
        const bytes = addressCodec.encodeOptional(address, 'msgpack') as Uint8Array

        // Then decode back
        expect(addressCodec.decode(bytes, 'json')).toEqual(address)
        expect(addressCodec.decode(bytes, 'msgpack')).toEqual(address)
      })

      test('should decode public key Uint8Array', () => {
        expect(addressCodec.decode(VALID_ADDRESSES.address1.publicKey, 'msgpack')).toEqual(VALID_ADDRESSES.address1)
      })

      test('should decode address Uint8Array', () => {
        const bytes = Buffer.from(VALID_ADDRESSES.address1.toString(), 'utf-8')
        expect(addressCodec.decode(bytes, 'msgpack')).toEqual(VALID_ADDRESSES.address1)
      })
    })

    describe('format independence', () => {
      test.each<{ value: Address | undefined; description: string }>([
        { value: undefined, description: 'undefined' },
        { value: ZERO_ADDRESS, description: 'ZERO_ADDRESS' },
        { value: VALID_ADDRESSES.address1, description: 'address 1' },
        { value: VALID_ADDRESSES.address2, description: 'address 2' },
      ])('should produce same result for JSON and msgpack when decoding string $description', ({ value }) => {
        expect(addressCodec.decode(value ? value.toString() : value, 'json')).toEqual(
          addressCodec.decode(value ? value.publicKey : value, 'msgpack'),
        )
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

    test.each<{ value: Address; description: string }>([
      { value: ZERO_ADDRESS, description: 'ZERO_ADDRESS (not undefined)' },
      { value: VALID_ADDRESSES.address1, description: 'address 1' },
      { value: VALID_ADDRESSES.address2, description: 'address 2' },
    ])('should decode string $description', ({ value }) => {
      expect(addressCodec.decodeOptional(value.toString(), 'json')).toEqual(value)
      expect(addressCodec.decodeOptional(value.toString(), 'msgpack')).toEqual(value)
    })

    test('should decode public key Uint8Array', () => {
      expect(addressCodec.decodeOptional(VALID_ADDRESSES.address1.publicKey, 'msgpack')).toEqual(VALID_ADDRESSES.address1)
    })

    test('should decode address Uint8Array', () => {
      const bytes = Buffer.from(VALID_ADDRESSES.address1.toString(), 'utf-8')
      expect(addressCodec.decodeOptional(bytes, 'msgpack')).toEqual(VALID_ADDRESSES.address1)
    })
  })

  describe('error handling', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    test.each<{ value: any; type: string }>([
      { value: 123, type: 'number' },
      { value: true, type: 'boolean' },
      { value: {}, type: 'object' },
      { value: [], type: 'array' },
    ])('should throw error when decoding $type', ({ value }) => {
      const errorMessage = 'AddressCodec cannot decode address'
      expect(() => addressCodec.decode(value, 'json')).toThrow(errorMessage)
      expect(() => addressCodec.decode(value, 'msgpack')).toThrow(errorMessage)
    })

    test('should throw error on invalid Uint8Array length', () => {
      const invalidBytes = new Uint8Array(16) // Wrong length
      expect(() => addressCodec.decode(invalidBytes, 'msgpack')).toThrow()
    })
  })
})
