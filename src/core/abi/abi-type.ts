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

/**
 *   Represents an Algorand ABI type for encoding and decoding values as defined in [ARC-0004](https://arc.algorand.foundation/ARCs/arc-0004#types).
 */
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

/**
 * Encodes an ABI value according to ARC-4 specification.
 * @param abiType The ABI type
 * @param abiValue The value to encode, must match the ABI type
 * @returns The encoded bytes
 */
export function encodeABIValue(abiType: ABIType, abiValue: ABIValue): Uint8Array {
  switch (abiType.name) {
    case 'Uint':
      return encodeUint(abiType, abiValue)
    case 'Ufixed':
      return encodeUfixed(abiType, abiValue)
    case 'Address':
      return encodeAddress(abiValue)
    case 'Bool':
      return encodeBool(abiValue)
    case 'Byte':
      return encodeByte(abiValue)
    case 'String':
      return encodeString(abiValue)
    case 'Tuple':
      return encodeTuple(abiType, abiValue)
    case 'StaticArray':
      return encodeStaticArray(abiType, abiValue)
    case 'DynamicArray':
      return encodeDynamicArray(abiType, abiValue)
  }
}

/**
 * Decodes an ABI value according to ARC-4 specification.
 * @param abiType The ABI type
 * @param abiValue The encoded bytes to decode
 * @returns The decoded ABI value
 */
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

/**
 * Gets the ARC-4 type name of an ABI type.
 * @param abiType The ABI type
 * @returns The ARC-4 name
 */
export function getABITypeName(abiType: ABIType): string {
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

/**
 * Gets the ABI type from an ARC-4 type name
 * @param str the ARC-4 type name
 * @returns the ABI type
 */
export function getABIType(str: string): ABIType {
  if (str.endsWith('[]')) {
    const childType = getABIType(str.slice(0, str.length - 2))
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
    const childType = getABIType(stringMatches[1])

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
      const ti = getABIType(tupleContent[i])
      childTypes.push(ti)
    }

    return {
      name: 'Tuple',
      childTypes: childTypes,
    }
  }
  throw new Error(`cannot convert a string ${str} to an ABI type`)
}

export function parseTupleContent(content: string): string[] {
  if (content === '') {
    return []
  }

  if (content.startsWith(',')) {
    throw new Error('Validation Error: the content should not start with comma')
  }
  if (content.endsWith(',')) {
    throw new Error('Validation Error: the content should not end with comma')
  }
  if (content.includes(',,')) {
    throw new Error('Validation Error: the content should not have consecutive commas')
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
    throw new Error('Validation Error: the content has mismatched parentheses')
  }

  return tupleStrings
}
