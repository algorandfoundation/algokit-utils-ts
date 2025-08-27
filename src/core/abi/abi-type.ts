import { ABIValue } from './abi-value'
import { ValidationError } from './helpers'
import {
  ABIAddressType,
  ABIBoolType,
  ABIByteType,
  ABIDynamicArrayType,
  ABIStaticArrayType,
  ABIStringType,
  ABITupleType,
  ABIUFixedType,
  ABIUintType,
  decodeAddress,
  decodeBool,
  decodeByte,
  decodeDynamicArray,
  decodeStaticArray,
  decodeString,
  decodeTuple,
  decodeUFixed,
  decodeUint,
  dynamicArrayToString,
  encodeAddress,
  encodeBool,
  encodeByte,
  encodeDynamicArray,
  encodeStaticArray,
  encodeString,
  encodeTuple,
  encodeUFixed,
  encodeUint,
  staticArrayToString,
  tupleToString,
  ufixedToString,
  uintToString,
} from './types/'

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

export function encode(abiType: ABIType, value: ABIValue): Uint8Array {
  switch (abiType.kind) {
    case 'uint':
      return encodeUint(abiType, value)
    case 'ufixed':
      return encodeUFixed(abiType, value)
    case 'address':
      return encodeAddress(value)
    case 'bool':
      return encodeBool(value)
    case 'byte':
      return encodeByte(value)
    case 'string':
      return encodeString(value)
    case 'tuple':
      return encodeTuple(abiType, value)
    case 'static-array':
      return encodeStaticArray(abiType, value)
    case 'dynamic-array':
      return encodeDynamicArray(abiType, value)
  }
}

export function decode(abiType: ABIType, bytes: Uint8Array): ABIValue {
  switch (abiType.kind) {
    case 'uint':
      return decodeUint(abiType, bytes)
    case 'ufixed':
      return decodeUFixed(abiType, bytes)
    case 'address':
      return decodeAddress(bytes)
    case 'bool':
      return decodeBool(bytes)
    case 'byte':
      return decodeByte(bytes)
    case 'string':
      return decodeString(abiType, bytes)
    case 'tuple':
      return decodeTuple(abiType, bytes)
    case 'static-array':
      return decodeStaticArray(abiType, bytes)
    case 'dynamic-array':
      return decodeDynamicArray(abiType, bytes)
  }
}

export function toString(abiType: ABIType): string {
  switch (abiType.kind) {
    case 'uint':
      return uintToString(abiType)
    case 'ufixed':
      return ufixedToString(abiType)
    case 'address':
      return 'adress'
    case 'bool':
      return 'bool'
    case 'byte':
      return 'byte'
    case 'string':
      return 'string'
    case 'tuple':
      return tupleToString(abiType)
    case 'static-array':
      return staticArrayToString(abiType)
    case 'dynamic-array':
      return dynamicArrayToString(abiType)
  }
}

const staticArrayRegexp = /^([a-z\d[\](),]+)\[(0|[1-9][\d]*)]$/
const ufixedRegexp = /^ufixed([1-9][\d]*)x([1-9][\d]*)$/
export const MAX_LEN = 2 ** 16 - 1

