import algosdk from 'algosdk'
import { describe, expect, test } from 'vitest'
import { getABIStructFromABITuple } from '../../types/app-arc56'
import { ABIType, ABITypeName, decodeABIValue, encodeABIValue, getABIType } from './abi-type'
import { ABIValue } from './abi-value'
import { ABIStructType, ABIStructValue, ABITupleValue } from './types'

// TODO: discuss this
type TestCaseWithABIType = {
  description: string
  abiType: ABIType
  abiValue: ABIValue
  expectedBytes: number[]
}

type TestCaseWithTypeString = {
  description: string
  typeString: string
  abiValue: ABIValue
  expectedBytes: number[]
}

// .addMethodCall({
//   method: ...,
//   args: [
//     { type: ABITypeName.Uint, data: 0 },
//     { type: ABITypeName.Ufixed, data: 33 }
//   ]
// })

// .addMethodCall({
//   method: ...,
//   args: [ 0, 33 ]
// })

describe('ABIType encode decode', () => {
  const basicTypeCases = [
    // Uint tests
    {
      description: 'uint8 with value 0',
      abiType: { name: ABITypeName.Uint, bitSize: 8 },
      abiValue: { type: ABITypeName.Uint, data: 0 },
      expectedBytes: [0],
    },
    {
      description: 'uint16 with value 3',
      abiType: { name: ABITypeName.Uint, bitSize: 16 },
      abiValue: { type: ABITypeName.Uint, data: 3 },
      expectedBytes: [0, 3],
    },
    {
      description: 'uint64 with value 256',
      abiType: { name: ABITypeName.Uint, bitSize: 64 },
      abiValue: { type: ABITypeName.Uint, data: 256n },
      expectedBytes: [0, 0, 0, 0, 0, 0, 1, 0],
    },

    // Ufixed tests
    {
      description: 'ufixed8x30 with value 255',
      abiType: { name: ABITypeName.Ufixed, bitSize: 8, precision: 30 },
      abiValue: { type: ABITypeName.Ufixed, data: 255 },
      expectedBytes: [255],
    },
    {
      description: 'ufixed32x10 with value 33',
      abiType: { name: ABITypeName.Ufixed, bitSize: 32, precision: 10 } as ABIType,
      abiValue: { type: ABITypeName.Ufixed, data: 33 },
      expectedBytes: [0, 0, 0, 33],
    },

    // Address tests
    {
      description: 'address',
      abiType: { name: ABITypeName.Address } as ABIType,
      abiValue: { type: ABITypeName.Address, data: 'MO2H6ZU47Q36GJ6GVHUKGEBEQINN7ZWVACMWZQGIYUOE3RBSRVYHV4ACJI' },
      expectedBytes: [
        99, 180, 127, 102, 156, 252, 55, 227, 39, 198, 169, 232, 163, 16, 36, 130, 26, 223, 230, 213, 0, 153, 108, 192, 200, 197, 28, 77,
        196, 50, 141, 112,
      ],
    },

    // String tests
    {
      description: 'string with unicode',
      abiType: { name: ABITypeName.String } as ABIType,
      abiValue: { type: ABITypeName.String, data: "What's new" },
      expectedBytes: [0, 10, 87, 104, 97, 116, 39, 115, 32, 110, 101, 119],
    },
    {
      description: 'string with emoji',
      abiType: { name: ABITypeName.String } as ABIType,
      abiValue: { type: ABITypeName.String, data: '😅🔨' },
      expectedBytes: [0, 8, 240, 159, 152, 133, 240, 159, 148, 168],
    },
    {
      description: 'simple string',
      abiType: { name: ABITypeName.String } as ABIType,
      abiValue: { type: ABITypeName.String, data: 'asdf' },
      expectedBytes: [0, 4, 97, 115, 100, 102],
    },

    // Byte tests
    {
      description: 'byte with value 10',
      abiType: { name: ABITypeName.Byte } as ABIType,
      abiValue: { type: ABITypeName.Byte, data: 10 },
      expectedBytes: [10],
    },
    {
      description: 'byte with value 255',
      abiType: { name: ABITypeName.Byte } as ABIType,
      abiValue: { type: ABITypeName.Byte, data: 255 },
      expectedBytes: [255],
    },

    // Bool tests
    {
      description: 'bool true',
      abiType: { name: ABITypeName.Bool } as ABIType,
      abiValue: { type: ABITypeName.Bool, data: true },
      expectedBytes: [128],
    },
    {
      description: 'bool false',
      abiType: { name: ABITypeName.Bool } as ABIType,
      abiValue: { type: ABITypeName.Bool, data: false },
      expectedBytes: [0],
    },

    // Static array tests
    {
      description: 'bool[3] array',
      abiType: { name: ABITypeName.StaticArray, childType: { name: ABITypeName.Bool }, length: 3 } as ABIType,
      abiValue: {
        type: ABITypeName.StaticArray,
        data: [
          { type: ABITypeName.Bool, data: true },
          { type: ABITypeName.Bool, data: true },
          { type: ABITypeName.Bool, data: false },
        ],
      },
      expectedBytes: [192],
    },
    {
      description: 'bool[8] array with 01000000',
      abiType: { name: ABITypeName.StaticArray, childType: { name: ABITypeName.Bool }, length: 8 } as ABIType,
      abiValue: {
        type: ABITypeName.StaticArray,
        data: [
          { type: ABITypeName.Bool, data: false },
          { type: ABITypeName.Bool, data: true },
          { type: ABITypeName.Bool, data: false },
          { type: ABITypeName.Bool, data: false },
          { type: ABITypeName.Bool, data: false },
          { type: ABITypeName.Bool, data: false },
          { type: ABITypeName.Bool, data: false },
          { type: ABITypeName.Bool, data: false },
        ],
      },
      expectedBytes: [64],
    },
    {
      description: 'bool[8] array with all true',
      abiType: { name: ABITypeName.StaticArray, childType: { name: ABITypeName.Bool }, length: 8 } as ABIType,
      abiValue: {
        type: ABITypeName.StaticArray,
        data: [
          { type: ABITypeName.Bool, data: true },
          { type: ABITypeName.Bool, data: true },
          { type: ABITypeName.Bool, data: true },
          { type: ABITypeName.Bool, data: true },
          { type: ABITypeName.Bool, data: true },
          { type: ABITypeName.Bool, data: true },
          { type: ABITypeName.Bool, data: true },
          { type: ABITypeName.Bool, data: true },
        ],
      },
      expectedBytes: [255],
    },
    {
      description: 'bool[9] array',
      abiType: { name: ABITypeName.StaticArray, childType: { name: ABITypeName.Bool }, length: 9 } as ABIType,
      abiValue: {
        type: ABITypeName.StaticArray,
        data: [
          { type: ABITypeName.Bool, data: true },
          { type: ABITypeName.Bool, data: false },
          { type: ABITypeName.Bool, data: false },
          { type: ABITypeName.Bool, data: true },
          { type: ABITypeName.Bool, data: false },
          { type: ABITypeName.Bool, data: false },
          { type: ABITypeName.Bool, data: true },
          { type: ABITypeName.Bool, data: false },
          { type: ABITypeName.Bool, data: true },
        ],
      },
      expectedBytes: [146, 128],
    },
    {
      description: 'uint64[3] array',
      abiType: { name: ABITypeName.StaticArray, childType: { name: ABITypeName.Uint, bitSize: 64 }, length: 3 } as ABIType,
      abiValue: {
        type: ABITypeName.StaticArray,
        data: [
          { type: ABITypeName.Uint, data: 1n },
          { type: ABITypeName.Uint, data: 2n },
          { type: ABITypeName.Uint, data: 3n },
        ],
      },
      expectedBytes: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 3],
    },

    // Dynamic array tests
    {
      description: 'empty bool[] array',
      abiType: { name: ABITypeName.DynamicArray, childType: { name: ABITypeName.Bool } } as ABIType,
      abiValue: { type: ABITypeName.DynamicArray, data: [] },
      expectedBytes: [0, 0],
    },
    {
      description: 'bool[] array with 3 elements',
      abiType: { name: ABITypeName.DynamicArray, childType: { name: ABITypeName.Bool } } as ABIType,
      abiValue: {
        type: ABITypeName.DynamicArray,
        data: [
          { type: ABITypeName.Bool, data: true },
          { type: ABITypeName.Bool, data: true },
          { type: ABITypeName.Bool, data: false },
        ],
      },
      expectedBytes: [0, 3, 192],
    },
    {
      description: 'bool[] array with 8 elements',
      abiType: { name: ABITypeName.DynamicArray, childType: { name: ABITypeName.Bool } } as ABIType,
      abiValue: {
        type: ABITypeName.DynamicArray,
        data: [
          { type: ABITypeName.Bool, data: false },
          { type: ABITypeName.Bool, data: true },
          { type: ABITypeName.Bool, data: false },
          { type: ABITypeName.Bool, data: false },
          { type: ABITypeName.Bool, data: false },
          { type: ABITypeName.Bool, data: false },
          { type: ABITypeName.Bool, data: false },
          { type: ABITypeName.Bool, data: false },
        ],
      },
      expectedBytes: [0, 8, 64],
    },
    {
      description: 'bool[] array with 9 elements',
      abiType: { name: ABITypeName.DynamicArray, childType: { name: ABITypeName.Bool } } as ABIType,
      abiValue: {
        type: ABITypeName.DynamicArray,
        data: [
          { type: ABITypeName.Bool, data: true },
          { type: ABITypeName.Bool, data: false },
          { type: ABITypeName.Bool, data: false },
          { type: ABITypeName.Bool, data: true },
          { type: ABITypeName.Bool, data: false },
          { type: ABITypeName.Bool, data: false },
          { type: ABITypeName.Bool, data: true },
          { type: ABITypeName.Bool, data: false },
          { type: ABITypeName.Bool, data: true },
        ],
      },
      expectedBytes: [0, 9, 146, 128],
    },
  ] satisfies TestCaseWithABIType[]

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
      abiValue: {
        type: ABITypeName.Tuple,
        data: [
          { type: ABITypeName.Uint, data: 1 },
          { type: ABITypeName.Uint, data: 2 },
        ],
      } satisfies ABITupleValue,
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
      abiValue: {
        type: ABITypeName.Tuple,
        data: [
          { type: ABITypeName.Uint, data: 1 },
          { type: ABITypeName.Uint, data: 2 },
        ],
      } satisfies ABITupleValue,
      expectedBytes: [0, 0, 0, 1, 0, 0, 0, 2],
    },
    {
      description: 'tuple (uint32, string)',
      abiType: { name: ABITypeName.Tuple, childTypes: [{ name: ABITypeName.Uint, bitSize: 32 }, { name: ABITypeName.String }] } as ABIType,
      abiValue: {
        type: ABITypeName.Tuple,
        data: [
          { type: ABITypeName.Uint, data: 42 },
          { type: ABITypeName.String, data: 'hello' },
        ],
      } satisfies ABITupleValue,
      expectedBytes: [0, 0, 0, 42, 0, 6, 0, 5, 104, 101, 108, 108, 111],
    },
    {
      description: 'tuple (uint16, bool)',
      abiType: { name: ABITypeName.Tuple, childTypes: [{ name: ABITypeName.Uint, bitSize: 16 }, { name: ABITypeName.Bool }] } as ABIType,
      abiValue: {
        type: ABITypeName.Tuple,
        data: [
          { type: ABITypeName.Uint, data: 1234 },
          { type: ABITypeName.Bool, data: false },
        ],
      } satisfies ABITupleValue,
      expectedBytes: [4, 210, 0],
    },
    {
      description: 'tuple (uint32, string, bool)',
      abiType: {
        name: ABITypeName.Tuple,
        childTypes: [{ name: ABITypeName.Uint, bitSize: 32 }, { name: ABITypeName.String }, { name: ABITypeName.Bool }],
      } as ABIType,
      abiValue: {
        type: ABITypeName.Tuple,
        data: [
          { type: ABITypeName.Uint, data: 42 },
          { type: ABITypeName.String, data: 'test' },
          { type: ABITypeName.Bool, data: false },
        ],
      } satisfies ABITupleValue,
      expectedBytes: [0, 0, 0, 42, 0, 7, 0, 0, 4, 116, 101, 115, 116],
    },
  ] satisfies TestCaseWithABIType[]

  const complexTupleCases = [
    {
      description: 'empty tuple',
      typeString: '()',
      abiValue: {
        type: ABITypeName.Tuple,
        data: [],
      } satisfies ABITupleValue,
      expectedBytes: [],
    },
    {
      description: 'triple bool tuple',
      typeString: '(bool,bool,bool)',
      abiValue: {
        type: ABITypeName.Tuple,
        data: [
          { type: ABITypeName.Bool, data: false },
          { type: ABITypeName.Bool, data: true },
          { type: ABITypeName.Bool, data: true },
        ],
      } satisfies ABITupleValue,
      expectedBytes: [96],
    },
    {
      description: 'tuple with bool[3]',
      typeString: '(bool[3])',
      abiValue: {
        type: ABITypeName.Tuple,
        data: [
          {
            type: ABITypeName.StaticArray,
            data: [
              { type: ABITypeName.Bool, data: false },
              { type: ABITypeName.Bool, data: true },
              { type: ABITypeName.Bool, data: true },
            ],
          },
        ],
      } satisfies ABITupleValue,
      expectedBytes: [96],
    },
    {
      description: 'tuple with bool[]',
      typeString: '(bool[])',
      abiValue: {
        type: ABITypeName.Tuple,
        data: [
          {
            type: ABITypeName.DynamicArray,
            data: [
              { type: ABITypeName.Bool, data: false },
              { type: ABITypeName.Bool, data: true },
              { type: ABITypeName.Bool, data: true },
            ],
          },
        ],
      } satisfies ABITupleValue,
      expectedBytes: [0, 2, 0, 3, 96],
    },
    {
      description: 'tuple with bool[2] and bool[]',
      typeString: '(bool[2],bool[])',
      abiValue: {
        type: ABITypeName.Tuple,
        data: [
          {
            type: ABITypeName.StaticArray,
            data: [
              { type: ABITypeName.Bool, data: true },
              { type: ABITypeName.Bool, data: true },
            ],
          },
          {
            type: ABITypeName.DynamicArray,
            data: [
              { type: ABITypeName.Bool, data: true },
              { type: ABITypeName.Bool, data: true },
            ],
          },
        ],
      } satisfies ABITupleValue,
      expectedBytes: [192, 0, 3, 0, 2, 192],
    },
    {
      description: 'tuple with two empty bool[]',
      typeString: '(bool[],bool[])',
      abiValue: {
        type: ABITypeName.Tuple,
        data: [
          {
            type: ABITypeName.DynamicArray,
            data: [],
          },
          {
            type: ABITypeName.DynamicArray,
            data: [],
          },
        ],
      } satisfies ABITupleValue,
      expectedBytes: [0, 4, 0, 6, 0, 0, 0, 0],
    },
    {
      description: 'complex tuple with strings and bools',
      typeString: '(string,bool,bool,bool,bool,string)',
      abiValue: {
        type: ABITypeName.Tuple,
        data: [
          { type: ABITypeName.String, data: 'AB' },
          { type: ABITypeName.Bool, data: true },
          { type: ABITypeName.Bool, data: false },
          { type: ABITypeName.Bool, data: true },
          { type: ABITypeName.Bool, data: false },
          { type: ABITypeName.String, data: 'DE' },
        ],
      } satisfies ABITupleValue,
      expectedBytes: [0, 5, 160, 0, 9, 0, 2, 65, 66, 0, 2, 68, 69],
    },
  ] satisfies TestCaseWithTypeString[]

  const nestedTupleCases = [
    {
      description: 'nested tuple (uint16, (byte, address))',
      typeString: '(uint16,(byte,address))',
      abiValue: {
        type: ABITypeName.Tuple,
        data: [
          { type: ABITypeName.Uint, data: 42 },
          {
            type: ABITypeName.Tuple,
            data: [
              { type: ABITypeName.Byte, data: 234 },
              { type: ABITypeName.Address, data: 'MO2H6ZU47Q36GJ6GVHUKGEBEQINN7ZWVACMWZQGIYUOE3RBSRVYHV4ACJI' },
            ],
          },
        ],
      } satisfies ABITupleValue,
      expectedBytes: [
        0, 42, 234, 99, 180, 127, 102, 156, 252, 55, 227, 39, 198, 169, 232, 163, 16, 36, 130, 26, 223, 230, 213, 0, 153, 108, 192, 200,
        197, 28, 77, 196, 50, 141, 112,
      ],
    },
  ] satisfies TestCaseWithTypeString[]

  test.each(basicTypeCases)('should encode and decode $description', ({ abiType, abiValue, expectedBytes }: TestCaseWithABIType) => {
    const expectedUint8Array = new Uint8Array(expectedBytes)

    const encoded = encodeABIValue(abiType, abiValue)
    expect(encoded).toEqual(expectedUint8Array)

    const decoded = decodeABIValue(abiType, encoded)
    expect(decoded).toEqual(abiValue)
  })

  test.each(simpleTupleCases)('should encode and decode $description', ({ abiType, abiValue, expectedBytes }: TestCaseWithABIType) => {
    const expectedUint8Array = new Uint8Array(expectedBytes)

    const encoded = encodeABIValue(abiType, abiValue)
    expect(encoded).toEqual(expectedUint8Array)

    const decoded = decodeABIValue(abiType, encoded)
    expect(decoded).toEqual(abiValue)
  })

  test.each(complexTupleCases)(
    'should encode and decode $description using type string',
    ({ typeString, abiValue, expectedBytes }: TestCaseWithTypeString) => {
      const abiType = getABIType(typeString)
      const expectedUint8Array = new Uint8Array(expectedBytes)

      const encoded = encodeABIValue(abiType, abiValue)
      expect(encoded).toEqual(expectedUint8Array)

      const decoded = decodeABIValue(abiType, encoded)
      expect(decoded).toEqual(abiValue)
    },
  )

  test.each(nestedTupleCases)(
    'should encode and decode $description using type string',
    ({ typeString, abiValue, expectedBytes }: TestCaseWithTypeString) => {
      const abiType = getABIType(typeString)
      const expectedUint8Array = new Uint8Array(expectedBytes)

      const encoded = encodeABIValue(abiType, abiValue)
      expect(encoded).toEqual(expectedUint8Array)

      const decoded = decodeABIValue(abiType, encoded)
      expect(decoded).toEqual(abiValue)
    },
  )
})

