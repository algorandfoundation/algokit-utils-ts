// Re-export all types and helpers
export * from './abi-value'
export * from './helpers'

// Import all variant types
import { ABIDynamicArrayType } from './types/collections/dynamic-array'
import { ABIStaticArrayType } from './types/collections/static-array'
import { ABITupleType } from './types/collections/tuple'
import { ABIAddressType } from './types/primitives/address'
import { ABIBoolType } from './types/primitives/bool'
import { ABIByteType } from './types/primitives/byte'
import { ABIStringType } from './types/primitives/string'
import { ABIUFixedType } from './types/primitives/ufixed'
import { ABIUintType } from './types/primitives/uint'

// Import all functions
import { createDynamicArrayType, decodeDynamicArray, dynamicArrayToString, encodeDynamicArray } from './types/collections/dynamic-array'
import { createStaticArrayType, decodeStaticArray, encodeStaticArray, staticArrayToString } from './types/collections/static-array'
import { createTupleType, decodeTuple, encodeTuple, tupleToString } from './types/collections/tuple'
import { addressToString, createAddressType, decodeAddress, encodeAddress } from './types/primitives/address'
import { boolToString, createBoolType, decodeBool, encodeBool } from './types/primitives/bool'
import { byteToString, createByteType, decodeByte, encodeByte } from './types/primitives/byte'
import { createStringType, decodeString, encodeString, stringToString } from './types/primitives/string'
import { createUFixedType, decodeUFixed, encodeUFixed, ufixedToString } from './types/primitives/ufixed'
import { createUintType, decodeUint, encodeUint, uintToString } from './types/primitives/uint'

import { ABIValue } from './abi-value'
import { STATIC_ARRAY_REGEX, UFIXED_REGEX, ValidationError } from './helpers'

// Main union type
export type ABIType =
  | ABIUintType
  | ABIUFixedType
  | ABIAddressType
  | ABIBoolType
  | ABIByteType
  | ABIStringType
  | ABITupleType
  | ABIStaticArrayType
  | ABIDynamicArrayType

// Factory functions namespace
export const ABI = {
  uint: createUintType,
  ufixed: createUFixedType,
  address: createAddressType,
  bool: createBoolType,
  byte: createByteType,
  string: createStringType,
  tuple: createTupleType,
  staticArray: createStaticArrayType,
  dynamicArray: createDynamicArrayType,
}

// Central encode function with pattern matching
export function encode(abiType: ABIType, value: ABIValue): Uint8Array {
  switch (abiType.kind) {
    case 'uint':
      return encodeUint(abiType, value)
    case 'ufixed':
      return encodeUFixed(abiType, value)
    case 'address':
      return encodeAddress(abiType, value)
    case 'bool':
      return encodeBool(abiType, value)
    case 'byte':
      return encodeByte(abiType, value)
    case 'string':
      return encodeString(abiType, value)
    case 'tuple':
      return encodeTuple(abiType, value)
    case 'static-array':
      return encodeStaticArray(abiType, value)
    case 'dynamic-array':
      return encodeDynamicArray(abiType, value)
    default: {
      // Exhaustiveness check
      const _exhaustive: never = abiType
      _exhaustive // Prevents unused variable warning
      throw new Error('Unknown ABIType')
    }
  }
}

// Central decode function with pattern matching
export function decode(abiType: ABIType, bytes: Uint8Array): ABIValue {
  switch (abiType.kind) {
    case 'uint':
      return decodeUint(abiType, bytes)
    case 'ufixed':
      return decodeUFixed(abiType, bytes)
    case 'address':
      return decodeAddress(abiType, bytes)
    case 'bool':
      return decodeBool(abiType, bytes)
    case 'byte':
      return decodeByte(abiType, bytes)
    case 'string':
      return decodeString(abiType, bytes)
    case 'tuple':
      return decodeTuple(abiType, bytes)
    case 'static-array':
      return decodeStaticArray(abiType, bytes)
    case 'dynamic-array':
      return decodeDynamicArray(abiType, bytes)
    default: {
      // Exhaustiveness check
      const _exhaustive: never = abiType
      _exhaustive // Prevents unused variable warning
      throw new Error('Unknown ABIType')
    }
  }
}

