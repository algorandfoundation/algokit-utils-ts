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

export type ABITypeName = 'Uint' | 'Ufixed' | 'Address' | 'Bool' | 'Byte' | 'String' | 'Tuple' | 'StaticArray' | 'DynamicArray'

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
    case 'Uint':
      return encodeUint(abiType, value)
    case 'Ufixed':
      return encodeUfixed(abiType, value)
    case 'Address':
      return encodeAddress(value)
    case 'Bool':
      return encodeBool(value)
    case 'Byte':
      return encodeByte(value)
    case 'String':
      return encodeString(value)
    case 'Tuple':
      return encodeTuple(abiType, value)
    case 'StaticArray':
      return encodeStaticArray(abiType, value)
    case 'DynamicArray':
      return encodeDynamicArray(abiType, value)
  }
}

export function decodeABIValue(abiType: ABIType, encodedValue: Uint8Array): ABIValue {
  switch (abiType.name) {
    case 'Uint':
      return decodeUint(abiType, encodedValue)
    case 'Ufixed':
      return decodeUfixed(abiType, encodedValue)
    case 'Address':
      return decodeAddress(encodedValue)
    case 'Bool':
      return decodeBool(encodedValue)
    case 'Byte':
      return decodeByte(encodedValue)
    case 'String':
      return decodeString(abiType, encodedValue)
    case 'Tuple':
      return decodeTuple(abiType, encodedValue)
    case 'StaticArray':
      return decodeStaticArray(abiType, encodedValue)
    case 'DynamicArray':
      return decodeDynamicArray(abiType, encodedValue)
  }
}

export function aBITypeToString(abiType: ABIType): string {
  switch (abiType.name) {
    case 'Uint':
      return uintToString(abiType)
    case 'Ufixed':
      return ufixedToString(abiType)
    case 'Address':
      return 'adress'
    case 'Bool':
      return 'bool'
    case 'Byte':
      return 'byte'
    case 'String':
      return 'string'
    case 'Tuple':
      return tupleToString(abiType)
    case 'StaticArray':
      return staticArrayToString(abiType)
    case 'DynamicArray':
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
      name: 'DynamicArray',
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
      name: 'StaticArray',
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
      name: 'Uint',
      bitSize: bitSize,
    }
  }
  if (str === 'byte') {
    return { name: 'Byte' }
  }
  if (str.startsWith('ufixed')) {
    const stringMatches = str.match(UFIXED_REGEX)
    if (!stringMatches || stringMatches.length !== 3) {
      throw new Error(`malformed ufixed type: ${str}`)
    }
    const bitSize = parseInt(stringMatches[1], 10)
    const precision = parseInt(stringMatches[2], 10)
    return { name: 'Ufixed', bitSize: bitSize, precision: precision }
  }
  if (str === 'bool') {
    return { name: 'Bool' }
  }
  if (str === 'address') {
    return { name: 'Address' }
  }
  if (str === 'string') {
    return { name: 'String' }
  }
  if (str.length >= 2 && str[0] === '(' && str[str.length - 1] === ')') {
    const tupleContent = parseTupleContent(str.slice(1, str.length - 1))
    const childTypes: ABIType[] = []
    for (let i = 0; i < tupleContent.length; i++) {
      const ti = stringToABIType(tupleContent[i])
      childTypes.push(ti)
    }

    return {
      name: 'Tuple',
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
