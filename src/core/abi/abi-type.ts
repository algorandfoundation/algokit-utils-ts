import { ABIValue } from './abi-value'
import {
  ABIAddressType,
  ABIBoolType,
  ABIByteType,
  ABIDynamicArrayType,
  ABIStaticArrayType,
  ABIStringType,
  ABITupleType,
  ABIUfixedType,
  ABIUintType,
  decodeAddress,
  decodeBool,
  decodeByte,
  decodeDynamicArray,
  decodeStaticArray,
  decodeString,
  decodeTuple,
  decodeUfixed,
  decodeUint,
  dynamicArrayToString,
  encodeAddress,
  encodeBool,
  encodeByte,
  encodeDynamicArray,
  encodeStaticArray,
  encodeString,
  encodeTuple,
  encodeUfixed,
  encodeUint,
  staticArrayToString,
  tupleToString,
  ufixedToString,
  uintToString,
} from './types/'

export enum ABITypeName {
  Uint = 'Uint',
  Ufixed = 'Ufixed',
  Address = 'Address',
  Bool = 'Bool',
  Byte = 'Byte',
  String = 'String',
  Tuple = 'Tuple',
  StaticArray = 'StaticArray',
  DynamicArray = 'DynamicArray',
}

export type ABIType =
  | ABIUintType
  | ABIUfixedType
  | ABIAddressType
  | ABIBoolType
  | ABIByteType
  | ABIStringType
  | ABITupleType
  | ABIStaticArrayType
  | ABIDynamicArrayType

export function encodeABIValue(abiType: ABIType, value: ABIValue): Uint8Array {
  switch (abiType.name) {
    case ABITypeName.Uint:
      return encodeUint(abiType, value)
    case ABITypeName.Ufixed:
      return encodeUfixed(abiType, value)
    case ABITypeName.Address:
      return encodeAddress(value)
    case ABITypeName.Bool:
      return encodeBool(value)
    case ABITypeName.Byte:
      return encodeByte(value)
    case ABITypeName.String:
      return encodeString(value)
    case ABITypeName.Tuple:
      return encodeTuple(abiType, value)
    case ABITypeName.StaticArray:
      return encodeStaticArray(abiType, value)
    case ABITypeName.DynamicArray:
      return encodeDynamicArray(abiType, value)
  }
}

export function decodeABIValue(abiType: ABIType, encodedValue: Uint8Array): ABIValue {
  switch (abiType.name) {
    case ABITypeName.Uint:
      return decodeUint(abiType, encodedValue)
    case ABITypeName.Ufixed:
      return decodeUfixed(abiType, encodedValue)
    case ABITypeName.Address:
      return decodeAddress(encodedValue)
    case ABITypeName.Bool:
      return decodeBool(encodedValue)
    case ABITypeName.Byte:
      return decodeByte(encodedValue)
    case ABITypeName.String:
      return decodeString(abiType, encodedValue)
    case ABITypeName.Tuple:
      return decodeTuple(abiType, encodedValue)
    case ABITypeName.StaticArray:
      return decodeStaticArray(abiType, encodedValue)
    case ABITypeName.DynamicArray:
      return decodeDynamicArray(abiType, encodedValue)
  }
}

export function aBITypeToString(abiType: ABIType): string {
  switch (abiType.name) {
    case ABITypeName.Uint:
      return uintToString(abiType)
    case ABITypeName.Ufixed:
      return ufixedToString(abiType)
    case ABITypeName.Address:
      return 'adress'
    case ABITypeName.Bool:
      return 'bool'
    case ABITypeName.Byte:
      return 'byte'
    case ABITypeName.String:
      return 'string'
    case ABITypeName.Tuple:
      return tupleToString(abiType)
    case ABITypeName.StaticArray:
      return staticArrayToString(abiType)
    case ABITypeName.DynamicArray:
      return dynamicArrayToString(abiType)
  }
}

const STATIC_ARRAY_REGEX = /^([a-z\d[\](),]+)\[(0|[1-9][\d]*)]$/
const UFIXED_REGEX = /^ufixed([1-9][\d]*)x([1-9][\d]*)$/
const MAX_LEN = 2 ** 16 - 1