// TODO: determine naming convention for the mappers
export function asABIType(str: string): ABIType {
  if (str.endsWith('[]')) {
    const childType = asABIType(str.slice(0, str.length - 2))
    return {
      kind: 'dynamic-array',
      childType: childType,
    }
  }
  if (str.endsWith(']')) {
    const stringMatches = str.match(staticArrayRegexp)
    // Match the string itself, array element type, then array length
    if (!stringMatches || stringMatches.length !== 3) {
      throw new ValidationError(`malformed static array string: ${str}`)
    }
    // Parse static array using regex
    const arrayLengthStr = stringMatches[2]
    const arrayLength = parseInt(arrayLengthStr, 10)
    if (arrayLength > MAX_LEN) {
      throw new ValidationError(`array length exceeds limit ${MAX_LEN}`)
    }
    // Parse the array element type
    const childType = asABIType(stringMatches[1])

    return {
      kind: 'static-array',
      childType: childType,
      length: arrayLength,
    }
  }
  if (str.startsWith('uint')) {
    // Checks if the parsed number contains only digits, no whitespaces
    const digitsOnly = (s: string) => [...s].every((c) => '0123456789'.includes(c))
    const typeSizeStr = str.slice(4, str.length)
    if (!digitsOnly(typeSizeStr)) {
      throw new ValidationError(`malformed uint string: ${typeSizeStr}`)
    }
    const bitSize = parseInt(typeSizeStr, 10)
    if (bitSize > MAX_LEN) {
      throw new ValidationError(`malformed uint string: ${bitSize}`)
    }
    return {
      kind: 'uint',
      bitSize: bitSize,
    }
  }
  if (str === 'byte') {
    return { kind: 'byte' }
  }
  if (str.startsWith('ufixed')) {
    const stringMatches = str.match(ufixedRegexp)
    if (!stringMatches || stringMatches.length !== 3) {
      throw new Error(`malformed ufixed type: ${str}`)
    }
    const bitSize = parseInt(stringMatches[1], 10)
    const precision = parseInt(stringMatches[2], 10)
    return { kind: 'ufixed', bitSize: bitSize, precision: precision }
  }
  if (str === 'bool') {
    return { kind: 'bool' }
  }
  if (str === 'address') {
    return { kind: 'address' }
  }
  if (str === 'string') {
    return { kind: 'string' }
  }
  if (str.length >= 2 && str[0] === '(' && str[str.length - 1] === ')') {
    const tupleContent = parseTupleContent(str.slice(1, str.length - 1))
    const childTypes: ABIType[] = []
    for (let i = 0; i < tupleContent.length; i++) {
      const ti = asABIType(tupleContent[i])
      childTypes.push(ti)
    }

    return {
      kind: 'tuple',
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

export function isDynamic(type: ABIType): boolean {
  switch (type.kind) {
    case 'static-array':
      return isDynamic(type.childType)
    case 'tuple':
      return type.childTypes.some((c) => isDynamic(c))
    case 'dynamic-array':
    case 'string':
      return true
    default:
      return false
  }
}

export function findBoolSequenceEnd(abiTypes: ABIType[], currentIndex: number): number {
  let cursor = currentIndex
  while (cursor < abiTypes.length) {
    if (abiTypes[cursor].kind === 'bool') {
      if (cursor - currentIndex + 1 === 8 || cursor === abiTypes.length - 1) {
        return cursor
      }
      cursor++
    } else {
      return cursor - 1
    }
  }
  return cursor - 1
}

export function getSize(abiType: ABIType): number {
  switch (abiType.kind) {
    case 'uint':
      return Math.floor(abiType.bitSize / 8)
    case 'ufixed':
      return Math.floor(abiType.bitSize / 8)
    case 'address':
      return 32
    case 'bool':
      return 1
    case 'byte':
      return 1
    case 'static-array':
      if (abiType.childType.kind === 'bool') {
        return Math.ceil(abiType.length / 8)
      }
      return getSize(abiType.childType) * abiType.length
    case 'tuple': {
      let size = 0
      let i = 0
      while (i < abiType.childTypes.length) {
        const childType = abiType.childTypes[i]
        if (childType.kind === 'bool') {
          const sequenceEndIndex = findBoolSequenceEnd(abiType.childTypes, i)
          const boolCount = sequenceEndIndex - i + 1
          size += Math.ceil(boolCount / 8)
          i = sequenceEndIndex + 1
        } else {
          size += getSize(childType)
          i++
        }
      }
      return size
    }
    case 'string':
      throw new ValidationError(`Failed to get size, string is a dynamic type`)
    case 'dynamic-array':
      throw new ValidationError(`Failed to get size, dynamic array is a dynamic type`)
  }
}
