import {
  addressFromPublicKey,
  BOOL_FALSE_BYTE,
  BOOL_TRUE_BYTE,
  concatArrays,
  LENGTH_ENCODE_BYTE_SIZE,
  PUBLIC_KEY_BYTE_LENGTH,
  publicKeyFromAddress,
} from '@algorandfoundation/algokit-common'
import type { ABIStructValue, ABIValue } from './abi-value'
import { bigIntToBytes, bytesToBigInt } from './bigint'
import { StructField } from './arc56-contract'

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
  Struct = 'Struct',
}

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
  | ABIStructType

/**
 * Encodes an ABI value according to ARC-4 specification.
 * @param abiType The ABI type
 * @param abiValue The value to encode, must match the ABI type
 * @returns The encoded bytes
 */
export function encodeABIValue(abiType: ABIType, abiValue: ABIValue): Uint8Array {
  switch (abiType.name) {
    case ABITypeName.Uint:
      return encodeUint(abiType, abiValue)
    case ABITypeName.Ufixed:
      return encodeUfixed(abiType, abiValue)
    case ABITypeName.Address:
      return encodeAddress(abiValue)
    case ABITypeName.Bool:
      return encodeBool(abiValue)
    case ABITypeName.Byte:
      return encodeByte(abiValue)
    case ABITypeName.String:
      return encodeString(abiValue)
    case ABITypeName.Tuple:
      return encodeTuple(abiType, abiValue)
    case ABITypeName.StaticArray:
      return encodeStaticArray(abiType, abiValue)
    case ABITypeName.DynamicArray:
      return encodeDynamicArray(abiType, abiValue)
    case ABITypeName.Struct:
      return encodeStruct(abiType, abiValue)
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
    case ABITypeName.Struct:
      return decodeStruct(abiType, encodedValue)
  }
}

/**
 * Gets the ARC-4 type name of an ABI type.
 * @param abiType The ABI type
 * @returns The ARC-4 name
 */