export function stringToABIType(str: string): ABIType {
  if (str.endsWith('[]')) {
    const childType = stringToABIType(str.slice(0, str.length - 2))
    return {
      name: ABITypeName.DynamicArray,
      childType: childType,
    }
  }
  if (str.endsWith(']')) {
    const stringMatches = str.match(STATIC_ARRAY_REGEX)
    // Match the string itself, array element type, then array length
    if (!stringMatches || stringMatches.length !== 3) {
      throw new Error(`Validation Error: malformed static array string: ${str}`)
    }
    // Parse static array using regex
    const arrayLengthStr = stringMatches[2]
    const arrayLength = parseInt(arrayLengthStr, 10)
    if (arrayLength > MAX_LEN) {
      throw new Error(`Validation Error: array length exceeds limit ${MAX_LEN}`)
    }
    // Parse the array element type
    const childType = stringToABIType(stringMatches[1])

    return {
      name: ABITypeName.StaticArray,
      childType: childType,
      length: arrayLength,
    }
  }
  if (str.startsWith('uint')) {
    // Checks if the parsed number contains only digits, no whitespaces
    const digitsOnly = (s: string) => [...s].every((c) => '0123456789'.includes(c))
    const typeSizeStr = str.slice(4, str.length)
    if (!digitsOnly(typeSizeStr)) {
      throw new Error(`Validation Error: malformed uint string: ${typeSizeStr}`)
    }
    const bitSize = parseInt(typeSizeStr, 10)
    if (bitSize > MAX_LEN) {
      throw new Error(`Validation Error: malformed uint string: ${bitSize}`)
    }
    return {
      name: ABITypeName.Uint,
      bitSize: bitSize,
    }
  }
  if (str === 'byte') {
    return { name: ABITypeName.Byte }
  }
  if (str.startsWith('ufixed')) {
    const stringMatches = str.match(UFIXED_REGEX)
    if (!stringMatches || stringMatches.length !== 3) {
      throw new Error(`malformed ufixed type: ${str}`)
    }
    const bitSize = parseInt(stringMatches[1], 10)
    const precision = parseInt(stringMatches[2], 10)
    return { name: ABITypeName.Ufixed, bitSize: bitSize, precision: precision }
  }
  if (str === 'bool') {
    return { name: ABITypeName.Bool }
  }
  if (str === 'address') {
    return { name: ABITypeName.Address }
  }
  if (str === 'string') {
    return { name: ABITypeName.String }
  }
  if (str.length >= 2 && str[0] === '(' && str[str.length - 1] === ')') {
    const tupleContent = parseTupleContent(str.slice(1, str.length - 1))
    const childTypes: ABIType[] = []
    for (let i = 0; i < tupleContent.length; i++) {
      const ti = stringToABIType(tupleContent[i])
      childTypes.push(ti)
    }

    return {
      name: ABITypeName.Tuple,
      childTypes: childTypes,
    }
  }
  throw new Error(`cannot convert a string ${str} to an ABI type`)
}

function parseTupleContent(content: string): string[] {
  if (content === '') {
    return []
  }

  if (content.startsWith(',')) {
    throw new Error('Validation Error: Tuple name should not start with comma')
  }
  if (content.endsWith(',')) {
    throw new Error('Validation Error: Tuple name should not end with comma')
  }
  if (content.includes(',,')) {
    throw new Error('Validation Error: Tuple string should not have consecutive commas')
  }

  const tupleStrings: string[] = []
  let depth = 0
  let word = ''

  for (const ch of content) {
    word += ch
    if (ch === '(') {
      depth += 1
    } else if (ch === ')') {
      depth -= 1
    } else if (ch === ',' && depth === 0) {
      word = word.slice(0, -1) // Remove the comma
      tupleStrings.push(word)
      word = ''
    }
  }

  if (word !== '') {
    tupleStrings.push(word)
  }

  if (depth !== 0) {
    throw new Error('Validation Error: Tuple string has mismatched parentheses')
  }

  return tupleStrings
}