// Central toString function
export function toString(abiType: ABIType): string {
  switch (abiType.kind) {
    case 'uint':
      return uintToString(abiType)
    case 'ufixed':
      return ufixedToString(abiType)
    case 'address':
      return addressToString(abiType)
    case 'bool':
      return boolToString(abiType)
    case 'byte':
      return byteToString(abiType)
    case 'string':
      return stringToString(abiType)
    case 'tuple':
      return tupleToString(abiType)
    case 'static-array':
      return staticArrayToString(abiType)
    case 'dynamic-array':
      return dynamicArrayToString(abiType)
    default: {
      // Exhaustiveness check
      const _exhaustive: never = abiType
      _exhaustive // Prevents unused variable warning
      throw new Error('Unknown ABIType')
    }
  }
}

// Central fromString parser function
export function fromString(str: string): ABIType {
  // Dynamic array: "uint8[]"
  if (str.endsWith('[]')) {
    const elementTypeStr = str.slice(0, -2)
    const elementType = fromString(elementTypeStr)
    return createDynamicArrayType(elementType)
  }

  // Static array: "uint8[5]" - uses regex like Rust
  if (str.includes('[') && str.endsWith(']')) {
    const match = STATIC_ARRAY_REGEX.exec(str)
    if (!match) {
      throw new ValidationError(`Malformed static array string: ${str}`)
    }

    const elementTypeStr = match[1]
    const lengthStr = match[2]

    const length = parseInt(lengthStr, 10)
    if (isNaN(length)) {
      throw new ValidationError(`Invalid array length: ${lengthStr}`)
    }

    const elementType = fromString(elementTypeStr)
    return createStaticArrayType(elementType, length)
  }

  // Uint: "uint64"
  if (str.startsWith('uint')) {
    const sizeStr = str.slice(4)
    if (!/^\d+$/.test(sizeStr)) {
      throw new ValidationError(`Malformed uint string: ${sizeStr}`)
    }

    const size = parseInt(sizeStr, 10)
    if (isNaN(size)) {
      throw new ValidationError(`Invalid uint size: ${sizeStr}`)
    }

    return createUintType(size)
  }

  // UFixed: "ufixed128x10" - uses regex like Rust
  if (str.startsWith('ufixed')) {
    const match = UFIXED_REGEX.exec(str)
    if (!match) {
      throw new ValidationError(`Malformed ufixed type: ${str}`)
    }

    const sizeStr = match[1]
    const precisionStr = match[2]

    const size = parseInt(sizeStr, 10)
    const precision = parseInt(precisionStr, 10)

    if (isNaN(size)) {
      throw new ValidationError(`Invalid ufixed size: ${sizeStr}`)
    }
    if (isNaN(precision)) {
      throw new ValidationError(`Invalid ufixed precision: ${precisionStr}`)
    }

    return createUFixedType(size, precision)
  }

  // Tuple: "(uint8,bool)" - uses depth tracking like Rust
  if (str.startsWith('(') && str.endsWith(')')) {
    const content = str.slice(1, -1)
    const typeStrings = parseTupleContent(content)
    const childTypes = typeStrings.map(fromString)
    return createTupleType(childTypes)
  }

  // Primitives
  switch (str) {
    case 'byte':
      return createByteType()
    case 'bool':
      return createBoolType()
    case 'address':
      return createAddressType()
    case 'string':
      return createStringType()
    default:
      throw new ValidationError(`Cannot convert string '${str}' to an ABI type`)
  }
}

// Helper function to parse tuple content (from Rust implementation)
function parseTupleContent(content: string): string[] {
  if (content === '') {
    return []
  }

  if (content.startsWith(',')) {
    throw new ValidationError('Tuple name should not start with comma')
  }
  if (content.endsWith(',')) {
    throw new ValidationError('Tuple name should not end with comma')
  }
  if (content.includes(',,')) {
    throw new ValidationError('Tuple string should not have consecutive commas')
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
    throw new ValidationError('Tuple string has mismatched parentheses')
  }

  return tupleStrings
}
