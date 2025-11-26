import { describe, expect, test } from 'vitest'
import type { ABIStructType } from './abi-type'
import { ABIType, ABITypeName, decodeABIValue, encodeABIValue, getABIType } from './abi-type'
import { ABIStructValue, ABIValue } from './abi-value'
import { Address } from '@algorandfoundation/algokit-common'

describe('ABIType encode decode', () => {
  const basicTypeCases = [
    // Uint tests
    {
      description: 'uint8 with value 0',
      abiType: { name: ABITypeName.Uint, bitSize: 8 } as ABIType,
      abiValue: 0,
      expectedBytes: [0],
    },
    {
      description: 'uint16 with value 3',
      abiType: { name: ABITypeName.Uint, bitSize: 16 } as ABIType,
      abiValue: 3,
      expectedBytes: [0, 3],
    },
    {
      description: 'uint64 with value 256',
      abiType: { name: ABITypeName.Uint, bitSize: 64 } as ABIType,
      abiValue: 256n,
      expectedBytes: [0, 0, 0, 0, 0, 0, 1, 0],
    },

    // Ufixed tests
    {
      description: 'ufixed8x30 with value 255',
      abiType: { name: ABITypeName.Ufixed, bitSize: 8, precision: 30 } as ABIType,
      abiValue: 255,
      expectedBytes: [255],
    },
    {
      description: 'ufixed32x10 with value 33',
      abiType: { name: ABITypeName.Ufixed, bitSize: 32, precision: 10 } as ABIType,
      abiValue: 33,
      expectedBytes: [0, 0, 0, 33],
    },

    // Address tests
    {
      description: 'address',
      abiType: { name: ABITypeName.Address } as ABIType,
      abiValue: Address.fromString('MO2H6ZU47Q36GJ6GVHUKGEBEQINN7ZWVACMWZQGIYUOE3RBSRVYHV4ACJI'),
      expectedBytes: [
        99, 180, 127, 102, 156, 252, 55, 227, 39, 198, 169, 232, 163, 16, 36, 130, 26, 223, 230, 213, 0, 153, 108, 192, 200, 197, 28, 77,
        196, 50, 141, 112,
      ],
    },

    // String tests
    {
      description: 'string with unicode',
      abiType: { name: ABITypeName.String } as ABIType,
      abiValue: 'What’s new',
      expectedBytes: [0, 12, 87, 104, 97, 116, 226, 128, 153, 115, 32, 110, 101, 119],
    },
    {
      description: 'string with emoji',
      abiType: { name: ABITypeName.String } as ABIType,
      abiValue: '😅🔨',
      expectedBytes: [0, 8, 240, 159, 152, 133, 240, 159, 148, 168],
    },
    {
      description: 'simple string',
      abiType: { name: ABITypeName.String } as ABIType,
      abiValue: 'asdf',
      expectedBytes: [0, 4, 97, 115, 100, 102],
    },

    // Byte tests
    {
      description: 'byte with value 10',
      abiType: { name: ABITypeName.Byte } as ABIType,
      abiValue: 10,
      expectedBytes: [10],
    },
    {
      description: 'byte with value 255',
      abiType: { name: ABITypeName.Byte } as ABIType,
      abiValue: 255,
      expectedBytes: [255],
    },

    // Bool tests
    {
      description: 'bool true',
      abiType: { name: ABITypeName.Bool } as ABIType,
      abiValue: true,
      expectedBytes: [128],
    },
    {
      description: 'bool false',
      abiType: { name: ABITypeName.Bool } as ABIType,
      abiValue: false,
      expectedBytes: [0],
    },

    // Static array tests
    {
      description: 'bool[3] array',
      abiType: { name: ABITypeName.StaticArray, childType: { name: ABITypeName.Bool }, length: 3 } as ABIType,
      abiValue: [true, true, false],
      expectedBytes: [192],
    },
    {
      description: 'bool[8] array with 01000000',
      abiType: { name: ABITypeName.StaticArray, childType: { name: ABITypeName.Bool }, length: 8 } as ABIType,
      abiValue: [false, true, false, false, false, false, false, false],
      expectedBytes: [64],
    },
    {
      description: 'bool[8] array with all true',
      abiType: { name: ABITypeName.StaticArray, childType: { name: ABITypeName.Bool }, length: 8 } as ABIType,
      abiValue: [true, true, true, true, true, true, true, true],
      expectedBytes: [255],
    },
    {
      description: 'bool[9] array',
      abiType: { name: ABITypeName.StaticArray, childType: { name: ABITypeName.Bool }, length: 9 } as ABIType,
      abiValue: [true, false, false, true, false, false, true, false, true],
      expectedBytes: [146, 128],
    },
    {
      description: 'uint64[3] array',
      abiType: { name: ABITypeName.StaticArray, childType: { name: ABITypeName.Uint, bitSize: 64 }, length: 3 } as ABIType,
      abiValue: [1n, 2n, 3n],
      expectedBytes: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 3],
    },

    // Dynamic array tests
    {
      description: 'empty bool[] array',
      abiType: { name: ABITypeName.DynamicArray, childType: { name: ABITypeName.Bool } } as ABIType,
      abiValue: [],
      expectedBytes: [0, 0],
    },
    {
      description: 'bool[] array with 3 elements',
      abiType: { name: ABITypeName.DynamicArray, childType: { name: ABITypeName.Bool } } as ABIType,
      abiValue: [true, true, false],
      expectedBytes: [0, 3, 192],
    },
    {
      description: 'bool[] array with 8 elements',
      abiType: { name: ABITypeName.DynamicArray, childType: { name: ABITypeName.Bool } } as ABIType,
      abiValue: [false, true, false, false, false, false, false, false],
      expectedBytes: [0, 8, 64],
    },
    {
      description: 'bool[] array with 9 elements',
      abiType: { name: ABITypeName.DynamicArray, childType: { name: ABITypeName.Bool } } as ABIType,
      abiValue: [true, false, false, true, false, false, true, false, true],
      expectedBytes: [0, 9, 146, 128],
    },
  ]

  const simpleTupleCases = [
    {
      description: 'tuple (uint8, uint16)',
      abiType: {
        name: ABITypeName.Tuple,
        childTypes: [
          { name: ABITypeName.Uint, bitSize: 8 },
          { name: ABITypeName.Uint, bitSize: 16 },
        ],
      } as ABIType,
      abiValue: [1, 2],
      expectedBytes: [1, 0, 2],
    },
    {
      description: 'tuple (uint32, uint32)',
      abiType: {
        name: ABITypeName.Tuple,
        childTypes: [
          { name: ABITypeName.Uint, bitSize: 32 },
          { name: ABITypeName.Uint, bitSize: 32 },
        ],
      } as ABIType,
      abiValue: [1, 2],
      expectedBytes: [0, 0, 0, 1, 0, 0, 0, 2],
    },
    {
      description: 'tuple (uint32, string)',
      abiType: { name: ABITypeName.Tuple, childTypes: [{ name: ABITypeName.Uint, bitSize: 32 }, { name: ABITypeName.String }] } as ABIType,
      abiValue: [42, 'hello'],
      expectedBytes: [0, 0, 0, 42, 0, 6, 0, 5, 104, 101, 108, 108, 111],
    },
    {
      description: 'tuple (uint16, bool)',
      abiType: { name: ABITypeName.Tuple, childTypes: [{ name: ABITypeName.Uint, bitSize: 16 }, { name: ABITypeName.Bool }] } as ABIType,
      abiValue: [1234, false],
      expectedBytes: [4, 210, 0],
    },
    {
      description: 'tuple (uint32, string, bool)',
      abiType: {
        name: ABITypeName.Tuple,
        childTypes: [{ name: ABITypeName.Uint, bitSize: 32 }, { name: ABITypeName.String }, { name: ABITypeName.Bool }],
      } as ABIType,
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

    const encoded = encodeABIValue(abiType, abiValue)
    expect(encoded).toEqual(expectedUint8Array)

    const decoded = decodeABIValue(abiType, encoded)
    expect(decoded).toEqual(abiValue)
  })

  test.each(simpleTupleCases)('should encode and decode $description', ({ abiType, abiValue, expectedBytes }) => {
    const expectedUint8Array = new Uint8Array(expectedBytes)

    const encoded = encodeABIValue(abiType, abiValue)
    expect(encoded).toEqual(expectedUint8Array)

    const decoded = decodeABIValue(abiType, encoded)
    expect(decoded).toEqual(abiValue)
  })

  test.each(complexTupleCases)('should encode and decode $description using type string', ({ typeString, abiValue, expectedBytes }) => {
    const abiType = getABIType(typeString)
    const expectedUint8Array = new Uint8Array(expectedBytes)

    const encoded = encodeABIValue(abiType, abiValue)
    expect(encoded).toEqual(expectedUint8Array)

    const decoded = decodeABIValue(abiType, encoded)
    expect(decoded).toEqual(abiValue)
  })

  test.each(nestedTupleCases)('should encode and decode $description using type string', ({ typeString, abiValue, expectedBytes }) => {
    const abiType = getABIType(typeString)
    const expectedUint8Array = new Uint8Array(expectedBytes)

    const encoded = encodeABIValue(abiType, abiValue)
    expect(encoded).toEqual(expectedUint8Array)

    const decoded = decodeABIValue(abiType, encoded)
    expect(decoded).toEqual(abiValue)
  })

  test.each(
    // Generate all valid ABI uint bit lengths
    Array.from({ length: 64 }, (_, i) => (i + 1) * 8),
  )('correctly decodes a uint%i', (bitLength) => {
    const encoded = encodeABIValue({ name: ABITypeName.Uint, bitSize: bitLength }, 1)
    const decoded = decodeABIValue(getABIType(`uint${bitLength}`), encoded)

    if (bitLength < 53) {
      expect(typeof decoded).toBe('number')
      expect(decoded).toBe(1)
    } else {
      expect(typeof decoded).toBe('bigint')
      expect(decoded).toBe(1n)
    }
  })

  test('Struct and tuple encode decode should match', () => {
    const tupleType = getABIType('(uint8,(uint16,string,string[]),(bool,byte),(byte,address))')
    const structType = {
      name: ABITypeName.Struct,
      structName: 'Struct 1',
      structFields: [
        {
          name: 'field 1',
          type: {
            name: ABITypeName.Uint,
            bitSize: 8,
          },
        },
        {
          name: 'field 2',
          type: {
            name: ABITypeName.Struct,
            structName: 'Struct 2',
            structFields: [
              {
                name: 'Struct 2 field 1',
                type: {
                  name: ABITypeName.Uint,
                  bitSize: 16,
                },
              },
              {
                name: 'Struct 2 field 2',
                type: {
                  name: ABITypeName.String,
                },
              },
              {
                name: 'Struct 2 field 3',
                type: {
                  name: ABITypeName.DynamicArray,
                  childType: {
                    name: ABITypeName.String,
                  },
                },
              },
            ],
          },
        },
        {
          name: 'field 3',
          type: [
            {
              name: 'field 3 child 1',
              type: {
                name: ABITypeName.Bool,
              },
            },
            {
              name: 'field 3 child 2',
              type: {
                name: ABITypeName.Byte,
              },
            },
          ],
        },
        {
          name: 'field 4',
          type: {
            name: ABITypeName.Tuple,
            childTypes: [{ name: ABITypeName.Byte }, { name: ABITypeName.Address }],
          },
        },
      ],
    } satisfies ABIStructType

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

    const encodedTuple = encodeABIValue(tupleType, tupleValue)
    const encodedStruct = encodeABIValue(structType, structValue)

    expect(encodedTuple).toEqual(encodedStruct)

    const decodedTuple = decodeABIValue(tupleType, encodedTuple)
    expect(decodedTuple).toEqual(tupleValue)

    const decodedStruct = decodeABIValue(structType, encodedTuple)
    expect(decodedStruct).toEqual(structValue)
  })

  test('correctly decodes a struct containing a uint16', () => {
    const userStruct = {
      name: ABITypeName.Struct,
      structName: 'User',
      structFields: [
        {
          name: 'userId',
          type: getABIType('uint16'),
        },
        { name: 'name', type: getABIType('string') },
      ],
    } satisfies ABIStructType

    const decoded = decodeABIValue(userStruct, new Uint8Array([0, 1, 0, 4, 0, 5, 119, 111, 114, 108, 100])) as {
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
      const arrayType = getABIType('byte[4]')

      const value = [1, 2, 3, 4]
      const encoded = encodeABIValue(arrayType, value)
      const result = decodeABIValue(arrayType, encoded)

      expect(result).toBeInstanceOf(Uint8Array)
      expect(Array.from(result as Uint8Array)).toEqual([1, 2, 3, 4])
    })

    test('should handle dynamic byte arrays', () => {
      // Create a dynamic array of bytes: byte[]
      const arrayType = getABIType('byte[]')

      const value = [10, 20, 30, 40, 50]
      const encoded = encodeABIValue(arrayType, value)
      const result = decodeABIValue(arrayType, encoded)

      expect(result).toBeInstanceOf(Uint8Array)
      expect(Array.from(result as Uint8Array)).toEqual([10, 20, 30, 40, 50])
    })

    test('should return existing Uint8Array as is', () => {
      const arrayType = getABIType('byte[3]')

      const value = new Uint8Array([5, 6, 7])
      const encoded = encodeABIValue(arrayType, value)
      const result = decodeABIValue(arrayType, encoded)

      expect(result).toEqual(value)
    })
  })

  describe('Nested arrays', () => {
    test('should convert byte arrays inside arrays', () => {
      // Create byte[2][]
      const outerArrayType = getABIType('byte[2][]')

      const value = [
        [1, 2],
        [3, 4],
        [5, 6],
      ]
      const encoded = encodeABIValue(outerArrayType, value)
      const result = decodeABIValue(outerArrayType, encoded) as ABIValue[]

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
      const arrayType = getABIType('uint8[3]')

      const value = [1, 2, 3]
      const encoded = encodeABIValue(arrayType, value)
      const result = decodeABIValue(arrayType, encoded)

      expect(Array.isArray(result)).toBe(true)
      expect(result).toEqual([1, 2, 3])
    })
  })

  describe('Tuple tests', () => {
    test('should handle tuples with byte arrays', () => {
      // Create (byte[2],bool,byte[3])
      const tupleType = getABIType('(byte[2],bool,byte[3])')

      const value = [[1, 2], true, [3, 4, 5]]
      const encoded = encodeABIValue(tupleType, value)
      const result = decodeABIValue(tupleType, encoded) as ABIValue[]

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
      const outerTupleType = getABIType('(byte[2],(byte[1],bool))')

      const value = [
        [1, 2],
        [[3], true],
      ]
      const encoded = encodeABIValue(outerTupleType, value)
      const result = decodeABIValue(outerTupleType, encoded) as ABIValue[]

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
      const outerTupleType = getABIType('(byte[2][],uint8,(bool,byte[3]))')

      const value = [
        [
          [1, 2],
          [3, 4],
          [5, 6],
        ], // byte[2][]
        123, // uint8
        [true, [7, 8, 9]], // (bool,byte[3])
      ]

      const encoded = encodeABIValue(outerTupleType, value)
      const result = decodeABIValue(outerTupleType, encoded) as ABIValue[]

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
      const arrayType = getABIType('byte[0]')

      const value: number[] = []
      const encoded = encodeABIValue(arrayType, value)
      const result = decodeABIValue(arrayType, encoded)

      expect(result).toBeInstanceOf(Uint8Array)
      expect((result as Uint8Array).length).toBe(0)
    })
  })
})

// TODO: add failed tests