export function getABITypeName(abiType: ABIType): string {
  switch (abiType.name) {
    case ABITypeName.Uint:
      return uintToString(abiType)
    case ABITypeName.Ufixed:
      return ufixedToString(abiType)
    case ABITypeName.Address:
      return 'address'
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
    case ABITypeName.Struct:
      return structToString(abiType)
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
    const childType = getABIType(stringMatches[1])

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
      const ti = getABIType(tupleContent[i])
      childTypes.push(ti)
    }

    return {
      name: ABITypeName.Tuple,
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

// Primitive Types

// Address

/**
 * An Algorand address.
 */
export type ABIAddressType = {
  name: ABITypeName.Address
}

function encodeAddress(value: ABIValue): Uint8Array {
  if (typeof value === 'string') {
    return publicKeyFromAddress(value)
  }
  throw new Error(`Encoding Error: Cannot encode value as address: ${value}`)
}

function decodeAddress(bytes: Uint8Array): ABIValue {
  return addressFromPublicKey(bytes)
}

// Boolean

/**
 * A boolean value.
 */
export type ABIBoolType = {
  name: ABITypeName.Bool
}

function encodeBool(value: ABIValue): Uint8Array {
  if (typeof value !== 'boolean') {
    throw new Error(`Cannot encode value as bool: ${value}`)
  }

  return value ? new Uint8Array([0x80]) : new Uint8Array([0x00])
}

function decodeBool(bytes: Uint8Array): ABIValue {
  if (bytes.length !== 1) {
    throw new Error(`DecodingError: Expected 1 byte for bool, got ${bytes.length}`)
  }

  return (bytes[0] & 0x80) !== 0
}

// Byte

/**
 * A single byte.
 */
export type ABIByteType = {
  name: ABITypeName.Byte
}

function encodeByte(value: ABIValue): Uint8Array {
  if (typeof value !== 'number' && typeof value !== 'bigint') {
    throw new Error(`Validation Error: Cannot encode value as byte: ${value}`)
  }
  const numberValue = typeof value === 'bigint' ? Number(value) : value
  if (value < 0 || value > 255) {
    throw new Error(`Encoding Error: Byte value must be between 0 and 255, got ${numberValue}`)
  }

  return new Uint8Array([numberValue])
}

function decodeByte(bytes: Uint8Array): ABIValue {
  if (bytes.length !== 1) {
    throw new Error(`DecodingError: Expected 1 byte for byte type, got ${bytes.length}`)
  }

  return bytes[0]
}

// String

/**
 * A dynamic-length string.
 */
export type ABIStringType = {
  name: ABITypeName.String
}

function encodeString(value: ABIValue): Uint8Array {
  if (typeof value !== 'string') {
    throw new Error(`Encoding Error: Cannot encode value as string: ${value}`)
  }

  let encodedBytes: Uint8Array
  if (typeof value === 'string') {
    encodedBytes = new TextEncoder().encode(value)
  } else {
    encodedBytes = value
  }
  const encodedLength = bigIntToBytes(encodedBytes.length, LENGTH_ENCODE_BYTE_SIZE)
  const mergedBytes = new Uint8Array(encodedBytes.length + LENGTH_ENCODE_BYTE_SIZE)
  mergedBytes.set(encodedLength)
  mergedBytes.set(encodedBytes, LENGTH_ENCODE_BYTE_SIZE)
  return mergedBytes
}

function decodeString(_type: ABIStringType, bytes: Uint8Array): ABIValue {
  if (bytes.length < LENGTH_ENCODE_BYTE_SIZE) {
    throw new Error(
      `byte string is too short to be decoded. Actual length is ${bytes.length}, but expected at least ${LENGTH_ENCODE_BYTE_SIZE}`,
    )
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, LENGTH_ENCODE_BYTE_SIZE)
  const byteLength = view.getUint16(0)
  const byteValue = bytes.slice(LENGTH_ENCODE_BYTE_SIZE, bytes.length)
  if (byteLength !== byteValue.length) {
    throw new Error(`string length bytes do not match the actual length of string. Expected ${byteLength}, got ${byteValue.length}`)
  }
  return new TextDecoder('utf-8').decode(byteValue)
}

// Ufixed

/**
 * A fixed-point number of a specific bit size and precision.
 */
export type ABIUfixedType = {
  name: ABITypeName.Ufixed
  bitSize: number
  precision: number
}

function validateUfixed(type: ABIUfixedType) {
  const size = type.bitSize
  const precision = type.precision
  if (size % 8 !== 0 || size < 8 || size > 512) {
    throw new Error(`Validation Error: unsupported ufixed type bitSize: ${size}`)
  }
  if (precision > 160 || precision < 1) {
    throw new Error(`Validation Error: unsupported ufixed type precision: ${precision}`)
  }
}

function encodeUfixed(type: ABIUfixedType, value: ABIValue): Uint8Array {
  validateUfixed(type)

  if (typeof value !== 'bigint' && typeof value !== 'number') {
    throw new Error(`Cannot encode value as ${ufixedToString(type)}: ${value}`)
  }
  if (value >= BigInt(2 ** type.bitSize) || value < BigInt(0)) {
    throw new Error(`${value} is not a non-negative int or too big to fit in size ${type.toString()}`)
  }
  if (typeof value === 'number' && !Number.isSafeInteger(value)) {
    throw new Error(`${value} should be converted into a BigInt before it is encoded`)
  }
  return bigIntToBytes(value, type.bitSize / 8)
}

function decodeUfixed(type: ABIUfixedType, bytes: Uint8Array): ABIValue {
  validateUfixed(type)

  if (bytes.length !== type.bitSize / 8) {
    throw new Error(`byte string must correspond to a ${ufixedToString(type)}`)
  }

  const value = bytesToBigInt(bytes)
  return type.bitSize < 53 ? Number(value) : value
}

function ufixedToString(type: ABIUfixedType): string {
  return `ufixed${type.bitSize}x${type.precision}`
}

// Uint

/**
 * An unsigned integer of a specific bit size.
 */
export type ABIUintType = {
  name: ABITypeName.Uint
  bitSize: number
}

function validateUint(type: ABIUintType) {
  const size = type.bitSize
  if (size % 8 !== 0 || size < 8 || size > 512) {
    throw new Error(`Validation Error: unsupported uint type bitSize: ${size}`)
  }
}

function encodeUint(type: ABIUintType, value: ABIValue): Uint8Array {
  validateUint(type)

  if (typeof value !== 'bigint' && typeof value !== 'number') {
    throw new Error(`Cannot encode value as uint${type.bitSize}: ${value}`)
  }

  if (value >= BigInt(2 ** type.bitSize) || value < BigInt(0)) {
    throw new Error(`${value} is not a non-negative int or too big to fit in size uint${type.bitSize}`)
  }
  if (typeof value === 'number' && !Number.isSafeInteger(value)) {
    throw new Error(`${value} should be converted into a BigInt before it is encoded`)
  }
  return bigIntToBytes(value, type.bitSize / 8)
}

function decodeUint(type: ABIUintType, bytes: Uint8Array): ABIValue {
  validateUint(type)

  if (bytes.length !== type.bitSize / 8) {
    throw new Error(`byte string must correspond to a uint${type.bitSize}`)
  }
  const value = bytesToBigInt(bytes)
  return type.bitSize < 53 ? Number(value) : value
}

function uintToString(type: ABIUintType): string {
  return `uint${type.bitSize}`
}

// Collection Types

// Dynamic Array
/**
 *  A dynamic-length array of another ABI type.
 */
export type ABIDynamicArrayType = {
  name: ABITypeName.DynamicArray
  childType: ABIType
}

function encodeDynamicArray(type: ABIDynamicArrayType, value: ABIValue): Uint8Array {
  if (!Array.isArray(value) && !(value instanceof Uint8Array)) {
    throw new Error(`Cannot encode value as ${dynamicArrayToString(type)}: ${value}`)
  }
  const convertedTuple = dynamicArrayToABITupleType(type, value.length)
  const encodedTuple = encodeTuple(convertedTuple, value)
  const encodedLength = bigIntToBytes(convertedTuple.childTypes.length, LENGTH_ENCODE_BYTE_SIZE)
  return concatArrays(encodedLength, encodedTuple)
}

function decodeDynamicArray(type: ABIDynamicArrayType, bytes: Uint8Array): ABIValue {
  const view = new DataView(bytes.buffer, 0, LENGTH_ENCODE_BYTE_SIZE)
  const byteLength = view.getUint16(0)
  const convertedTuple = dynamicArrayToABITupleType(type, byteLength)
  return decodeTuple(convertedTuple, bytes.slice(LENGTH_ENCODE_BYTE_SIZE, bytes.length))
}

function dynamicArrayToABITupleType(type: ABIDynamicArrayType, length: number) {
  return {
    childTypes: Array(length).fill(type.childType),
    name: ABITypeName.Tuple,
  } satisfies ABITupleType
}

function dynamicArrayToString(type: ABIDynamicArrayType): string {
  return `${type.childType}[]`
}

// Static Array

/**
 * A static-length array of another ABI type.
 */
export type ABIStaticArrayType = {
  name: ABITypeName.StaticArray
  childType: ABIType
  length: number
}

function encodeStaticArray(type: ABIStaticArrayType, value: ABIValue): Uint8Array {
  if (!Array.isArray(value) && !(value instanceof Uint8Array)) {
    throw new Error(`Cannot encode value as ${staticArrayToString(type)}: ${value}`)
  }
  if (value.length !== type.length) {
    throw new Error(`Value array does not match static array length. Expected ${type.length}, got ${value.length}`)
  }
  const convertedTuple = staticArrayToABITupleType(type)
  return encodeTuple(convertedTuple, value)
}

function decodeStaticArray(type: ABIStaticArrayType, bytes: Uint8Array): ABIValue {
  const convertedTuple = staticArrayToABITupleType(type)
  return decodeTuple(convertedTuple, bytes)
}

function staticArrayToString(type: ABIStaticArrayType): string {
  return `${type.childType}[${type.length}]`
}

function staticArrayToABITupleType(type: ABIStaticArrayType) {
  return {
    childTypes: Array(type.length).fill(type.childType),
    name: ABITypeName.Tuple,
  } satisfies ABITupleType
}

// Struct

export type ABIStructType = {
  name: ABITypeName.Struct
  structName: string
  structFields: ABIStructField[]
}

export type ABIStructField = {
  name: string
  type: ABIType | ABIStructField[]
}

function encodeStruct(type: ABIStructType, value: ABIValue): Uint8Array {
  if (typeof value !== 'object' || Array.isArray(value) || value instanceof Uint8Array) {
    throw new Error(`Cannot encode value as ${structToString(type)}: ${value}`)
  }

  const tupleType = getABITupleTypeFromABIStructType(type)
  const tupleValue = getTupleValueFromStructValue(type, value)
  return encodeTuple(tupleType, tupleValue)
}

function decodeStruct(type: ABIStructType, bytes: Uint8Array): ABIStructValue {
  const tupleType = getABITupleTypeFromABIStructType(type)
  const tupleValue = decodeTuple(tupleType, bytes)

  return getStructValueFromTupleValue(type, tupleValue)
}

export function getABIStructType(structName: string, structs: Record<string, StructField[]>): ABIStructType {
  const getStructFieldType = (structFieldType: string | StructField[]): ABIType | ABIStructField[] => {
    // When the input is an array of struct fields
    if (Array.isArray(structFieldType)) {
      return structFieldType.map((structField) => ({
        name: structField.name,
        type: getStructFieldType(structField.type),
      }))
    }

    // When the input is a name of another struct
    if (structs[structFieldType]) {
      return getABIStructType(structFieldType, structs)
    }

    // When the input in an ABI type name
    return getABIType(structFieldType)
  }

  if (!structs[structName]) throw new Error('Struct not found')

  const fields = structs[structName]
  return {
    name: ABITypeName.Struct,
    structName: structName,
    structFields: fields.map((f) => ({
      name: f.name,
      type: getStructFieldType(f.type),
    })),
  } satisfies ABIStructType
}

function getABITupleTypeFromABIStructType(struct: ABIStructType): ABITupleType {
  const getABITupleTypeFromABIStructFields = (fields: ABIStructField[]): ABITupleType => {
    const childTypes = fields.map((field) =>
      Array.isArray(field.type)
        ? getABITupleTypeFromABIStructFields(field.type)
        : field.type.name === ABITypeName.Struct
          ? getABITupleTypeFromABIStructType(field.type)
          : field.type,
    )
    return {
      name: ABITypeName.Tuple,
      childTypes,
    } satisfies ABITupleType
  }

  return getABITupleTypeFromABIStructFields(struct.structFields)
}

function structToString(type: ABIStructType): string {
  return type.structName
}

function getTupleValueFromStructValue(structType: ABIStructType, structValue: ABIStructValue): ABIValue[] {
  function getTupleValueFromStructFields(structFields: ABIStructField[], values: ABIValue[]): ABIValue[] {
    return structFields.map(({ type }, index) => {
      // if type is an array of fields, treat as unnamed struct
      if (Array.isArray(type)) {
        const value = values[index] as ABIStructValue
        return getTupleValueFromStructFields(type, Object.values(value))
      }
      // if type is struct, treat as struct
      if (type.name === ABITypeName.Struct) {
        const value = values[index] as ABIStructValue
        return getTupleValueFromStructFields(type.structFields, Object.values(value))
      }
      return values[index]
    })
  }

  return getTupleValueFromStructFields(structType.structFields, Object.values(structValue))
}

function getStructValueFromTupleValue(structType: ABIStructType, tupleValue: ABIValue[]): ABIStructValue {
  function getStructFieldValues(structFields: ABIStructField[], values: ABIValue[]): ABIStructValue {
    return Object.fromEntries(
      structFields.map(({ name, type }, index) => {
        // When the type is an array of fields, the value must be tuple
        if (Array.isArray(type)) {
          const value = values[index] as ABIValue[]
          return [name, getStructFieldValues(type, value)]
        }
        // When the type is a struct, the value must be tuple
        if (type.name === ABITypeName.Struct) {
          const value = values[index] as ABIValue[]
          return [name, getStructFieldValues(type.structFields, value)]
        }
        return [name, values[index]]
      }),
    )
  }

  return getStructFieldValues(structType.structFields, tupleValue)
}

// Tuple

/**
 * A tuple of other ABI types.
 */
export type ABITupleType = {
  name: ABITypeName.Tuple
  childTypes: ABIType[]
}

interface Segment {
  left: number
  right: number
}

function compressBools(values: ABIValue[]): number {
  if (values.length > 8) {
    throw new Error(`Encoding Error: Expected no more than 8 bool values, received ${values.length}`)
  }

  let result = 0
  for (let i = 0; i < values.length; i++) {
    if (typeof values[i] !== 'boolean') {
      throw new Error('Encoding Error: Expected all values to be boolean')
    }
    if (values[i]) {
      result |= 1 << (7 - i)
    }
  }

  return result
}

function extractValues(abiTypes: ABIType[], bytes: Uint8Array): Uint8Array[] {
  const dynamicSegments: Segment[] = []
  const valuePartitions: (Uint8Array | null)[] = []
  let bytesCursor = 0
  let abiTypesCursor = 0

  while (abiTypesCursor < abiTypes.length) {
    const childType = abiTypes[abiTypesCursor]

    if (isDynamic(childType)) {
      if (bytes.length - bytesCursor < LENGTH_ENCODE_BYTE_SIZE) {
        throw new Error('DecodingError: Byte array is too short to be decoded')
      }

      const dynamicIndex = (bytes[bytesCursor] << 8) | bytes[bytesCursor + 1]

      if (dynamicSegments.length > 0) {
        const lastSegment = dynamicSegments[dynamicSegments.length - 1]
        if (dynamicIndex < lastSegment.left) {
          throw new Error('DecodingError: Dynamic index segment miscalculation: left is greater than right index')
        }
        lastSegment.right = dynamicIndex
      }

      dynamicSegments.push({ left: dynamicIndex, right: 0 })
      valuePartitions.push(null)
      bytesCursor += LENGTH_ENCODE_BYTE_SIZE
    } else {
      if (childType.name === 'Bool') {
        const boolSequenceEndIndex = findBoolSequenceEnd(abiTypes, abiTypesCursor)
        for (let j = 0; j <= boolSequenceEndIndex - abiTypesCursor; j++) {
          const boolMask = BOOL_TRUE_BYTE >> j
          if ((bytes[bytesCursor] & boolMask) > 0) {
            valuePartitions.push(new Uint8Array([BOOL_TRUE_BYTE]))
          } else {
            valuePartitions.push(new Uint8Array([BOOL_FALSE_BYTE]))
          }
        }
        abiTypesCursor = boolSequenceEndIndex
        bytesCursor += 1
      } else {
        const childTypeSize = getSize(childType)
        if (bytesCursor + childTypeSize > bytes.length) {
          throw new Error(
            `DecodingError: Index out of bounds, trying to access bytes[${bytesCursor}..${bytesCursor + childTypeSize}] but slice has length ${bytes.length}`,
          )
        }
        valuePartitions.push(bytes.slice(bytesCursor, bytesCursor + childTypeSize))
        bytesCursor += childTypeSize
      }
    }

    if (abiTypesCursor !== abiTypes.length - 1 && bytesCursor >= bytes.length) {
      throw new Error('DecodingError: Input bytes not enough to decode')
    }
    abiTypesCursor += 1
  }

  if (dynamicSegments.length > 0) {
    const lastSegment = dynamicSegments[dynamicSegments.length - 1]
    lastSegment.right = bytes.length
  } else if (bytesCursor < bytes.length) {
    throw new Error('DecodingError: Input bytes not fully consumed')
  }

  for (let i = 0; i < dynamicSegments.length; i++) {
    const segment = dynamicSegments[i]
    if (segment.left > segment.right) {
      throw new Error('DecodingError: Dynamic segment should display a [l, r] space with l <= r')
    }
    if (i !== dynamicSegments.length - 1 && segment.right !== dynamicSegments[i + 1].left) {
      throw new Error('DecodingError: Dynamic segments should be consecutive')
    }
  }

  let segmentIndex = 0
  for (let i = 0; i < abiTypes.length; i++) {
    const childType = abiTypes[i]
    if (isDynamic(childType)) {
      valuePartitions[i] = bytes.slice(dynamicSegments[segmentIndex].left, dynamicSegments[segmentIndex].right)
      segmentIndex += 1
    }
  }

  const result: Uint8Array[] = []
  for (let i = 0; i < valuePartitions.length; i++) {
    const partition = valuePartitions[i]
    if (partition === null) {
      throw new Error(`DecodingError: Value partition at index ${i} is None`)
    }
    result.push(partition)
  }

  return result
}

export function encodeTuple(type: ABITupleType, value: ABIValue): Uint8Array {
  if (!Array.isArray(value) && !(value instanceof Uint8Array)) {
    throw new Error(`Cannot encode value as ${tupleToString(type)}: ${value}`)
  }

  const childTypes = type.childTypes
  const values = Array.from(value)

  if (childTypes.length !== values.length) {
    throw new Error('Encoding Error: Mismatch lengths between the values and types')
  }

  const heads: Uint8Array[] = []
  const tails: Uint8Array[] = []
  const isDynamicIndex = new Map<number, boolean>()
  let abiTypesCursor = 0

  while (abiTypesCursor < childTypes.length) {
    const childType = childTypes[abiTypesCursor]

    if (isDynamic(childType)) {
      isDynamicIndex.set(heads.length, true)
      heads.push(new Uint8Array(2)) // Placeholder for dynamic offset
      tails.push(encodeABIValue(childType, values[abiTypesCursor]))
    } else {
      if (childType.name === 'Bool') {
        const boolSequenceEndIndex = findBoolSequenceEnd(childTypes, abiTypesCursor)
        const boolValues = values.slice(abiTypesCursor, boolSequenceEndIndex + 1)
        const compressedBool = compressBools(boolValues)
        heads.push(new Uint8Array([compressedBool]))
        abiTypesCursor = boolSequenceEndIndex
      } else {
        heads.push(encodeABIValue(childType, values[abiTypesCursor]))
      }
      isDynamicIndex.set(abiTypesCursor, false)
      tails.push(new Uint8Array(0))
    }
    abiTypesCursor += 1
  }

  const headLength = heads.reduce((sum, head) => sum + head.length, 0)
  let tailLength = 0

  for (let i = 0; i < heads.length; i++) {
    if (isDynamicIndex.get(i)) {
      const headValue = headLength + tailLength
      if (headValue > 0xffff) {
        throw new Error(`Encoding Error: Value ${headValue} cannot fit in u16`)
      }
      heads[i] = new Uint8Array([(headValue >> 8) & 0xff, headValue & 0xff])
    }
    tailLength += tails[i].length
  }

  const totalLength = heads.reduce((sum, head) => sum + head.length, 0) + tails.reduce((sum, tail) => sum + tail.length, 0)
  const result = new Uint8Array(totalLength)
  let offset = 0

  for (const head of heads) {
    result.set(head, offset)
    offset += head.length
  }

  for (const tail of tails) {
    result.set(tail, offset)
    offset += tail.length
  }

  return result
}

function decodeTuple(type: ABITupleType, bytes: Uint8Array): ABIValue[] {
  const childTypes = type.childTypes
  const valuePartitions = extractValues(childTypes, bytes)
  const values: ABIValue[] = []

  for (let i = 0; i < childTypes.length; i++) {
    const childType = childTypes[i]
    const valuePartition = valuePartitions[i]
    const childValue = decodeABIValue(childType, valuePartition)
    values.push(childValue)
  }

  return values
}

function tupleToString(type: ABITupleType): string {
  const typeStrings: string[] = []
  for (let i = 0; i < type.childTypes.length; i++) {
    typeStrings[i] = getABITypeName(type.childTypes[i])
  }
  return `(${typeStrings.join(',')})`
}

function isDynamic(type: ABIType): boolean {
  switch (type.name) {
    case 'StaticArray':
      return isDynamic(type.childType)
    case 'Tuple':
      return type.childTypes.some((c) => isDynamic(c))
    case 'DynamicArray':
    case 'String':
      return true
    default:
      return false
  }
}

function findBoolSequenceEnd(abiTypes: ABIType[], currentIndex: number): number {
  let cursor = currentIndex
  while (cursor < abiTypes.length) {
    if (abiTypes[cursor].name === 'Bool') {
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

function getSize(abiType: ABIType): number {
  switch (abiType.name) {
    case ABITypeName.Uint:
      return Math.floor(abiType.bitSize / 8)
    case ABITypeName.Ufixed:
      return Math.floor(abiType.bitSize / 8)
    case ABITypeName.Address:
      return PUBLIC_KEY_BYTE_LENGTH
    case ABITypeName.Bool:
      return 1
    case ABITypeName.Byte:
      return 1
    case ABITypeName.StaticArray:
      if (abiType.childType.name === 'Bool') {
        return Math.ceil(abiType.length / 8)
      }
      return getSize(abiType.childType) * abiType.length
    case ABITypeName.Tuple: {
      let size = 0
      let i = 0
      while (i < abiType.childTypes.length) {
        const childType = abiType.childTypes[i]
        if (childType.name === 'Bool') {
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
    case ABITypeName.Struct: {
      const tupleType = getABITupleTypeFromABIStructType(abiType)
      return getSize(tupleType)
    }
    case ABITypeName.String:
      throw new Error(`Validation Error: Failed to get size, string is a dynamic type`)
    case ABITypeName.DynamicArray:
      throw new Error(`Validation Error: Failed to get size, dynamic array is a dynamic type`)
  }
}
