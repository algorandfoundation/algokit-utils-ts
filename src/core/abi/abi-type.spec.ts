import { describe, expect, test } from 'vitest'
import { ABIType, decodeABIValue, encodeABIValue, stringToABIType } from './abi-type'

describe('ABIType encode decode', () => {
  const basicTypeCases = [
    // Uint tests
    {
      description: 'uint8 with value 0',
      abiType: { name: 'Uint', bitSize: 8 } as ABIType,
      abiValue: 0n,
      expectedBytes: [0],
    },
    {
      description: 'uint16 with value 3',
      abiType: { name: 'Uint', bitSize: 16 } as ABIType,
      abiValue: 3n,
      expectedBytes: [0, 3],
    },
    {
      description: 'uint64 with value 256',
      abiType: { name: 'Uint', bitSize: 64 } as ABIType,
      abiValue: 256n,
      expectedBytes: [0, 0, 0, 0, 0, 0, 1, 0],
    },

    // Ufixed tests
    {
      description: 'ufixed8x30 with value 255',
      abiType: { name: 'Ufixed', bitSize: 8, precision: 30 } as ABIType,
      abiValue: 255n,
      expectedBytes: [255],
    },
    {
      description: 'ufixed32x10 with value 33',
      abiType: { name: 'Ufixed', bitSize: 32, precision: 10 } as ABIType,
      abiValue: 33n,
      expectedBytes: [0, 0, 0, 33],
    },

    // Address tests
    {
      description: 'address',
      abiType: { name: 'Address' } as ABIType,
      abiValue: 'MO2H6ZU47Q36GJ6GVHUKGEBEQINN7ZWVACMWZQGIYUOE3RBSRVYHV4ACJI',
      expectedBytes: [
        99, 180, 127, 102, 156, 252, 55, 227, 39, 198, 169, 232, 163, 16, 36, 130, 26, 223, 230, 213, 0, 153, 108, 192, 200, 197, 28, 77,
        196, 50, 141, 112,
      ],
    },

    // String tests
    {
      description: 'string with unicode',
      abiType: { name: 'String' } as ABIType,
      abiValue: 'What’s new',
      expectedBytes: [0, 12, 87, 104, 97, 116, 226, 128, 153, 115, 32, 110, 101, 119],
    },
    {
      description: 'string with emoji',
      abiType: { name: 'String' } as ABIType,
      abiValue: '😅🔨',
      expectedBytes: [0, 8, 240, 159, 152, 133, 240, 159, 148, 168],
    },
    {
      description: 'simple string',
      abiType: { name: 'String' } as ABIType,
      abiValue: 'asdf',
      expectedBytes: [0, 4, 97, 115, 100, 102],
    },

    // Byte tests
    {
      description: 'byte with value 10',
      abiType: { name: 'Byte' } as ABIType,
      abiValue: 10,
      expectedBytes: [10],
    },
    {
      description: 'byte with value 255',
      abiType: { name: 'Byte' } as ABIType,
      abiValue: 255,
      expectedBytes: [255],
    },

    // Bool tests
    {
      description: 'bool true',
      abiType: { name: 'Bool' } as ABIType,
      abiValue: true,
      expectedBytes: [128],
    },
    {
      description: 'bool false',
      abiType: { name: 'Bool' } as ABIType,
      abiValue: false,
      expectedBytes: [0],
    },

    // Static array tests
    {
      description: 'bool[3] array',
      abiType: { name: 'StaticArray', childType: { name: 'Bool' }, length: 3 } as ABIType,
      abiValue: [true, true, false],
      expectedBytes: [192],
    },
    {
      description: 'bool[8] array with 01000000',
      abiType: { name: 'StaticArray', childType: { name: 'Bool' }, length: 8 } as ABIType,
      abiValue: [false, true, false, false, false, false, false, false],
      expectedBytes: [64],
    },
    {
      description: 'bool[8] array with all true',
      abiType: { name: 'StaticArray', childType: { name: 'Bool' }, length: 8 } as ABIType,
      abiValue: [true, true, true, true, true, true, true, true],
      expectedBytes: [255],
    },
    {
      description: 'bool[9] array',
      abiType: { name: 'StaticArray', childType: { name: 'Bool' }, length: 9 } as ABIType,
      abiValue: [true, false, false, true, false, false, true, false, true],
      expectedBytes: [146, 128],
    },
    {
      description: 'uint64[3] array',
      abiType: { name: 'StaticArray', childType: { name: 'Uint', bitSize: 64 }, length: 3 } as ABIType,
      abiValue: [1n, 2n, 3n],
      expectedBytes: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 3],
    },

    // Dynamic array tests
    {
      description: 'empty bool[] array',
      abiType: { name: 'DynamicArray', childType: { name: 'Bool' } } as ABIType,
      abiValue: [],
      expectedBytes: [0, 0],
    },
    {
      description: 'bool[] array with 3 elements',
      abiType: { name: 'DynamicArray', childType: { name: 'Bool' } } as ABIType,
      abiValue: [true, true, false],
      expectedBytes: [0, 3, 192],
    },
    {
      description: 'bool[] array with 8 elements',
      abiType: { name: 'DynamicArray', childType: { name: 'Bool' } } as ABIType,
      abiValue: [false, true, false, false, false, false, false, false],
      expectedBytes: [0, 8, 64],
    },
    {
      description: 'bool[] array with 9 elements',
      abiType: { name: 'DynamicArray', childType: { name: 'Bool' } } as ABIType,
      abiValue: [true, false, false, true, false, false, true, false, true],
      expectedBytes: [0, 9, 146, 128],
    },
  ]

  const simpleTupleCases = [
    {
      description: 'tuple (uint8, uint16)',
      abiType: {
        name: 'Tuple',
        childTypes: [
          { name: 'Uint', bitSize: 8 },
          { name: 'Uint', bitSize: 16 },
        ],
      } as ABIType,
      abiValue: [1n, 2n],
      expectedBytes: [1, 0, 2],
    },
    {
      description: 'tuple (uint32, uint32)',
      abiType: {
        name: 'Tuple',
        childTypes: [
          { name: 'Uint', bitSize: 32 },
          { name: 'Uint', bitSize: 32 },
        ],
      } as ABIType,
      abiValue: [1n, 2n],
      expectedBytes: [0, 0, 0, 1, 0, 0, 0, 2],
    },
    {
      description: 'tuple (uint32, string)',
      abiType: { name: 'Tuple', childTypes: [{ name: 'Uint', bitSize: 32 }, { name: 'String' }] } as ABIType,
      abiValue: [42n, 'hello'],
      expectedBytes: [0, 0, 0, 42, 0, 6, 0, 5, 104, 101, 108, 108, 111],
    },
    {
      description: 'tuple (uint16, bool)',
      abiType: { name: 'Tuple', childTypes: [{ name: 'Uint', bitSize: 16 }, { name: 'Bool' }] } as ABIType,
      abiValue: [1234n, false],
      expectedBytes: [4, 210, 0],
    },
    {
      description: 'tuple (uint32, string, bool)',
      abiType: {
        name: 'Tuple',
        childTypes: [{ name: 'Uint', bitSize: 32 }, { name: 'String' }, { name: 'Bool' }],
      } as ABIType,
      abiValue: [42n, 'test', false],
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
      abiValue: [42n, [234, 'MO2H6ZU47Q36GJ6GVHUKGEBEQINN7ZWVACMWZQGIYUOE3RBSRVYHV4ACJI']],
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
    const abiType = stringToABIType(typeString)
    const expectedUint8Array = new Uint8Array(expectedBytes)

    const encoded = encodeABIValue(abiType, abiValue)
    expect(encoded).toEqual(expectedUint8Array)

    const decoded = decodeABIValue(abiType, encoded)
    expect(decoded).toEqual(abiValue)
  })

  test.each(nestedTupleCases)('should encode and decode $description using type string', ({ typeString, abiValue, expectedBytes }) => {
    const abiType = stringToABIType(typeString)
    const expectedUint8Array = new Uint8Array(expectedBytes)

    const encoded = encodeABIValue(abiType, abiValue)
    expect(encoded).toEqual(expectedUint8Array)

    const decoded = decodeABIValue(abiType, encoded)
    expect(decoded).toEqual(abiValue)
  })
})
