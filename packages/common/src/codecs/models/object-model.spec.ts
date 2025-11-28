import { Buffer } from 'buffer'
import { describe, expect, test } from 'vitest'
import { numberCodec } from '../primitives/number'
import { stringCodec } from '../primitives/string'
import type { ObjectModelMetadata } from '../types'
import { ObjectModelCodec } from './object-model'

describe('ObjectModelCodec', () => {
  type Address = {
    suite?: string
    street: string
    city: string
    postcode: number
  }
  type AddressWithAllFieldsRequired = Required<Address>
  type AddressWithAllFieldsOptional = Partial<Address>

  type TPerson<TAddress extends Address | AddressWithAllFieldsRequired | AddressWithAllFieldsOptional> = {
    name: string
    address: TAddress
  }

  type PersonWithOptionalAddress<TAddress extends Address | AddressWithAllFieldsRequired | AddressWithAllFieldsOptional> = {
    name: string
    address?: TAddress
  }

  /**
   * Helper function to transform Address test data to use wireKeys
   */
  function addressToWireFormat(
    address: Address | Partial<Address>,
    toMap?: (obj: Record<string, unknown>) => Map<Uint8Array, unknown>,
  ): Record<string, unknown> | Map<Uint8Array, unknown> {
    const result: Record<string, unknown> = {}
    if ('suite' in address) result.s = address.suite
    if ('street' in address) result.st = address.street
    if ('city' in address) result.c = address.city
    if ('postcode' in address) result.p = address.postcode
    return toMap ? toMap(result) : result
  }

  /**
   * Helper function to transform Person test data to use wireKeys
   */
  function personToWireFormat<TAddress extends Address | Partial<Address>>(
    person: {
      name?: string
      address?: TAddress
    },
    toMap?: (obj: Record<string, unknown>) => Map<Uint8Array, unknown>,
  ): Record<string, unknown> | Map<Uint8Array, unknown> {
    const result: Record<string, unknown> = {}
    if ('name' in person) result.n = person.name
    if ('address' in person && person.address !== undefined) {
      // Convert the address first before converting the parent
      const addressWire = addressToWireFormat(person.address)
      result.a = addressWire
    }
    return toMap ? toMap(result) : result
  }

  function objectToMapWithByteKeys(obj: Record<string, unknown>): Map<Uint8Array, unknown> {
    const map = new Map<Uint8Array, unknown>()
    for (const [key, value] of Object.entries(obj)) {
      const keyBytes = Buffer.from(key, 'utf-8')
      let mapValue: unknown
      if (typeof value === 'string') {
        mapValue = Buffer.from(value, 'utf-8')
      } else if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Uint8Array)) {
        mapValue = objectToMapWithByteKeys(value as Record<string, unknown>)
      } else {
        mapValue = value
      }
      map.set(keyBytes, mapValue)
    }
    return map
  }

  describe('Non-nested object', () => {
    const metadata: ObjectModelMetadata<Address> = {
      name: 'Address',
      kind: 'object',
      fields: [
        { name: 'suite', wireKey: 's', codec: stringCodec, optional: true },
        { name: 'street', wireKey: 'st', codec: stringCodec, optional: false },
        { name: 'city', wireKey: 'c', codec: stringCodec, optional: false },
        { name: 'postcode', wireKey: 'p', codec: numberCodec, optional: false },
      ],
    }

    const codec = new ObjectModelCodec(metadata)

    const testData = {
      complete: { suite: '10A', street: 'Main St', city: 'Springfield', postcode: 12345 } as Address,
      allDefaults: { suite: '', street: '', city: '', postcode: 0 } as Address,
      allDefaultsWithoutOptionals: { street: '', city: '', postcode: 0 } as Address,
      completeWithoutOptionals: { street: 'Main St', city: 'Springfield', postcode: 12345 } as Address,
      empty: {},
      undefined: undefined,
      null: null,
    }

    describe('encode', () => {
      test('should encode object with all fields present', () => {
        const expected = {
          c: 'Springfield',
          p: 12345,
          st: 'Main St',
          s: '10A',
        }
        expect(codec.encode(testData.complete, 'json')).toEqual(expected)
        expect(codec.encode(testData.complete, 'msgpack')).toEqual(expected)
      })

      test('should encode object with all fields at defaults', () => {
        const expected = {}
        expect(codec.encode(testData.allDefaults, 'json')).toEqual(expected)
        expect(codec.encode(testData.allDefaults, 'msgpack')).toEqual(expected)
      })

      test('should encode object with all required fields at defaults, without optionals', () => {
        const expected = {}
        expect(codec.encode(testData.allDefaultsWithoutOptionals, 'json')).toEqual(expected)
        expect(codec.encode(testData.allDefaultsWithoutOptionals, 'msgpack')).toEqual(expected)
      })

      test('should encode object without optional fields', () => {
        const expected = {
          c: 'Springfield',
          p: 12345,
          st: 'Main St',
        }
        expect(codec.encode(testData.completeWithoutOptionals, 'json')).toEqual(expected)
        expect(codec.encode(testData.completeWithoutOptionals, 'msgpack')).toEqual(expected)
      })

      test('should encode empty object', () => {
        const expected = {}
        expect(codec.encode(testData.empty as Address, 'json')).toEqual(expected)
        expect(codec.encode(testData.empty as Address, 'msgpack')).toEqual(expected)
      })

      test('should handle undefined input', () => {
        const expected = {}
        expect(codec.encode(testData.undefined as unknown as Address, 'json')).toEqual(expected)
        expect(codec.encode(testData.undefined as unknown as Address, 'msgpack')).toEqual(expected)
      })

      test('should handle null input', () => {
        const expected = {}
        expect(codec.encode(testData.null as unknown as Address, 'json')).toEqual(expected)
        expect(codec.encode(testData.null as unknown as Address, 'msgpack')).toEqual(expected)
      })
    })

    describe('encodeOptional', () => {
      test('should encode object with all fields present', () => {
        const expected = {
          c: 'Springfield',
          p: 12345,
          st: 'Main St',
          s: '10A',
        }
        expect(codec.encodeOptional(testData.complete, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.complete, 'msgpack')).toEqual(expected)
      })

      test('should omit object with all fields at defaults', () => {
        const expected = undefined
        expect(codec.encodeOptional(testData.allDefaults, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.allDefaults, 'msgpack')).toEqual(expected)
      })

      test('should omit object with all required fields at defaults, without optionals', () => {
        const expected = undefined
        expect(codec.encodeOptional(testData.allDefaultsWithoutOptionals, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.allDefaultsWithoutOptionals, 'msgpack')).toEqual(expected)
      })

      test('should encode object without optional fields', () => {
        const expected = {
          c: 'Springfield',
          p: 12345,
          st: 'Main St',
        }
        expect(codec.encodeOptional(testData.completeWithoutOptionals, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.completeWithoutOptionals, 'msgpack')).toEqual(expected)
      })

      test('should handle empty object', () => {
        const expected = {}
        expect(codec.encodeOptional(testData.empty as Address, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.empty as Address, 'msgpack')).toEqual(expected)
      })

      test('should handle undefined input', () => {
        const expected = undefined
        expect(codec.encodeOptional(testData.undefined as unknown as Address, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.undefined as unknown as Address, 'msgpack')).toEqual(expected)
      })

      test('should handle null input', () => {
        const expected = undefined
        expect(codec.encodeOptional(testData.null as unknown as Address, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.null as unknown as Address, 'msgpack')).toEqual(expected)
      })
    })

    describe('decode', () => {
      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with all fields present ($wireType)',
        ({ toMap }) => {
          const expected = {
            city: 'Springfield',
            postcode: 12345,
            street: 'Main St',
            suite: '10A',
          }
          const wireData = addressToWireFormat(testData.complete, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with all fields at defaults ($wireType)',
        ({ toMap }) => {
          const expected = {
            city: '',
            postcode: 0,
            street: '',
            suite: '',
          }
          const wireData = addressToWireFormat(testData.allDefaults, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with all required fields at defaults, without optionals ($wireType)',
        ({ toMap }) => {
          const expected = {
            city: '',
            postcode: 0,
            street: '',
          }
          const wireData = addressToWireFormat(testData.allDefaultsWithoutOptionals, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object without optional fields ($wireType)',
        ({ toMap }) => {
          const expected = {
            city: 'Springfield',
            postcode: 12345,
            street: 'Main St',
          }
          const wireData = addressToWireFormat(testData.completeWithoutOptionals, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode empty object to defaults ($wireType)',
        ({ toMap }) => {
          const expected = {
            city: '',
            postcode: 0,
            street: '',
          }
          const wireData = addressToWireFormat(testData.empty as Address, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test('should handle undefined input', () => {
        const expected = {
          city: '',
          postcode: 0,
          street: '',
        }
        expect(codec.decode(testData.undefined as unknown as Address, 'json')).toEqual(expected)
        expect(codec.decode(testData.undefined as unknown as Address, 'msgpack')).toEqual(expected)
      })

      test('should handle null input', () => {
        const expected = {
          city: '',
          postcode: 0,
          street: '',
        }
        expect(codec.decode(testData.null as unknown as Address, 'json')).toEqual(expected)
        expect(codec.decode(testData.null as unknown as Address, 'msgpack')).toEqual(expected)
      })
    })

    describe('decodeOptional', () => {
      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with all fields present ($wireType)',
        ({ toMap }) => {
          const expected = {
            city: 'Springfield',
            postcode: 12345,
            street: 'Main St',
            suite: '10A',
          }
          const wireData = addressToWireFormat(testData.complete, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with all fields at defaults ($wireType)',
        ({ toMap }) => {
          const expected = {
            city: '',
            postcode: 0,
            street: '',
            suite: '',
          }
          const wireData = addressToWireFormat(testData.allDefaults, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with all required fields at defaults, without optionals ($wireType)',
        ({ toMap }) => {
          const expected = {
            city: '',
            postcode: 0,
            street: '',
          }
          const wireData = addressToWireFormat(testData.allDefaultsWithoutOptionals, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object without optional fields ($wireType)',
        ({ toMap }) => {
          const expected = {
            city: 'Springfield',
            postcode: 12345,
            street: 'Main St',
          }
          const wireData = addressToWireFormat(testData.completeWithoutOptionals, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode empty object to defaults ($wireType)',
        ({ toMap }) => {
          const expected = {
            city: '',
            postcode: 0,
            street: '',
          }
          const wireData = addressToWireFormat(testData.empty as Address, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test('should return undefined for undefined input', () => {
        expect(codec.decodeOptional(testData.undefined as unknown as Address, 'json')).toBeUndefined()
        expect(codec.decodeOptional(testData.undefined as unknown as Address, 'msgpack')).toBeUndefined()
      })

      test('should return undefined for null input', () => {
        expect(codec.decodeOptional(testData.null as unknown as Address, 'json')).toBeUndefined()
        expect(codec.decodeOptional(testData.null as unknown as Address, 'msgpack')).toBeUndefined()
      })
    })
  })

  describe('Required nested object with all optional fields', () => {
    type Person = TPerson<AddressWithAllFieldsOptional>

    const addressMetadata: ObjectModelMetadata<AddressWithAllFieldsOptional> = {
      name: 'AddressWithAllFieldsOptional',
      kind: 'object',
      fields: [
        { name: 'suite', wireKey: 's', codec: stringCodec, optional: true },
        { name: 'street', wireKey: 'st', codec: stringCodec, optional: true },
        { name: 'city', wireKey: 'c', codec: stringCodec, optional: true },
        { name: 'postcode', wireKey: 'p', codec: numberCodec, optional: true },
      ],
    }

    const metadata: ObjectModelMetadata<Person> = {
      name: 'PersonWithOptionalAddress',
      kind: 'object',
      fields: [
        { name: 'name', wireKey: 'n', codec: stringCodec, optional: false },
        { name: 'address', wireKey: 'a', codec: new ObjectModelCodec(addressMetadata), optional: false },
      ],
    }

    const codec = new ObjectModelCodec(metadata)

    const testData = {
      complete: {
        name: 'Alice',
        address: { suite: '10A', street: 'Main St', city: 'Springfield', postcode: 12345 },
      } satisfies Person,
      completeWithoutOptionals: {
        name: 'Alice',
        address: { street: 'Main St', city: 'Springfield', postcode: 12345 },
      } satisfies Person,
      allDefaults: {
        name: '',
        address: { suite: '', street: '', city: '', postcode: 0 },
      } satisfies Person,
      withEmptyNested: {
        name: 'Alice',
        address: {},
      } satisfies Person,
      withPartialNested: {
        name: 'Alice',
        address: { street: 'Main St', city: 'Springfield' },
      } satisfies Person,
      missingNested: {
        name: 'Alice',
      },
      empty: {},
      undefined: undefined,
      null: null,
    }

    describe('encode', () => {
      test('should encode object with all nested fields present', () => {
        const expected = {
          a: {
            c: 'Springfield',
            p: 12345,
            st: 'Main St',
            s: '10A',
          },
          n: 'Alice',
        }
        expect(codec.encode(testData.complete, 'json')).toEqual(expected)
        expect(codec.encode(testData.complete, 'msgpack')).toEqual(expected)
      })

      test('should encode object without optional nested fields', () => {
        const expected = {
          a: {
            c: 'Springfield',
            p: 12345,
            st: 'Main St',
          },
          n: 'Alice',
        }
        expect(codec.encode(testData.completeWithoutOptionals, 'json')).toEqual(expected)
        expect(codec.encode(testData.completeWithoutOptionals, 'msgpack')).toEqual(expected)
      })

      test('should encode object with all defaults', () => {
        const expected = {}
        expect(codec.encode(testData.allDefaults, 'json')).toEqual(expected)
        expect(codec.encode(testData.allDefaults, 'msgpack')).toEqual(expected)
      })

      test('should encode object with empty nested object', () => {
        const expected = {
          n: 'Alice',
        }
        expect(codec.encode(testData.withEmptyNested, 'json')).toEqual(expected)
        expect(codec.encode(testData.withEmptyNested, 'msgpack')).toEqual(expected)
      })

      test('should encode object with some nested fields', () => {
        const expected = {
          a: {
            c: 'Springfield',
            st: 'Main St',
          },
          n: 'Alice',
        }
        expect(codec.encode(testData.withPartialNested, 'json')).toEqual(expected)
        expect(codec.encode(testData.withPartialNested, 'msgpack')).toEqual(expected)
      })

      test('should encode object missing nested object', () => {
        const expected = {
          n: 'Alice',
        }
        expect(codec.encode(testData.missingNested as Person, 'json')).toEqual(expected)
        expect(codec.encode(testData.missingNested as Person, 'msgpack')).toEqual(expected)
      })

      test('should encode empty object', () => {
        const expected = {}
        expect(codec.encode(testData.empty as Person, 'json')).toEqual(expected)
        expect(codec.encode(testData.empty as Person, 'msgpack')).toEqual(expected)
      })

      test('should handle undefined input', () => {
        const expected = {}
        expect(codec.encode(testData.undefined, 'json')).toEqual(expected)
        expect(codec.encode(testData.undefined, 'msgpack')).toEqual(expected)
      })

      test('should handle null input', () => {
        const expected = {}
        expect(codec.encode(testData.null, 'json')).toEqual(expected)
        expect(codec.encode(testData.null, 'msgpack')).toEqual(expected)
      })
    })

    describe('encodeOptional', () => {
      test('should encode object with all nested fields present', () => {
        const expected = {
          a: {
            c: 'Springfield',
            p: 12345,
            st: 'Main St',
            s: '10A',
          },
          n: 'Alice',
        }
        expect(codec.encodeOptional(testData.complete, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.complete, 'msgpack')).toEqual(expected)
      })

      test('should encode object without optional nested fields', () => {
        const expected = {
          a: {
            c: 'Springfield',
            p: 12345,
            st: 'Main St',
          },
          n: 'Alice',
        }
        expect(codec.encodeOptional(testData.completeWithoutOptionals, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.completeWithoutOptionals, 'msgpack')).toEqual(expected)
      })

      test('should omit object with all defaults', () => {
        const expected = undefined
        expect(codec.encodeOptional(testData.allDefaults, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.allDefaults, 'msgpack')).toEqual(expected)
      })

      test('should encode object with empty nested object', () => {
        const expected = {
          n: 'Alice',
        }
        expect(codec.encodeOptional(testData.withEmptyNested, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.withEmptyNested, 'msgpack')).toEqual(expected)
      })

      test('should encode object with partial nested fields', () => {
        const expected = {
          a: {
            c: 'Springfield',
            st: 'Main St',
          },
          n: 'Alice',
        }
        expect(codec.encodeOptional(testData.withPartialNested, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.withPartialNested, 'msgpack')).toEqual(expected)
      })

      test('should encode object missing nested object', () => {
        const expected = {
          n: 'Alice',
        }
        expect(codec.encodeOptional(testData.missingNested as Person, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.missingNested as Person, 'msgpack')).toEqual(expected)
      })

      test('should handle empty object', () => {
        const expected = {}
        expect(codec.encodeOptional(testData.empty as Person, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.empty as Person, 'msgpack')).toEqual(expected)
      })

      test('should handle undefined input', () => {
        const expected = undefined
        expect(codec.encodeOptional(testData.undefined, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.undefined, 'msgpack')).toEqual(expected)
      })

      test('should handle null input', () => {
        const expected = undefined
        expect(codec.encodeOptional(testData.null, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.null, 'msgpack')).toEqual(expected)
      })
    })

    describe('decode', () => {
      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with all nested fields present ($wireType)',
        ({ toMap }) => {
          const expected = {
            address: {
              city: 'Springfield',
              postcode: 12345,
              street: 'Main St',
              suite: '10A',
            },
            name: 'Alice',
          }
          const wireData = personToWireFormat(testData.complete, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object without optional nested fields ($wireType)',
        ({ toMap }) => {
          const expected = {
            address: {
              city: 'Springfield',
              postcode: 12345,
              street: 'Main St',
            },
            name: 'Alice',
          }
          const wireData = personToWireFormat(testData.completeWithoutOptionals, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with all defaults ($wireType)',
        ({ toMap }) => {
          const expected = {
            address: {
              city: '',
              postcode: 0,
              street: '',
              suite: '',
            },
            name: '',
          }
          const wireData = personToWireFormat(testData.allDefaults, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode empty nested object ($wireType)',
        ({ toMap }) => {
          const expected = {
            address: {},
            name: 'Alice',
          }
          const wireData = personToWireFormat(testData.withEmptyNested, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with partial nested fields ($wireType)',
        ({ toMap }) => {
          const expected = {
            address: {
              city: 'Springfield',
              street: 'Main St',
            },
            name: 'Alice',
          }
          const wireData = personToWireFormat(testData.withPartialNested, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object missing nested object ($wireType)',
        ({ toMap }) => {
          const expected = {
            address: {},
            name: 'Alice',
          }
          const wireData = personToWireFormat(testData.missingNested as Person, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode empty object ($wireType)',
        ({ toMap }) => {
          const expected = {
            address: {},
            name: '',
          }
          const wireData = personToWireFormat(testData.empty as Person, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test('should handle undefined input', () => {
        const expected = {
          address: {},
          name: '',
        }
        expect(codec.decode(testData.undefined, 'json')).toEqual(expected)
        expect(codec.decode(testData.undefined, 'msgpack')).toEqual(expected)
      })

      test('should handle null input', () => {
        const expected = {
          address: {},
          name: '',
        }
        expect(codec.decode(testData.null, 'json')).toEqual(expected)
        expect(codec.decode(testData.null, 'msgpack')).toEqual(expected)
      })
    })

    describe('decodeOptional', () => {
      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with all nested fields present ($wireType)',
        ({ toMap }) => {
          const expected = {
            address: {
              city: 'Springfield',
              postcode: 12345,
              street: 'Main St',
              suite: '10A',
            },
            name: 'Alice',
          }
          const wireData = personToWireFormat(testData.complete, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object without optional nested fields ($wireType)',
        ({ toMap }) => {
          const expected = {
            address: {
              city: 'Springfield',
              postcode: 12345,
              street: 'Main St',
            },
            name: 'Alice',
          }
          const wireData = personToWireFormat(testData.completeWithoutOptionals, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with all defaults ($wireType)',
        ({ toMap }) => {
          const expected = {
            address: {
              city: '',
              postcode: 0,
              street: '',
              suite: '',
            },
            name: '',
          }
          const wireData = personToWireFormat(testData.allDefaults, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode empty nested object ($wireType)',
        ({ toMap }) => {
          const expected = {
            address: {},
            name: 'Alice',
          }
          const wireData = personToWireFormat(testData.withEmptyNested, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with partial nested fields ($wireType)',
        ({ toMap }) => {
          const expected = {
            address: {
              city: 'Springfield',
              street: 'Main St',
            },
            name: 'Alice',
          }
          const wireData = personToWireFormat(testData.withPartialNested, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object missing nested object ($wireType)',
        ({ toMap }) => {
          const expected = {
            address: {},
            name: 'Alice',
          }
          const wireData = personToWireFormat(testData.missingNested as Person, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode empty object ($wireType)',
        ({ toMap }) => {
          const expected = {
            address: {},
            name: '',
          }
          const wireData = personToWireFormat(testData.empty as Person, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test('should return undefined for undefined input', () => {
        const expected = undefined
        expect(codec.decodeOptional(testData.undefined, 'json')).toEqual(expected)
        expect(codec.decodeOptional(testData.undefined, 'msgpack')).toEqual(expected)
      })

      test('should return undefined for null input', () => {
        const expected = undefined
        expect(codec.decodeOptional(testData.null, 'json')).toEqual(expected)
        expect(codec.decodeOptional(testData.null, 'msgpack')).toEqual(expected)
      })
    })
  })

  describe('Optional nested object with all required fields', () => {
    type Person = PersonWithOptionalAddress<AddressWithAllFieldsRequired>

    const addressMetadata: ObjectModelMetadata<AddressWithAllFieldsRequired> = {
      name: 'AddressWithAllFieldsRequired',
      kind: 'object',
      fields: [
        { name: 'suite', wireKey: 's', codec: stringCodec, optional: false },
        { name: 'street', wireKey: 'st', codec: stringCodec, optional: false },
        { name: 'city', wireKey: 'c', codec: stringCodec, optional: false },
        { name: 'postcode', wireKey: 'p', codec: numberCodec, optional: false },
      ],
    }

    const metadata: ObjectModelMetadata<Person> = {
      name: 'PersonWithOptionalRequiredAddress',
      kind: 'object',
      fields: [
        { name: 'name', wireKey: 'n', codec: stringCodec, optional: false },
        { name: 'address', wireKey: 'a', codec: new ObjectModelCodec(addressMetadata), optional: true },
      ],
    }

    const codec = new ObjectModelCodec(metadata)

    const testData = {
      complete: {
        name: 'Alice',
        address: { suite: '10A', street: 'Main St', city: 'Springfield', postcode: 12345 },
      } satisfies Person,
      allDefaults: {
        name: '',
        address: { suite: '', street: '', city: '', postcode: 0 },
      } satisfies Person,
      withoutNested: {
        name: 'Alice',
      } satisfies Person,
      withPartialNested: {
        name: 'Alice',
        address: { street: 'Main St' },
      },
      empty: {},
      undefined: undefined,
      null: null,
    }

    describe('encode', () => {
      test('should encode object with nested object present', () => {
        const expected = {
          a: {
            c: 'Springfield',
            p: 12345,
            st: 'Main St',
            s: '10A',
          },
          n: 'Alice',
        }
        expect(codec.encode(testData.complete, 'json')).toEqual(expected)
        expect(codec.encode(testData.complete, 'msgpack')).toEqual(expected)
      })

      test('should encode object without nested object', () => {
        const expected = {
          n: 'Alice',
        }
        expect(codec.encode(testData.withoutNested, 'json')).toEqual(expected)
        expect(codec.encode(testData.withoutNested, 'msgpack')).toEqual(expected)
      })

      test('should encode object with all defaults', () => {
        const expected = {}
        expect(codec.encode(testData.allDefaults, 'json')).toEqual(expected)
        expect(codec.encode(testData.allDefaults, 'msgpack')).toEqual(expected)
      })

      test('should encode object with partial nested fields', () => {
        const expected = {
          a: {
            st: 'Main St',
          },
          n: 'Alice',
        }
        expect(codec.encode(testData.withPartialNested as Person, 'json')).toEqual(expected)
        expect(codec.encode(testData.withPartialNested as Person, 'msgpack')).toEqual(expected)
      })

      test('should encode empty object', () => {
        const expected = {}
        expect(codec.encode(testData.empty as Person, 'json')).toEqual(expected)
        expect(codec.encode(testData.empty as Person, 'msgpack')).toEqual(expected)
      })

      test('should handle undefined input', () => {
        const expected = {}
        expect(codec.encode(testData.undefined, 'json')).toEqual(expected)
        expect(codec.encode(testData.undefined, 'msgpack')).toEqual(expected)
      })

      test('should handle null input', () => {
        const expected = {}
        expect(codec.encode(testData.null, 'json')).toEqual(expected)
        expect(codec.encode(testData.null, 'msgpack')).toEqual(expected)
      })
    })

    describe('encodeOptional', () => {
      test('should encode object with nested object present', () => {
        const expected = {
          a: {
            c: 'Springfield',
            p: 12345,
            st: 'Main St',
            s: '10A',
          },
          n: 'Alice',
        }
        expect(codec.encodeOptional(testData.complete, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.complete, 'msgpack')).toEqual(expected)
      })

      test('should encode object without nested object', () => {
        const expected = {
          n: 'Alice',
        }
        expect(codec.encodeOptional(testData.withoutNested, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.withoutNested, 'msgpack')).toEqual(expected)
      })

      test('should omit object with all defaults', () => {
        const expected = undefined
        expect(codec.encodeOptional(testData.allDefaults, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.allDefaults, 'msgpack')).toEqual(expected)
      })

      test('should encode object with partial nested fields', () => {
        const expected = {
          a: {
            st: 'Main St',
          },
          n: 'Alice',
        }
        expect(codec.encodeOptional(testData.withPartialNested as Person, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.withPartialNested as Person, 'msgpack')).toEqual(expected)
      })

      test('should handle empty object', () => {
        const expected = {}
        expect(codec.encodeOptional(testData.empty as Person, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.empty as Person, 'msgpack')).toEqual(expected)
      })

      test('should handle undefined input', () => {
        const expected = undefined
        expect(codec.encodeOptional(testData.undefined, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.undefined, 'msgpack')).toEqual(expected)
      })

      test('should handle null input', () => {
        const expected = undefined
        expect(codec.encodeOptional(testData.null, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.null, 'msgpack')).toEqual(expected)
      })
    })

    describe('decode', () => {
      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with nested object present ($wireType)',
        ({ toMap }) => {
          const expected = {
            address: {
              city: 'Springfield',
              postcode: 12345,
              street: 'Main St',
              suite: '10A',
            },
            name: 'Alice',
          }
          const wireData = personToWireFormat(testData.complete, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object without nested object ($wireType)',
        ({ toMap }) => {
          const expected = {
            name: 'Alice',
          }
          const wireData = personToWireFormat(testData.withoutNested, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with all defaults ($wireType)',
        ({ toMap }) => {
          const expected = {
            address: {
              city: '',
              postcode: 0,
              street: '',
              suite: '',
            },
            name: '',
          }
          const wireData = personToWireFormat(testData.allDefaults, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with partial nested object ($wireType)',
        ({ toMap }) => {
          const expected = {
            address: {
              city: '',
              postcode: 0,
              street: 'Main St',
              suite: '',
            },
            name: 'Alice',
          }
          const wireData = personToWireFormat(testData.withPartialNested as Person, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode empty object ($wireType)',
        ({ toMap }) => {
          const expected = {
            name: '',
          }
          const wireData = personToWireFormat(testData.empty as Person, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test('should handle undefined input', () => {
        const expected = {
          name: '',
        }
        expect(codec.decode(testData.undefined, 'json')).toEqual(expected)
        expect(codec.decode(testData.undefined, 'msgpack')).toEqual(expected)
      })

      test('should handle null input', () => {
        const expected = {
          name: '',
        }
        expect(codec.decode(testData.null, 'json')).toEqual(expected)
        expect(codec.decode(testData.null, 'msgpack')).toEqual(expected)
      })
    })

    describe('decodeOptional', () => {
      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with nested object present ($wireType)',
        ({ toMap }) => {
          const expected = {
            address: {
              city: 'Springfield',
              postcode: 12345,
              street: 'Main St',
              suite: '10A',
            },
            name: 'Alice',
          }
          const wireData = personToWireFormat(testData.complete, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object without nested object ($wireType)',
        ({ toMap }) => {
          const expected = {
            name: 'Alice',
          }
          const wireData = personToWireFormat(testData.withoutNested, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with all defaults ($wireType)',
        ({ toMap }) => {
          const expected = {
            address: {
              city: '',
              postcode: 0,
              street: '',
              suite: '',
            },
            name: '',
          }
          const wireData = personToWireFormat(testData.allDefaults, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with partial nested object ($wireType)',
        ({ toMap }) => {
          const expected = {
            address: {
              city: '',
              postcode: 0,
              street: 'Main St',
              suite: '',
            },
            name: 'Alice',
          }
          const wireData = personToWireFormat(testData.withPartialNested as Person, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode empty object ($wireType)',
        ({ toMap }) => {
          const expected = {
            name: '',
          }
          const wireData = personToWireFormat(testData.empty as Person, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test('should return undefined for undefined input', () => {
        const expected = undefined
        expect(codec.decodeOptional(testData.undefined, 'json')).toEqual(expected)
        expect(codec.decodeOptional(testData.undefined, 'msgpack')).toEqual(expected)
      })

      test('should return undefined for null input', () => {
        const expected = undefined
        expect(codec.decodeOptional(testData.null, 'json')).toEqual(expected)
        expect(codec.decodeOptional(testData.null, 'msgpack')).toEqual(expected)
      })
    })
  })

  describe('Optional nested object with all optional fields', () => {
    type Person = PersonWithOptionalAddress<AddressWithAllFieldsOptional>

    const addressMetadata: ObjectModelMetadata<AddressWithAllFieldsOptional> = {
      name: 'AddressWithAllFieldsOptional',
      kind: 'object',
      fields: [
        { name: 'suite', wireKey: 's', codec: stringCodec, optional: true },
        { name: 'street', wireKey: 'st', codec: stringCodec, optional: true },
        { name: 'city', wireKey: 'c', codec: stringCodec, optional: true },
        { name: 'postcode', wireKey: 'p', codec: numberCodec, optional: true },
      ],
    }

    const metadata: ObjectModelMetadata<Person> = {
      name: 'PersonWithOptionalOptionalAddress',
      kind: 'object',
      fields: [
        { name: 'name', wireKey: 'n', codec: stringCodec, optional: false },
        { name: 'address', wireKey: 'a', codec: new ObjectModelCodec(addressMetadata), optional: true },
      ],
    }

    const codec = new ObjectModelCodec(metadata)

    const testData = {
      complete: {
        name: 'Alice',
        address: { suite: '10A', street: 'Main St', city: 'Springfield', postcode: 12345 },
      } satisfies Person,
      completeWithoutOptionals: {
        name: 'Alice',
        address: { street: 'Main St', city: 'Springfield', postcode: 12345 },
      } satisfies Person,
      allDefaults: {
        name: '',
        address: { suite: '', street: '', city: '', postcode: 0 },
      } satisfies Person,
      withoutNested: {
        name: 'Alice',
      } satisfies Person,
      withPartialNested: {
        name: 'Alice',
        address: { street: 'Main St' },
      } satisfies Person,
      withEmptyNested: {
        name: 'Alice',
        address: {},
      } satisfies Person,
      empty: {},
      undefined: undefined,
      null: null,
    }

    describe('encode', () => {
      test('should encode object with all nested fields present', () => {
        const expected = {
          a: {
            c: 'Springfield',
            p: 12345,
            st: 'Main St',
            s: '10A',
          },
          n: 'Alice',
        }
        expect(codec.encode(testData.complete, 'json')).toEqual(expected)
        expect(codec.encode(testData.complete, 'msgpack')).toEqual(expected)
      })

      test('should encode object with empty nested object', () => {
        const expected = {
          a: {
            c: 'Springfield',
            p: 12345,
            st: 'Main St',
          },
          n: 'Alice',
        }
        expect(codec.encode(testData.completeWithoutOptionals, 'json')).toEqual(expected)
        expect(codec.encode(testData.completeWithoutOptionals, 'msgpack')).toEqual(expected)
      })

      test('should encode object without nested object', () => {
        const expected = {
          n: 'Alice',
        }
        expect(codec.encode(testData.withoutNested, 'json')).toEqual(expected)
        expect(codec.encode(testData.withoutNested, 'msgpack')).toEqual(expected)
      })

      test('should encode object with all defaults', () => {
        const expected = {}
        expect(codec.encode(testData.allDefaults, 'json')).toEqual(expected)
        expect(codec.encode(testData.allDefaults, 'msgpack')).toEqual(expected)
      })

      test('should encode object with some nested fields', () => {
        const expected = {
          a: {
            st: 'Main St',
          },
          n: 'Alice',
        }
        expect(codec.encode(testData.withPartialNested, 'json')).toEqual(expected)
        expect(codec.encode(testData.withPartialNested, 'msgpack')).toEqual(expected)
      })

      test('should encode object with empty nested object', () => {
        const expected = {
          n: 'Alice',
        }
        expect(codec.encode(testData.withEmptyNested, 'json')).toEqual(expected)
        expect(codec.encode(testData.withEmptyNested, 'msgpack')).toEqual(expected)
      })

      test('should encode empty object', () => {
        const expected = {}
        expect(codec.encode(testData.empty as Person, 'json')).toEqual(expected)
        expect(codec.encode(testData.empty as Person, 'msgpack')).toEqual(expected)
      })

      test('should handle undefined input', () => {
        const expected = {}
        expect(codec.encode(testData.undefined, 'json')).toEqual(expected)
        expect(codec.encode(testData.undefined, 'msgpack')).toEqual(expected)
      })

      test('should handle null input', () => {
        const expected = {}
        expect(codec.encode(testData.null, 'json')).toEqual(expected)
        expect(codec.encode(testData.null, 'msgpack')).toEqual(expected)
      })
    })

    describe('encodeOptional', () => {
      test('should encode object with all nested fields present', () => {
        const expected = {
          a: {
            c: 'Springfield',
            p: 12345,
            st: 'Main St',
            s: '10A',
          },
          n: 'Alice',
        }
        expect(codec.encodeOptional(testData.complete, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.complete, 'msgpack')).toEqual(expected)
      })

      test('should encode object with empty nested object', () => {
        const expected = {
          a: {
            c: 'Springfield',
            p: 12345,
            st: 'Main St',
          },
          n: 'Alice',
        }
        expect(codec.encodeOptional(testData.completeWithoutOptionals, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.completeWithoutOptionals, 'msgpack')).toEqual(expected)
      })

      test('should encode object without nested object', () => {
        const expected = {
          n: 'Alice',
        }
        expect(codec.encodeOptional(testData.withoutNested, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.withoutNested, 'msgpack')).toEqual(expected)
      })

      test('should omit object with all defaults', () => {
        const expected = undefined
        expect(codec.encodeOptional(testData.allDefaults, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.allDefaults, 'msgpack')).toEqual(expected)
      })

      test('should encode object with some nested fields', () => {
        const expected = {
          a: {
            st: 'Main St',
          },
          n: 'Alice',
        }
        expect(codec.encodeOptional(testData.withPartialNested, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.withPartialNested, 'msgpack')).toEqual(expected)
      })

      test('should encode object with empty nested object', () => {
        const expected = {
          n: 'Alice',
        }
        expect(codec.encodeOptional(testData.withEmptyNested, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.withEmptyNested, 'msgpack')).toEqual(expected)
      })

      test('should handle empty object', () => {
        const expected = {}
        expect(codec.encodeOptional(testData.empty as Person, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.empty as Person, 'msgpack')).toEqual(expected)
      })

      test('should handle undefined input', () => {
        const expected = undefined
        expect(codec.encodeOptional(testData.undefined, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.undefined, 'msgpack')).toEqual(expected)
      })

      test('should handle null input', () => {
        const expected = undefined
        expect(codec.encodeOptional(testData.null, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.null, 'msgpack')).toEqual(expected)
      })
    })

    describe('decode', () => {
      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with all nested fields present ($wireType)',
        ({ toMap }) => {
          const expected = {
            address: {
              city: 'Springfield',
              postcode: 12345,
              street: 'Main St',
              suite: '10A',
            },
            name: 'Alice',
          }
          const wireData = personToWireFormat(testData.complete, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with empty nested object ($wireType)',
        ({ toMap }) => {
          const expected = {
            address: {
              city: 'Springfield',
              postcode: 12345,
              street: 'Main St',
            },
            name: 'Alice',
          }
          const wireData = personToWireFormat(testData.completeWithoutOptionals, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object without nested object ($wireType)',
        ({ toMap }) => {
          const expected = {
            name: 'Alice',
          }
          const wireData = personToWireFormat(testData.withoutNested, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with all defaults ($wireType)',
        ({ toMap }) => {
          const expected = {
            address: {
              city: '',
              postcode: 0,
              street: '',
              suite: '',
            },
            name: '',
          }
          const wireData = personToWireFormat(testData.allDefaults, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with some nested fields ($wireType)',
        ({ toMap }) => {
          const expected = {
            address: {
              street: 'Main St',
            },
            name: 'Alice',
          }
          const wireData = personToWireFormat(testData.withPartialNested, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with empty nested object ($wireType)',
        ({ toMap }) => {
          const expected = {
            name: 'Alice',
          }
          const wireData = personToWireFormat(testData.withEmptyNested, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode empty object ($wireType)',
        ({ toMap }) => {
          const expected = {
            name: '',
          }
          const wireData = personToWireFormat(testData.empty as Person, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test('should handle undefined input', () => {
        const expected = {
          name: '',
        }
        expect(codec.decode(testData.undefined, 'json')).toEqual(expected)
        expect(codec.decode(testData.undefined, 'msgpack')).toEqual(expected)
      })

      test('should handle null input', () => {
        const expected = {
          name: '',
        }
        expect(codec.decode(testData.null, 'json')).toEqual(expected)
        expect(codec.decode(testData.null, 'msgpack')).toEqual(expected)
      })
    })

    describe('decodeOptional', () => {
      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with all nested fields present ($wireType)',
        ({ toMap }) => {
          const expected = {
            address: {
              city: 'Springfield',
              postcode: 12345,
              street: 'Main St',
              suite: '10A',
            },
            name: 'Alice',
          }
          const wireData = personToWireFormat(testData.complete, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with empty nested object ($wireType)',
        ({ toMap }) => {
          const expected = {
            address: {
              city: 'Springfield',
              postcode: 12345,
              street: 'Main St',
            },
            name: 'Alice',
          }
          const wireData = personToWireFormat(testData.completeWithoutOptionals, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object without nested object ($wireType)',
        ({ toMap }) => {
          const expected = {
            name: 'Alice',
          }
          const wireData = personToWireFormat(testData.withoutNested, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with all defaults ($wireType)',
        ({ toMap }) => {
          const expected = {
            address: {
              city: '',
              postcode: 0,
              street: '',
              suite: '',
            },
            name: '',
          }
          const wireData = personToWireFormat(testData.allDefaults, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with some nested fields ($wireType)',
        ({ toMap }) => {
          const expected = {
            address: {
              street: 'Main St',
            },
            name: 'Alice',
          }
          const wireData = personToWireFormat(testData.withPartialNested, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with empty nested object ($wireType)',
        ({ toMap }) => {
          const expected = {
            name: 'Alice',
          }
          const wireData = personToWireFormat(testData.withEmptyNested, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode empty object ($wireType)',
        ({ toMap }) => {
          const expected = {
            name: '',
          }
          const wireData = personToWireFormat(testData.empty as Person, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test('should return undefined for undefined input', () => {
        const expected = undefined
        expect(codec.decodeOptional(testData.undefined, 'json')).toEqual(expected)
        expect(codec.decodeOptional(testData.undefined, 'msgpack')).toEqual(expected)
      })

      test('should return undefined for null input', () => {
        const expected = undefined
        expect(codec.decodeOptional(testData.null, 'json')).toEqual(expected)
        expect(codec.decodeOptional(testData.null, 'msgpack')).toEqual(expected)
      })
    })
  })

  describe('Object with nested flattened field', () => {
    type PersonWithFlattenedAddress = {
      name: string
      address: Address
    }

    const addressMetadata: ObjectModelMetadata<Address> = {
      name: 'Address',
      kind: 'object',
      fields: [
        { name: 'suite', wireKey: 's', codec: stringCodec, optional: true },
        { name: 'street', wireKey: 'st', codec: stringCodec, optional: false },
        { name: 'city', wireKey: 'c', codec: stringCodec, optional: false },
        { name: 'postcode', wireKey: 'p', codec: numberCodec, optional: false },
      ],
    }

    const addressCodec = new ObjectModelCodec(addressMetadata)

    const metadata: ObjectModelMetadata<PersonWithFlattenedAddress> = {
      name: 'PersonWithFlattenedAddress',
      kind: 'object',
      fields: [
        { name: 'name', wireKey: 'n', codec: stringCodec, optional: false },
        { name: 'address', wireKey: 'a', codec: addressCodec, optional: false, flattened: true },
      ],
    }

    const codec = new ObjectModelCodec(metadata)

    const testData = {
      complete: {
        name: 'Alice',
        address: { suite: '10A', street: 'Main St', city: 'Springfield', postcode: 12345 },
      } as PersonWithFlattenedAddress,
      completeWithoutOptionals: {
        name: 'Alice',
        address: { street: 'Main St', city: 'Springfield', postcode: 12345 },
      } as PersonWithFlattenedAddress,
      allDefaults: {
        name: '',
        address: { suite: '', street: '', city: '', postcode: 0 },
      } as PersonWithFlattenedAddress,
      allDefaultsWithoutOptionals: {
        name: '',
        address: { street: '', city: '', postcode: 0 },
      } as PersonWithFlattenedAddress,
      empty: {},
      undefined: undefined,
      null: null,
    }

    function personWithFlattenedAddressToWireFormat(
      person: {
        name?: string
        address?: Address | Partial<Address>
      },
      toMap?: (obj: Record<string, unknown>) => Map<Uint8Array, unknown>,
    ): Record<string, unknown> | Map<Uint8Array, unknown> {
      const result: Record<string, unknown> = {}
      if ('name' in person) result.n = person.name
      // For flattened fields, merge the address fields directly into the parent
      if ('address' in person && person.address !== undefined) {
        const address = person.address
        if ('suite' in address) result.s = address.suite
        if ('street' in address) result.st = address.street
        if ('city' in address) result.c = address.city
        if ('postcode' in address) result.p = address.postcode
      }
      return toMap ? toMap(result) : result
    }

    describe('encode', () => {
      test('should encode object with flattened nested fields', () => {
        const expected = {
          n: 'Alice',
          s: '10A',
          st: 'Main St',
          c: 'Springfield',
          p: 12345,
        }
        expect(codec.encode(testData.complete, 'json')).toEqual(expected)
        expect(codec.encode(testData.complete, 'msgpack')).toEqual(expected)
      })

      test('should encode object with flattened nested fields without optionals', () => {
        const expected = {
          n: 'Alice',
          st: 'Main St',
          c: 'Springfield',
          p: 12345,
        }
        expect(codec.encode(testData.completeWithoutOptionals, 'json')).toEqual(expected)
        expect(codec.encode(testData.completeWithoutOptionals, 'msgpack')).toEqual(expected)
      })

      test('should encode object with all defaults', () => {
        const expected = {}
        expect(codec.encode(testData.allDefaults, 'json')).toEqual(expected)
        expect(codec.encode(testData.allDefaults, 'msgpack')).toEqual(expected)
      })

      test('should encode object with all defaults without optionals', () => {
        const expected = {}
        expect(codec.encode(testData.allDefaultsWithoutOptionals, 'json')).toEqual(expected)
        expect(codec.encode(testData.allDefaultsWithoutOptionals, 'msgpack')).toEqual(expected)
      })

      test('should encode empty object', () => {
        const expected = {}
        expect(codec.encode(testData.empty as PersonWithFlattenedAddress, 'json')).toEqual(expected)
        expect(codec.encode(testData.empty as PersonWithFlattenedAddress, 'msgpack')).toEqual(expected)
      })

      test('should handle undefined input', () => {
        const expected = {}
        expect(codec.encode(testData.undefined as unknown as PersonWithFlattenedAddress, 'json')).toEqual(expected)
        expect(codec.encode(testData.undefined as unknown as PersonWithFlattenedAddress, 'msgpack')).toEqual(expected)
      })

      test('should handle null input', () => {
        const expected = {}
        expect(codec.encode(testData.null as unknown as PersonWithFlattenedAddress, 'json')).toEqual(expected)
        expect(codec.encode(testData.null as unknown as PersonWithFlattenedAddress, 'msgpack')).toEqual(expected)
      })
    })

    describe('encodeOptional', () => {
      test('should encode object with flattened nested fields', () => {
        const expected = {
          n: 'Alice',
          s: '10A',
          st: 'Main St',
          c: 'Springfield',
          p: 12345,
        }
        expect(codec.encodeOptional(testData.complete, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.complete, 'msgpack')).toEqual(expected)
      })

      test('should encode object with flattened nested fields without optionals', () => {
        const expected = {
          n: 'Alice',
          st: 'Main St',
          c: 'Springfield',
          p: 12345,
        }
        expect(codec.encodeOptional(testData.completeWithoutOptionals, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.completeWithoutOptionals, 'msgpack')).toEqual(expected)
      })

      test('should omit object with all defaults', () => {
        const expected = undefined
        expect(codec.encodeOptional(testData.allDefaults, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.allDefaults, 'msgpack')).toEqual(expected)
      })

      test('should omit object with all defaults without optionals', () => {
        const expected = undefined
        expect(codec.encodeOptional(testData.allDefaultsWithoutOptionals, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.allDefaultsWithoutOptionals, 'msgpack')).toEqual(expected)
      })

      test('should handle empty object', () => {
        const expected = {}
        expect(codec.encodeOptional(testData.empty as PersonWithFlattenedAddress, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.empty as PersonWithFlattenedAddress, 'msgpack')).toEqual(expected)
      })

      test('should handle undefined input', () => {
        const expected = undefined
        expect(codec.encodeOptional(testData.undefined as unknown as PersonWithFlattenedAddress, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.undefined as unknown as PersonWithFlattenedAddress, 'msgpack')).toEqual(expected)
      })

      test('should handle null input', () => {
        const expected = undefined
        expect(codec.encodeOptional(testData.null as unknown as PersonWithFlattenedAddress, 'json')).toEqual(expected)
        expect(codec.encodeOptional(testData.null as unknown as PersonWithFlattenedAddress, 'msgpack')).toEqual(expected)
      })
    })

    describe('decode', () => {
      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with flattened nested fields ($wireType)',
        ({ toMap }) => {
          const expected = {
            name: 'Alice',
            address: {
              suite: '10A',
              street: 'Main St',
              city: 'Springfield',
              postcode: 12345,
            },
          }
          const wireData = personWithFlattenedAddressToWireFormat(testData.complete, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with flattened nested fields without optionals ($wireType)',
        ({ toMap }) => {
          const expected = {
            name: 'Alice',
            address: {
              street: 'Main St',
              city: 'Springfield',
              postcode: 12345,
            },
          }
          const wireData = personWithFlattenedAddressToWireFormat(testData.completeWithoutOptionals, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with all defaults ($wireType)',
        ({ toMap }) => {
          const expected = {
            name: '',
            address: {
              suite: '',
              street: '',
              city: '',
              postcode: 0,
            },
          }
          const wireData = personWithFlattenedAddressToWireFormat(testData.allDefaults, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with all defaults without optionals ($wireType)',
        ({ toMap }) => {
          const expected = {
            name: '',
            address: {
              street: '',
              city: '',
              postcode: 0,
            },
          }
          const wireData = personWithFlattenedAddressToWireFormat(testData.allDefaultsWithoutOptionals, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode empty object to defaults ($wireType)',
        ({ toMap }) => {
          const expected = {
            name: '',
            address: {
              street: '',
              city: '',
              postcode: 0,
            },
          }
          const wireData = personWithFlattenedAddressToWireFormat(testData.empty as PersonWithFlattenedAddress, toMap)
          expect(codec.decode(wireData, 'json')).toEqual(expected)
          expect(codec.decode(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test('should handle undefined input', () => {
        const expected = {
          name: '',
          address: {
            street: '',
            city: '',
            postcode: 0,
          },
        }
        expect(codec.decode(testData.undefined as unknown as PersonWithFlattenedAddress, 'json')).toEqual(expected)
        expect(codec.decode(testData.undefined as unknown as PersonWithFlattenedAddress, 'msgpack')).toEqual(expected)
      })

      test('should handle null input', () => {
        const expected = {
          name: '',
          address: {
            street: '',
            city: '',
            postcode: 0,
          },
        }
        expect(codec.decode(testData.null as unknown as PersonWithFlattenedAddress, 'json')).toEqual(expected)
        expect(codec.decode(testData.null as unknown as PersonWithFlattenedAddress, 'msgpack')).toEqual(expected)
      })
    })

    describe('decodeOptional', () => {
      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with flattened nested fields ($wireType)',
        ({ toMap }) => {
          const expected = {
            name: 'Alice',
            address: {
              suite: '10A',
              street: 'Main St',
              city: 'Springfield',
              postcode: 12345,
            },
          }
          const wireData = personWithFlattenedAddressToWireFormat(testData.complete, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with flattened nested fields without optionals ($wireType)',
        ({ toMap }) => {
          const expected = {
            name: 'Alice',
            address: {
              street: 'Main St',
              city: 'Springfield',
              postcode: 12345,
            },
          }
          const wireData = personWithFlattenedAddressToWireFormat(testData.completeWithoutOptionals, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with all defaults ($wireType)',
        ({ toMap }) => {
          const expected = {
            name: '',
            address: {
              suite: '',
              street: '',
              city: '',
              postcode: 0,
            },
          }
          const wireData = personWithFlattenedAddressToWireFormat(testData.allDefaults, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode object with all defaults without optionals ($wireType)',
        ({ toMap }) => {
          const expected = {
            name: '',
            address: {
              street: '',
              city: '',
              postcode: 0,
            },
          }
          const wireData = personWithFlattenedAddressToWireFormat(testData.allDefaultsWithoutOptionals, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test.each([{ wireType: 'object' }, { wireType: 'map', toMap: objectToMapWithByteKeys }])(
        'should decode empty object to defaults ($wireType)',
        ({ toMap }) => {
          const expected = {
            name: '',
            address: {
              street: '',
              city: '',
              postcode: 0,
            },
          }
          const wireData = personWithFlattenedAddressToWireFormat(testData.empty as PersonWithFlattenedAddress, toMap)
          expect(codec.decodeOptional(wireData, 'json')).toEqual(expected)
          expect(codec.decodeOptional(wireData, 'msgpack')).toEqual(expected)
        },
      )

      test('should return undefined for undefined input', () => {
        expect(codec.decodeOptional(testData.undefined as unknown as PersonWithFlattenedAddress, 'json')).toBeUndefined()
        expect(codec.decodeOptional(testData.undefined as unknown as PersonWithFlattenedAddress, 'msgpack')).toBeUndefined()
      })

      test('should return undefined for null input', () => {
        expect(codec.decodeOptional(testData.null as unknown as PersonWithFlattenedAddress, 'json')).toBeUndefined()
        expect(codec.decodeOptional(testData.null as unknown as PersonWithFlattenedAddress, 'msgpack')).toBeUndefined()
      })
    })
  })
})