describe('Struct encode decode', () => {
  test('foo', () => {
    const tupleType = getABIType('(uint8,(uint16,string,string[]),bool,(byte,address))')
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
            // Hmm?
            {
              name: 'field 3 child 1',
              type: {
                name: ABITypeName.Bool,
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

    const tupleValue = {
      type: ABITypeName.Tuple,
      data: [
        {
          type: ABITypeName.Uint,
          data: 123,
        },
        {
          type: ABITypeName.Tuple,
          data: [
            {
              type: ABITypeName.Uint,
              data: 65432,
            },
            {
              type: ABITypeName.String,
              data: 'hello',
            },
            {
              type: ABITypeName.DynamicArray,
              data: [
                {
                  type: ABITypeName.String,
                  data: 'world 1',
                },
                {
                  type: ABITypeName.String,
                  data: 'world 2',
                },
                {
                  type: ABITypeName.String,
                  data: 'world 3',
                },
              ],
            },
          ],
        },
        {
          type: ABITypeName.Bool,
          data: false,
        },
        {
          type: ABITypeName.Tuple,
          data: [
            {
              type: ABITypeName.Byte,
              data: 222,
            },
            {
              type: ABITypeName.Address,
              data: 'BEKKSMPBTPIGBYJGKD4XK7E7ZQJNZIHJVYFQWW3HNI32JHSH3LOGBRY3LE',
            },
          ],
        },
      ],
    } satisfies ABITupleValue
    const structValue = {
      type: ABITypeName.Struct,
      data: {
        'field 1': {
          type: ABITypeName.Uint,
          data: 123,
        },
        'field 2': {
          type: ABITypeName.Struct,
          data: {
            'Struct 2 field 1': {
              type: ABITypeName.Uint,
              data: 65432,
            },
            'Struct 2 field 2': {
              type: ABITypeName.String,
              data: 'hello',
            },
            'Struct 2 field 3': {
              type: ABITypeName.DynamicArray,
              data: [
                {
                  type: ABITypeName.String,
                  data: 'world 1',
                },
                {
                  type: ABITypeName.String,
                  data: 'world 2',
                },
                {
                  type: ABITypeName.String,
                  data: 'world 3',
                },
              ],
            },
          },
        },
        'field 3': {
          type: ABITypeName.Struct,
          data: {
            'field 3 child 1': {
              data: false,
              type: ABITypeName.Bool,
            },
          },
        },
        'field 4': {
          type: ABITypeName.Tuple,
          data: [
            {
              type: ABITypeName.Byte,
              data: 222,
            },
            {
              type: ABITypeName.Address,
              data: 'BEKKSMPBTPIGBYJGKD4XK7E7ZQJNZIHJVYFQWW3HNI32JHSH3LOGBRY3LE',
            },
          ],
        },
      },
    } satisfies ABIStructValue

    const encodedTuple = encodeABIValue(tupleType, tupleValue)
    const encodedStruct = encodeABIValue(structType, structValue)

    expect(encodedTuple).toEqual([1])
    expect(encodedTuple).toEqual(encodedStruct)

    const decodedTuple = decodeABIValue(tupleType, encodedTuple)
    expect(decodedTuple).toEqual(tupleValue)

    const decodedStruct = decodeABIValue(structType, encodedStruct)
    expect(decodedStruct).toEqual(structValue)
  })

  test('compare with old', () => {
    const structs = {
      'Struct 1': [
        {
          name: 'field 1',
          type: 'uint8',
        },
        {
          name: 'field 2',
          type: 'Struct 2',
        },
        {
          name: 'field 3',
          type: [
            {
              name: 'field 3 child 1',
              type: 'bool',
            },
            {
              name: 'field 3 child 2',
              type: 'byte',
            },
          ],
        },
        {
          name: 'field 4',
          type: '(byte,address)',
        },
      ],
      'Struct 2': [
        {
          name: 'Struct 2 field 1',
          type: 'uint16',
        },
        {
          name: 'Struct 2 field 2',
          type: 'string',
        },
        {
          name: 'Struct 2 field 3',
          type: 'string[]',
        },
      ],
    }

    const tupleType = algosdk.ABIType.from('(uint8,(uint16,string,string[]),(bool,byte),(byte,address))')

    const encodedTuple = Uint8Array.from([
      123, 0, 37, 0, 222, 9, 20, 169, 49, 225, 155, 208, 96, 225, 38, 80, 249, 117, 124, 159, 204, 18, 220, 160, 233, 174, 11, 11, 91, 103,
      106, 55, 164, 158, 71, 218, 220, 255, 152, 0, 6, 0, 13, 0, 5, 104, 101, 108, 108, 111, 0, 3, 0, 6, 0, 15, 0, 24, 0, 7, 119, 111, 114,
      108, 100, 32, 49, 0, 7, 119, 111, 114, 108, 100, 32, 50, 0, 7, 119, 111, 114, 108, 100, 32, 51,
    ])

    const tupleValue = tupleType.decode(encodedTuple)
    const structValue = getABIStructFromABITuple(tupleValue as algosdk.ABIValue[], structs['Struct 1'], structs)

    //     Object {
    //   "field 1": 123,
    //   "field 2": Object {
    //     "Struct 2 field 1": 65432,
    //     "Struct 2 field 2": "hello",
    //     "Struct 2 field 3": Array [
    //       "world 1",
    //       "world 2",
    //       "world 3",
    //     ],
    //   },
    //   "field 3": false,
    //   "field 4": Array [
    //     222,
    //     "BEKKSMPBTPIGBYJGKD4XK7E7ZQJNZIHJVYFQWW3HNI32JHSH3LOGBRY3LE",
    //   ],
    // }
    expect(structValue).toBe({})
  })
})

// TODO: plan for consistency across language, mention FFI custom types

// addMethodCall({}) => [txns]
// gatherSigns()
// sign([txns]) => [signed_txns]

// FFIComposer {
//   add_method_call(txn: FFITxn)
// }

// PythonComposer {
//   add_method_call(txn: PythonTxn) {
//     ffi_txn = mapPythonTxnToFFI()
//     _composer.add_method_call(ffi_txn)
//   }
// }
