import { Address } from '@algorandfoundation/algokit-common'
import { describe, expect, test } from 'vitest'
import {
  ABIAddressType,
  ABIArrayDynamicType,
  ABIArrayStaticType,
  ABIBoolType,
  ABIByteType,
  ABIStringType,
  ABIStructType,
  ABITupleType,
  ABIType,
  ABIUfixedType,
  ABIUintType,
} from './abi-type'
import { ABIStructValue, ABIValue } from './abi-value'

describe('ABIType encode decode', () => {
  const basicTypeCases = [
    // Uint tests
    {
      description: 'uint8 with value 0',
      abiType: new ABIUintType(8),
      abiValue: 0,
      expectedBytes: [0],
    },
    {
      description: 'uint16 with value 3',
      abiType: new ABIUintType(16),
      abiValue: 3,
      expectedBytes: [0, 3],
    },
    {
      description: 'uint64 with value 256',
      abiType: new ABIUintType(64),
      abiValue: 256n,
      expectedBytes: [0, 0, 0, 0, 0, 0, 1, 0],
    },

    // Ufixed tests
    {
      description: 'ufixed8x30 with value 255',
      abiType: new ABIUfixedType(8, 30),
      abiValue: 255,
      expectedBytes: [255],
    },
    {
      description: 'ufixed32x10 with value 33',
      abiType: new ABIUfixedType(32, 10),
      abiValue: 33,
      expectedBytes: [0, 0, 0, 33],
    },

    // Address tests
    {
      description: 'address',
      abiType: new ABIAddressType(),
      abiValue: Address.fromString('MO2H6ZU47Q36GJ6GVHUKGEBEQINN7ZWVACMWZQGIYUOE3RBSRVYHV4ACJI'),
      expectedBytes: [
        99, 180, 127, 102, 156, 252, 55, 227, 39, 198, 169, 232, 163, 16, 36, 130, 26, 223, 230, 213, 0, 153, 108, 192, 200, 197, 28, 77,
        196, 50, 141, 112,
      ],
    },

    // String tests
    {
      description: 'string with unicode',
      abiType: new ABIStringType(),
      abiValue: 'What’s new',
      expectedBytes: [0, 12, 87, 104, 97, 116, 226, 128, 153, 115, 32, 110, 101, 119],
    },
    {
      description: 'string with emoji',
      abiType: new ABIStringType(),
      abiValue: '😅🔨',
      expectedBytes: [0, 8, 240, 159, 152, 133, 240, 159, 148, 168],
    },
    {
      description: 'simple string',
      abiType: new ABIStringType(),
      abiValue: 'asdf',
      expectedBytes: [0, 4, 97, 115, 100, 102],
    },

    // Byte tests
    {
      description: 'byte with value 10',
      abiType: new ABIByteType(),
      abiValue: 10,
      expectedBytes: [10],
    },
    {
      description: 'byte with value 255',
      abiType: new ABIByteType(),
      abiValue: 255,
      expectedBytes: [255],
    },

    // Bool tests
    {
      description: 'bool true',
      abiType: new ABIBoolType(),
      abiValue: true,
      expectedBytes: [128],
    },
    {
      description: 'bool false',
      abiType: new ABIBoolType(),
      abiValue: false,
      expectedBytes: [0],
    },

    // Static array tests
    {
      description: 'bool[3] array',
      abiType: new ABIArrayStaticType(new ABIBoolType(), 3),
      abiValue: [true, true, false],
      expectedBytes: [192],
    },
    {
      description: 'bool[8] array with 01000000',
      abiType: new ABIArrayStaticType(new ABIBoolType(), 8),
      abiValue: [false, true, false, false, false, false, false, false],
      expectedBytes: [64],
    },
    {
      description: 'bool[8] array with all true',
      abiType: new ABIArrayStaticType(new ABIBoolType(), 8),
      abiValue: [true, true, true, true, true, true, true, true],
      expectedBytes: [255],
    },
    {
      description: 'bool[9] array',
      abiType: new ABIArrayStaticType(new ABIBoolType(), 9),
      abiValue: [true, false, false, true, false, false, true, false, true],
      expectedBytes: [146, 128],
    },
    {
      description: 'uint64[3] array',
      abiType: new ABIArrayStaticType(new ABIUintType(64), 3),
      abiValue: [1n, 2n, 3n],
      expectedBytes: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 3],
    },

    // Dynamic array tests
    {
      description: 'empty bool[] array',
      abiType: new ABIArrayDynamicType(new ABIBoolType()),
      abiValue: [],
      expectedBytes: [0, 0],
    },
    {
      description: 'bool[] array with 3 elements',
      abiType: new ABIArrayDynamicType(new ABIBoolType()),
      abiValue: [true, true, false],
      expectedBytes: [0, 3, 192],
    },
    {
      description: 'bool[] array with 8 elements',
      abiType: new ABIArrayDynamicType(new ABIBoolType()),
      abiValue: [false, true, false, false, false, false, false, false],
      expectedBytes: [0, 8, 64],
    },
    {
      description: 'bool[] array with 9 elements',
      abiType: new ABIArrayDynamicType(new ABIBoolType()),
      abiValue: [true, false, false, true, false, false, true, false, true],
      expectedBytes: [0, 9, 146, 128],
    },
  ]

  const simpleTupleCases = [
    {
      description: 'tuple (uint8, uint16)',
      abiType: new ABITupleType([new ABIUintType(8), new ABIUintType(16)]),
      abiValue: [1, 2],
      expectedBytes: [1, 0, 2],
    },
    {
      description: 'tuple (uint32, uint32)',
      abiType: new ABITupleType([new ABIUintType(32), new ABIUintType(32)]),
      abiValue: [1, 2],
      expectedBytes: [0, 0, 0, 1, 0, 0, 0, 2],
    },
    {
      description: 'tuple (uint32, string)',
      abiType: new ABITupleType([new ABIUintType(32), new ABIStringType()]),
      abiValue: [42, 'hello'],
      expectedBytes: [0, 0, 0, 42, 0, 6, 0, 5, 104, 101, 108, 108, 111],
    },
    {
      description: 'tuple (uint16, bool)',
      abiType: new ABITupleType([new ABIUintType(16), new ABIBoolType()]),
      abiValue: [1234, false],
      expectedBytes: [4, 210, 0],
    },
    {
      description: 'tuple (uint32, string, bool)',
      abiType: new ABITupleType([new ABIUintType(32), new ABIStringType(), new ABIBoolType()]),
      abiValue: [42, 'test', false],
      expectedBytes: [0, 0, 0, 42, 0, 7, 0, 0, 4, 116, 101, 115, 116],
    },
  ]

  const complexTupleCases = [
    {
      description: 'empty tuple',
      typeString: '()',
      abiValue: [],
      expectedBytes: [],
    },
    {
      description: 'triple bool tuple',
      typeString: '(bool,bool,bool)',
      abiValue: [false, true, true],
      expectedBytes: [96],
    },
    {
      description: 'tuple with bool[3]',
      typeString: '(bool[3])',
      abiValue: [[false, true, true]],
      expectedBytes: [96],
    },
    {
      description: 'tuple with bool[]',
      typeString: '(bool[])',
      abiValue: [[false, true, true]],
      expectedBytes: [0, 2, 0, 3, 96],
    },
    {
      description: 'tuple with bool[2] and bool[]',
      typeString: '(bool[2],bool[])',
      abiValue: [
        [true, true],
        [true, true],
      ],
      expectedBytes: [192, 0, 3, 0, 2, 192],
    },
    {
      description: 'tuple with two empty bool[]',
      typeString: '(bool[],bool[])',
      abiValue: [[], []],
      expectedBytes: [0, 4, 0, 6, 0, 0, 0, 0],
    },
    {
      description: 'complex tuple with strings and bools',
      typeString: '(string,bool,bool,bool,bool,string)',
      abiValue: ['AB', true, false, true, false, 'DE'],
      expectedBytes: [0, 5, 160, 0, 9, 0, 2, 65, 66, 0, 2, 68, 69],
    },
  ]

  const nestedTupleCases = [
    {
      description: 'nested tuple (uint16, (byte, address))',
      typeString: '(uint16,(byte,address))',
      abiValue: [42, [234, Address.fromString('MO2H6ZU47Q36GJ6GVHUKGEBEQINN7ZWVACMWZQGIYUOE3RBSRVYHV4ACJI')]],
      expectedBytes: [
        0, 42, 234, 99, 180, 127, 102, 156, 252, 55, 227, 39, 198, 169, 232, 163, 16, 36, 130, 26, 223, 230, 213, 0, 153, 108, 192, 200,
        197, 28, 77, 196, 50, 141, 112,
      ],
    },
  ]

  test.each(basicTypeCases)('should encode and decode $description', ({ abiType, abiValue, expectedBytes }) => {
    const expectedUint8Array = new Uint8Array(expectedBytes)

    const encoded = abiType.encode(abiValue)
    expect(encoded).toEqual(expectedUint8Array)

    const decoded = abiType.decode(encoded)
    expect(decoded).toEqual(abiValue)
  })

  test.each(simpleTupleCases)('should encode and decode $description', ({ abiType, abiValue, expectedBytes }) => {
    const expectedUint8Array = new Uint8Array(expectedBytes)

    const encoded = abiType.encode(abiValue)
    expect(encoded).toEqual(expectedUint8Array)

    const decoded = abiType.decode(encoded)
    expect(decoded).toEqual(abiValue)
  })

  test.each(complexTupleCases)('should encode and decode $description using type string', ({ typeString, abiValue, expectedBytes }) => {
    const abiType = ABIType.from(typeString)
    const expectedUint8Array = new Uint8Array(expectedBytes)

    const encoded = abiType.encode(abiValue)
    expect(encoded).toEqual(expectedUint8Array)

    const decoded = abiType.decode(encoded)
    expect(decoded).toEqual(abiValue)
  })

  test.each(nestedTupleCases)('should encode and decode $description using type string', ({ typeString, abiValue, expectedBytes }) => {
    const abiType = ABIType.from(typeString)
    const expectedUint8Array = new Uint8Array(expectedBytes)

    const encoded = abiType.encode(abiValue)
    expect(encoded).toEqual(expectedUint8Array)

    const decoded = abiType.decode(encoded)
    expect(decoded).toEqual(abiValue)
  })

  test.each(
    // Generate all valid ABI uint bit lengths
    Array.from({ length: 64 }, (_, i) => (i + 1) * 8),
  )('correctly decodes a uint%i', (bitLength) => {
    const abiType = new ABIUintType(bitLength)
    const encoded = abiType.encode(1)
    const decoded = abiType.decode(encoded)

    if (bitLength < 53) {
      expect(typeof decoded).toBe('number')
      expect(decoded).toBe(1)
    } else {
      expect(typeof decoded).toBe('bigint')
      expect(decoded).toBe(1n)
    }
  })

  test('Struct and tuple encode decode should match', () => {
    const tupleType = ABIType.from('(uint8,(uint16,string,string[]),(bool,byte),(byte,address))')
    const structType = new ABIStructType('Struct 1', [
      {
        name: 'field 1',
        type: new ABIUintType(8),
      },
      {
        name: 'field 2',
        type: new ABIStructType('Struct 2', [
          {
            name: 'Struct 2 field 1',
            type: new ABIUintType(16),
          },
          {
            name: 'Struct 2 field 2',
            type: new ABIStringType(),
          },
          {
            name: 'Struct 2 field 3',
            type: new ABIArrayDynamicType(new ABIStringType()),
          },
        ]),
      },
      {
        name: 'field 3',
        type: [
          {
            name: 'field 3 child 1',
            type: new ABIBoolType(),
          },
          {
            name: 'field 3 child 2',
            type: new ABIByteType(),
          },
        ],
      },
      {
        name: 'field 4',
        type: new ABITupleType([new ABIByteType(), new ABIAddressType()]),
      },
    ])

    const tupleValue = [
      123,
      [65432, 'hello', ['world 1', 'world 2', 'world 3']],
      [false, 88],
      [222, Address.fromString('BEKKSMPBTPIGBYJGKD4XK7E7ZQJNZIHJVYFQWW3HNI32JHSH3LOGBRY3LE')],
    ] satisfies ABIValue[]

    const structValue = {
      'field 1': 123,
      'field 2': {
        'Struct 2 field 1': 65432,
        'Struct 2 field 2': 'hello',
        'Struct 2 field 3': ['world 1', 'world 2', 'world 3'],
      },
      'field 3': {
        'field 3 child 1': false,
        'field 3 child 2': 88,
      },
      'field 4': [222, Address.fromString('BEKKSMPBTPIGBYJGKD4XK7E7ZQJNZIHJVYFQWW3HNI32JHSH3LOGBRY3LE')],
    } satisfies ABIStructValue

    const encodedTuple = tupleType.encode(tupleValue)
    const encodedStruct = structType.encode(structValue)

    expect(encodedTuple).toEqual(encodedStruct)

    const decodedTuple = tupleType.decode(encodedTuple)
    expect(decodedTuple).toEqual(tupleValue)

    const decodedStruct = structType.decode(encodedTuple)
    expect(decodedStruct).toEqual(structValue)
  })

  test('correctly decodes a struct containing a uint16', () => {
    const userStruct = new ABIStructType('User', [
      {
        name: 'userId',
        type: ABIType.from('uint16'),
      },
      { name: 'name', type: ABIType.from('string') },
    ])

    const decoded = userStruct.decode(new Uint8Array([0, 1, 0, 4, 0, 5, 119, 111, 114, 108, 100])) as {
      userId: number
      name: string
    }

    expect(typeof decoded.userId).toBe('number')
    expect(decoded.userId).toBe(1)
    expect(typeof decoded.name).toBe('string')
    expect(decoded.name).toBe('world')
  })

  describe('Basic byte arrays', () => {
    test('should convert a simple byte array to Uint8Array', () => {
      // Create a static array of bytes: byte[4]
      const arrayType = ABIType.from('byte[4]')

      const value = [1, 2, 3, 4]
      const encoded = arrayType.encode(value)
      const result = arrayType.decode(encoded)

      expect(result).toBeInstanceOf(Uint8Array)
      expect(Array.from(result as Uint8Array)).toEqual([1, 2, 3, 4])
    })

    test('should handle dynamic byte arrays', () => {
      // Create a dynamic array of bytes: byte[]
      const arrayType = ABIType.from('byte[]')

      const value = [10, 20, 30, 40, 50]
      const encoded = arrayType.encode(value)
      const result = arrayType.decode(encoded)

      expect(result).toBeInstanceOf(Uint8Array)
      expect(Array.from(result as Uint8Array)).toEqual([10, 20, 30, 40, 50])
    })

    test('should return existing Uint8Array as is', () => {
      const arrayType = ABIType.from('byte[3]')

      const value = new Uint8Array([5, 6, 7])
      const encoded = arrayType.encode(value)
      const result = arrayType.decode(encoded)

      expect(result).toEqual(value)
    })
  })

  describe('Nested arrays', () => {
    test('should convert byte arrays inside arrays', () => {
      // Create byte[2][]
      const outerArrayType = ABIType.from('byte[2][]')

      const value = [
        [1, 2],
        [3, 4],
        [5, 6],
      ]
      const encoded = outerArrayType.encode(value)
      const result = outerArrayType.decode(encoded) as ABIValue[]

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(3)

      result.forEach((item) => {
        expect(item).toBeInstanceOf(Uint8Array)
      })

      expect(Array.from(result[0] as Uint8Array)).toEqual([1, 2])
      expect(Array.from(result[1] as Uint8Array)).toEqual([3, 4])
      expect(Array.from(result[2] as Uint8Array)).toEqual([5, 6])
    })

    test('should not convert non-byte arrays', () => {
      // Create uint8[3]
      const arrayType = ABIType.from('uint8[3]')

      const value = [1, 2, 3]
      const encoded = arrayType.encode(value)
      const result = arrayType.decode(encoded)

      expect(Array.isArray(result)).toBe(true)
      expect(result).toEqual([1, 2, 3])
    })
  })

  describe('Tuple tests', () => {
    test('should handle tuples with byte arrays', () => {
      // Create (byte[2],bool,byte[3])
      const tupleType = ABIType.from('(byte[2],bool,byte[3])')

      const value = [[1, 2], true, [3, 4, 5]]
      const encoded = tupleType.encode(value)
      const result = tupleType.decode(encoded) as ABIValue[]

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(3)

      expect(result[0]).toBeInstanceOf(Uint8Array)
      expect(result[1]).toBe(true)
      expect(result[2]).toBeInstanceOf(Uint8Array)

      expect(Array.from(result[0] as Uint8Array)).toEqual([1, 2])
      expect(Array.from(result[2] as Uint8Array)).toEqual([3, 4, 5])
    })

    test('should handle nested tuples with byte arrays', () => {
      // Create (byte[2],(byte[1],bool))
      const outerTupleType = ABIType.from('(byte[2],(byte[1],bool))')

      const value = [
        [1, 2],
        [[3], true],
      ]
      const encoded = outerTupleType.encode(value)
      const result = outerTupleType.decode(encoded) as ABIValue[]

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(2)

      expect(result[0]).toBeInstanceOf(Uint8Array)
      expect(Array.from(result[0] as Uint8Array)).toEqual([1, 2])

      const nestedTuple = result[1] as ABIValue[]
      expect(Array.isArray(nestedTuple)).toBe(true)
      expect(nestedTuple.length).toBe(2)
      expect(nestedTuple[0]).toBeInstanceOf(Uint8Array)
      expect(Array.from(nestedTuple[0] as Uint8Array)).toEqual([3])
      expect(nestedTuple[1]).toBe(true)
    })
  })

  describe('Complex mixed structures', () => {
    test('should handle complex nested structures', () => {
      // Create (byte[2][],uint8,(bool,byte[3]))
      const outerTupleType = ABIType.from('(byte[2][],uint8,(bool,byte[3]))')

      const value = [
        [
          [1, 2],
          [3, 4],
          [5, 6],
        ], // byte[2][]
        123, // uint8
        [true, [7, 8, 9]], // (bool,byte[3])
      ]

      const encoded = outerTupleType.encode(value)
      const result = outerTupleType.decode(encoded) as ABIValue[]

      // Check first element (byte[2][])
      const byteArrays = result[0] as ABIValue[]
      expect(Array.isArray(byteArrays)).toBe(true)
      expect(byteArrays.length).toBe(3)
      byteArrays.forEach((item) => {
        expect(item).toBeInstanceOf(Uint8Array)
      })

      // Check second element (uint8)
      expect(result[1]).toBe(123)

      // Check third element (bool,byte[3])
      const tuple = result[2] as ABIValue[]
      expect(tuple[0]).toBe(true)
      expect(tuple[1]).toBeInstanceOf(Uint8Array)
      expect(Array.from(tuple[1] as Uint8Array)).toEqual([7, 8, 9])
    })
  })

  describe('Edge cases', () => {
    test('should handle empty byte arrays', () => {
      const arrayType = ABIType.from('byte[0]')

      const value: number[] = []
      const encoded = arrayType.encode(value)
      const result = arrayType.decode(encoded)

      expect(result).toBeInstanceOf(Uint8Array)
      expect((result as Uint8Array).length).toBe(0)
    })
  })

  test('should fail for bad values during encoding', () => {
    expect(() => new ABIUintType(8).encode(BigInt(-1))).toThrow()
    expect(() => new ABIUintType(512).encode(BigInt(2 ** 512))).toThrow()
    expect(() => new ABIUfixedType(512, 10).encode(BigInt(-1))).toThrow()
    expect(() => new ABIByteType().encode(-1)).toThrow()
    expect(() => new ABIByteType().encode(256)).toThrow()
    expect(() => new ABIAddressType().encode('BADADDRESS')).toThrow()
    expect(() => new ABIArrayStaticType(new ABIBoolType(), 3).encode([true])).toThrow()
    expect(() => new ABIArrayStaticType(new ABIStringType(), 1).encode([true])).toThrow()
    expect(() => new ABIArrayStaticType(new ABIUintType(256), 1).encode(['hello'])).toThrow()
    expect(() => new ABIArrayDynamicType(new ABIAddressType()).encode([false])).toThrow()
    expect(() => new ABITupleType([new ABIBoolType(), new ABIUfixedType(128, 20)]).encode([BigInt(3), true])).toThrow()
  })
})
