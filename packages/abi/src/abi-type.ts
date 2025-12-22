import {
  Address,
  BOOL_FALSE_BYTE,
  BOOL_TRUE_BYTE,
  LENGTH_ENCODE_BYTE_SIZE,
  PUBLIC_KEY_BYTE_LENGTH,
  concatArrays,
} from '@algorandfoundation/algokit-common'
import type { ABIStructValue, ABIValue } from './abi-value'
import { StructField } from './arc56-contract'
import { bigIntToBytes, bytesToBigInt } from './bigint'

const STATIC_ARRAY_REGEX = /^([a-z\d[\](),]+)\[(0|[1-9][\d]*)]$/
const UFIXED_REGEX = /^ufixed([1-9][\d]*)x([1-9][\d]*)$/
const MAX_LEN = 2 ** 16 - 1

/**
 * Information about a single field in a struct
 */
export type ABIStructField = {
  /** The name of the struct field */
  name: string
  /** The type of the struct field's value */
  type: ABIType | ABIStructField[]
}

interface Segment {
  left: number
  right: number
}

/**
 * Represents an Algorand ABI type for encoding and decoding values as defined in [ARC-0004](https://arc.algorand.foundation/ARCs/arc-0004#types).
 *
 * This is the abstract base class for all ABI types.
 */
export abstract class ABIType {
  /**
   * Returns the ARC-4 type name string representation.
   * @returns The ARC-4 type string
   */
  abstract get name(): string

  /**
   * Returns a user-friendly display name for this type.
   * @returns The display name for this type
   */
  get displayName(): string {
    return this.name
  }

  /**
   * Returns the ARC-4 type name string representation.
   * @returns The ARC-4 type string
   */
  toString(): string {
    return this.name
  }

  /**
   * Checks if this ABI type is equal to another.
   * @param other The other ABI type to compare with
   * @returns True if the types are equal, false otherwise
   */
  abstract equals(other: ABIType): boolean

  /**
   * Checks if this ABI type is dynamic (variable-length).
   * @returns True if the type is dynamic, false otherwise
   */
  abstract isDynamic(): boolean

  /**
   * Gets the byte length of the encoded type for static types.
   * @returns The number of bytes needed to encode this type
   * @throws Error if the type is dynamic
   */
  abstract byteLen(): number

  /**
   * Encodes a value according to this ABI type.
   * @param value The value to encode
   * @returns The encoded bytes
   */
  abstract encode(value: ABIValue): Uint8Array

  /**
   * Decodes bytes according to this ABI type.
   * @param bytes The bytes to decode
   * @returns The decoded value
   */
  abstract decode(bytes: Uint8Array): ABIValue

  /**
   * Creates an ABI type from an ARC-4 type string.
   * @param str The ARC-4 type string (e.g., "uint256", "bool", "(uint8,address)")
   * @returns The corresponding ABI type
   */
  static from(str: string): ABIType {
    if (str.endsWith('[]')) {
      const childType = ABIType.from(str.slice(0, str.length - 2))
      return new ABIArrayDynamicType(childType)
    }
    if (str.endsWith(']')) {
      const stringMatches = str.match(STATIC_ARRAY_REGEX)
      if (!stringMatches || stringMatches.length !== 3) {
        throw new Error(`Malformed static array string: ${str}`)
      }
      const arrayLengthStr = stringMatches[2]
      const arrayLength = parseInt(arrayLengthStr, 10)
      if (arrayLength > MAX_LEN) {
        throw new Error(`Array length exceeds limit ${MAX_LEN}`)
      }
      const childType = ABIType.from(stringMatches[1])
      return new ABIArrayStaticType(childType, arrayLength)
    }
    if (str.startsWith('uint')) {
      const digitsOnly = (s: string) => [...s].every((c) => '0123456789'.includes(c))
      const typeSizeStr = str.slice(4, str.length)
      if (!digitsOnly(typeSizeStr)) {
        throw new Error(`Malformed uint string: ${typeSizeStr}`)
      }
      const bitSize = parseInt(typeSizeStr, 10)
      if (bitSize > MAX_LEN) {
        throw new Error(`Malformed uint string: ${bitSize}`)
      }
      return new ABIUintType(bitSize)
    }
    if (str === 'byte') {
      return new ABIByteType()
    }
    if (str.startsWith('ufixed')) {
      const stringMatches = str.match(UFIXED_REGEX)
      if (!stringMatches || stringMatches.length !== 3) {
        throw new Error(`Malformed ufixed type: ${str}`)
      }
      const bitSize = parseInt(stringMatches[1], 10)
      const precision = parseInt(stringMatches[2], 10)
      return new ABIUfixedType(bitSize, precision)
    }
    if (str === 'bool') {
      return new ABIBoolType()
    }
    if (str === 'address') {
      return new ABIAddressType()
    }
    if (str === 'string') {
      return new ABIStringType()
    }
    if (str.length >= 2 && str[0] === '(' && str[str.length - 1] === ')') {
      const tupleContent = parseTupleContent(str.slice(1, str.length - 1))
      const childTypes: ABIType[] = []
      for (let i = 0; i < tupleContent.length; i++) {
        const ti = ABIType.from(tupleContent[i])
        childTypes.push(ti)
      }
      return new ABITupleType(childTypes)
    }
    throw new Error(`Cannot convert a string ${str} to an ABI type`)
  }
}

// ============================================================================
// Primitive Types
// ============================================================================

/**
 * An unsigned integer ABI type of a specific bit size.
 */
export class ABIUintType extends ABIType {
  /**
   * Creates a new unsigned integer type.
   * @param bitSize The bit size (must be a multiple of 8, between 8 and 512)
   */
  constructor(public readonly bitSize: number) {
    super()
    if (bitSize % 8 !== 0 || bitSize < 8 || bitSize > 512) {
      throw new Error(`Unsupported uint type bitSize: ${bitSize}`)
    }
  }

  get name(): string {
    return `uint${this.bitSize}`
  }

  equals(other: ABIType): boolean {
    return other instanceof ABIUintType && this.bitSize === other.bitSize
  }

  isDynamic(): boolean {
    return false
  }

  byteLen(): number {
    return this.bitSize / 8
  }

  encode(value: ABIValue): Uint8Array {
    if (typeof value !== 'bigint' && typeof value !== 'number') {
      throw new Error(`Cannot encode value as ${this.name}: ${value}`)
    }

    if (value >= BigInt(2 ** this.bitSize) || value < BigInt(0)) {
      throw new Error(`${value} is not a non-negative int or too big to fit in size ${this.name}`)
    }
    if (typeof value === 'number' && !Number.isSafeInteger(value)) {
      throw new Error(`${value} should be converted into a BigInt before it is encoded`)
    }
    return bigIntToBytes(value, this.bitSize / 8)
  }

  decode(bytes: Uint8Array): ABIValue {
    if (bytes.length !== this.bitSize / 8) {
      throw new Error(`Byte string must correspond to a ${this.name}`)
    }
    const value = bytesToBigInt(bytes)
    return this.bitSize < 53 ? Number(value) : value
  }
}

/**
 * A fixed-point number ABI type of a specific bit size and precision.
 */
export class ABIUfixedType extends ABIType {
  /**
   * Creates a new fixed-point type.
   * @param bitSize The bit size (must be a multiple of 8, between 8 and 512)
   * @param precision The decimal precision (must be between 1 and 160)
   */
  constructor(
    public readonly bitSize: number,
    public readonly precision: number,
  ) {
    super()
    if (bitSize % 8 !== 0 || bitSize < 8 || bitSize > 512) {
      throw new Error(`Unsupported ufixed type bitSize: ${bitSize}`)
    }
    if (precision > 160 || precision < 1) {
      throw new Error(`Unsupported ufixed type precision: ${precision}`)
    }
  }

  get name(): string {
    return `ufixed${this.bitSize}x${this.precision}`
  }

  equals(other: ABIType): boolean {
    return other instanceof ABIUfixedType && this.bitSize === other.bitSize && this.precision === other.precision
  }

  isDynamic(): boolean {
    return false
  }

  byteLen(): number {
    return this.bitSize / 8
  }

  encode(value: ABIValue): Uint8Array {
    if (typeof value !== 'bigint' && typeof value !== 'number') {
      throw new Error(`Cannot encode value as ${this.name}: ${value}`)
    }
    if (value >= BigInt(2 ** this.bitSize) || value < BigInt(0)) {
      throw new Error(`${value} is not a non-negative int or too big to fit in size ${this.name}`)
    }
    if (typeof value === 'number' && !Number.isSafeInteger(value)) {
      throw new Error(`${value} should be converted into a BigInt before it is encoded`)
    }
    return bigIntToBytes(value, this.bitSize / 8)
  }

  decode(bytes: Uint8Array): ABIValue {
    if (bytes.length !== this.bitSize / 8) {
      throw new Error(`Byte string must correspond to a ${this.name}`)
    }
    const value = bytesToBigInt(bytes)
    return this.bitSize < 53 ? Number(value) : value
  }
}

/**
 * An Algorand address ABI type.
 */
export class ABIAddressType extends ABIType {
  get name(): string {
    return 'address'
  }

  equals(other: ABIType): boolean {
    return other instanceof ABIAddressType
  }

  isDynamic(): boolean {
    return false
  }

  byteLen(): number {
    return PUBLIC_KEY_BYTE_LENGTH
  }

  encode(value: ABIValue): Uint8Array {
    if (typeof value === 'string') {
      return Address.fromString(value).publicKey
    }

    if (value instanceof Address) {
      return value.publicKey
    }

    if (value instanceof Uint8Array && value.length === 32) {
      return value
    }

    throw new Error(`Cannot encode value as address: ${value}`)
  }

  decode(bytes: Uint8Array): string {
    return new Address(bytes).toString()
  }
}

/**
 * A boolean ABI type.
 */
export class ABIBoolType extends ABIType {
  get name(): string {
    return 'bool'
  }

  equals(other: ABIType): boolean {
    return other instanceof ABIBoolType
  }

  isDynamic(): boolean {
    return false
  }

  byteLen(): number {
    return 1
  }

  encode(value: ABIValue): Uint8Array {
    if (typeof value !== 'boolean') {
      throw new Error(`Cannot encode value as bool: ${value}`)
    }

    return value ? new Uint8Array([0x80]) : new Uint8Array([0x00])
  }

  decode(bytes: Uint8Array): ABIValue {
    if (bytes.length !== 1) {
      throw new Error(`Expected 1 byte for bool, got ${bytes.length}`)
    }

    return (bytes[0] & 0x80) !== 0
  }
}

/**
 * A single byte ABI type.
 */
export class ABIByteType extends ABIType {
  get name(): string {
    return 'byte'
  }

  equals(other: ABIType): boolean {
    return other instanceof ABIByteType
  }

  isDynamic(): boolean {
    return false
  }

  byteLen(): number {
    return 1
  }

  encode(value: ABIValue): Uint8Array {
    if (typeof value !== 'number' && typeof value !== 'bigint') {
      throw new Error(`Cannot encode value as byte: ${value}`)
    }
    const numberValue = typeof value === 'bigint' ? Number(value) : value
    if (value < 0 || value > 255) {
      throw new Error(`Byte value must be between 0 and 255, got ${numberValue}`)
    }

    return new Uint8Array([numberValue])
  }

  decode(bytes: Uint8Array): ABIValue {
    if (bytes.length !== 1) {
      throw new Error(`Expected 1 byte for byte type, got ${bytes.length}`)
    }

    return bytes[0]
  }
}

/**
 * A dynamic-length string ABI type.
 */
export class ABIStringType extends ABIType {
  get name(): string {
    return 'string'
  }

  equals(other: ABIType): boolean {
    return other instanceof ABIStringType
  }

  isDynamic(): boolean {
    return true
  }

  byteLen(): number {
    throw new Error(`Failed to get size, string is a dynamic type`)
  }

  encode(value: ABIValue): Uint8Array {
    if (typeof value !== 'string' && !(value instanceof Uint8Array)) {
      throw new Error(`Cannot encode value as string: ${value}`)
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

  decode(bytes: Uint8Array): ABIValue {
    if (bytes.length < LENGTH_ENCODE_BYTE_SIZE) {
      throw new Error(
        `Byte string is too short to be decoded. Actual length is ${bytes.length}, but expected at least ${LENGTH_ENCODE_BYTE_SIZE}`,
      )
    }
    const view = new DataView(bytes.buffer, bytes.byteOffset, LENGTH_ENCODE_BYTE_SIZE)
    const byteLength = view.getUint16(0)
    const byteValue = bytes.slice(LENGTH_ENCODE_BYTE_SIZE, bytes.length)
    if (byteLength !== byteValue.length) {
      throw new Error(`String length bytes do not match the actual length of string. Expected ${byteLength}, got ${byteValue.length}`)
    }
    return new TextDecoder('utf-8').decode(byteValue)
  }
}

// ============================================================================
// Collection Types
// ============================================================================

/**
 * A tuple ABI type containing other ABI types.
 */
export class ABITupleType extends ABIType {
  /**
   * Creates a new tuple type.
   * @param childTypes The types of the tuple elements
   */
  constructor(public readonly childTypes: ABIType[]) {
    super()
    if (childTypes.length > MAX_LEN) {
      throw new Error(`Tuple has too many child types: ${childTypes.length}`)
    }
  }

  get name(): string {
    const typeStrings: string[] = []
    for (let i = 0; i < this.childTypes.length; i++) {
      typeStrings[i] = this.childTypes[i].name
    }
    return `(${typeStrings.join(',')})`
  }

  equals(other: ABIType): boolean {
    if (!(other instanceof ABITupleType)) return false
    if (this.childTypes.length !== other.childTypes.length) return false
    return this.childTypes.every((t, i) => t.equals(other.childTypes[i]))
  }

  isDynamic(): boolean {
    return this.childTypes.some((c) => c.isDynamic())
  }

  byteLen(): number {
    let size = 0
    let i = 0
    while (i < this.childTypes.length) {
      const childType = this.childTypes[i]
      if (childType instanceof ABIBoolType) {
        const sequenceEndIndex = findBoolSequenceEnd(this.childTypes, i)
        const boolCount = sequenceEndIndex - i + 1
        size += Math.ceil(boolCount / 8)
        i = sequenceEndIndex + 1
      } else {
        size += childType.byteLen()
        i++
      }
    }
    return size
  }

  encode(value: ABIValue): Uint8Array {
    if (!Array.isArray(value) && !(value instanceof Uint8Array)) {
      throw new Error(`Cannot encode value as ${this.toString()}: ${value}`)
    }

    const values = Array.from(value)

    if (this.childTypes.length !== values.length) {
      throw new Error('Mismatch lengths between the values and types')
    }

    const heads: Uint8Array[] = []
    const tails: Uint8Array[] = []
    const isDynamicIndex = new Map<number, boolean>()
    let abiTypesCursor = 0

    while (abiTypesCursor < this.childTypes.length) {
      const childType = this.childTypes[abiTypesCursor]

      if (childType.isDynamic()) {
        isDynamicIndex.set(heads.length, true)
        heads.push(new Uint8Array(2)) // Placeholder for dynamic offset
        tails.push(childType.encode(values[abiTypesCursor]))
      } else {
        if (childType instanceof ABIBoolType) {
          const boolSequenceEndIndex = findBoolSequenceEnd(this.childTypes, abiTypesCursor)
          const boolValues = values.slice(abiTypesCursor, boolSequenceEndIndex + 1)
          const compressedBool = compressBools(boolValues)
          heads.push(new Uint8Array([compressedBool]))
          abiTypesCursor = boolSequenceEndIndex
        } else {
          heads.push(childType.encode(values[abiTypesCursor]))
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
          throw new Error(`Value ${headValue} cannot fit in u16`)
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

  decode(bytes: Uint8Array): ABIValue[] {
    const valuePartitions = extractValues(this.childTypes, bytes)
    const values: ABIValue[] = []

    for (let i = 0; i < this.childTypes.length; i++) {
      const childType = this.childTypes[i]
      const valuePartition = valuePartitions[i]
      const childValue = childType.decode(valuePartition)
      values.push(childValue)
    }

    return values
  }
}

/**
 * A static-length array ABI type.
 */
export class ABIArrayStaticType extends ABIType {
  /**
   * Creates a new static array type.
   * @param childType The type of the array elements
   * @param length The fixed length of the array
   */
  constructor(
    public readonly childType: ABIType,
    public readonly length: number,
  ) {
    super()
    if (length < 0 || length > MAX_LEN) {
      throw new Error(`Invalid static array length: ${length}`)
    }
  }

  get name(): string {
    return `${this.childType.name}[${this.length}]`
  }

  equals(other: ABIType): boolean {
    return other instanceof ABIArrayStaticType && this.childType.equals(other.childType) && this.length === other.length
  }

  isDynamic(): boolean {
    return this.childType.isDynamic()
  }

  byteLen(): number {
    if (this.childType instanceof ABIBoolType) {
      return Math.ceil(this.length / 8)
    }
    return this.childType.byteLen() * this.length
  }

  /**
   * Converts this static array type to an equivalent tuple type.
   * @returns The equivalent tuple type
   */
  toABITupleType(): ABITupleType {
    return new ABITupleType(Array(this.length).fill(this.childType))
  }

  encode(value: ABIValue): Uint8Array {
    if (!Array.isArray(value) && !(value instanceof Uint8Array)) {
      throw new Error(`Cannot encode value as ${this.name}: ${value}`)
    }
    if (value.length !== this.length) {
      throw new Error(`Value array does not match static array length. Expected ${this.length}, got ${value.length}`)
    }
    const convertedTuple = this.toABITupleType()
    return convertedTuple.encode(value)
  }

  decode(bytes: Uint8Array): ABIValue[] | Uint8Array {
    const convertedTuple = this.toABITupleType()
    const decoded = convertedTuple.decode(bytes)

    // Convert byte arrays to Uint8Array
    if (this.childType instanceof ABIByteType && Array.isArray(decoded)) {
      return new Uint8Array(decoded as number[])
    }

    return decoded
  }
}

/**
 * A dynamic-length array ABI type.
 */
export class ABIArrayDynamicType extends ABIType {
  /**
   * Creates a new dynamic array type.
   * @param childType The type of the array elements
   */
  constructor(public readonly childType: ABIType) {
    super()
  }

  get name(): string {
    return `${this.childType.name}[]`
  }

  equals(other: ABIType): boolean {
    return other instanceof ABIArrayDynamicType && this.childType.equals(other.childType)
  }

  isDynamic(): boolean {
    return true
  }

  byteLen(): number {
    throw new Error(`Failed to get size, dynamic array is a dynamic type`)
  }

  /**
   * Converts this dynamic array type to an equivalent tuple type of a given length.
   * @param length The number of elements
   * @returns The equivalent tuple type
   */
  toABITupleType(length: number): ABITupleType {
    return new ABITupleType(Array(length).fill(this.childType))
  }

  encode(value: ABIValue): Uint8Array {
    if (!Array.isArray(value) && !(value instanceof Uint8Array)) {
      throw new Error(`Cannot encode value as ${this.name}: ${value}`)
    }
    const convertedTuple = this.toABITupleType(value.length)
    const encodedTuple = convertedTuple.encode(value)
    const encodedLength = bigIntToBytes(convertedTuple.childTypes.length, LENGTH_ENCODE_BYTE_SIZE)
    return concatArrays(encodedLength, encodedTuple)
  }

  decode(bytes: Uint8Array): ABIValue[] | Uint8Array {
    const view = new DataView(bytes.buffer, 0, LENGTH_ENCODE_BYTE_SIZE)
    const byteLength = view.getUint16(0)
    const convertedTuple = this.toABITupleType(byteLength)
    const decoded = convertedTuple.decode(bytes.slice(LENGTH_ENCODE_BYTE_SIZE, bytes.length))

    // Convert byte arrays to Uint8Array
    if (this.childType instanceof ABIByteType && Array.isArray(decoded)) {
      return new Uint8Array(decoded as number[])
    }

    return decoded
  }
}

/**
 * A struct ABI type with named fields.
 */
export class ABIStructType extends ABIType {
  /**
   * Creates a new struct type.
   * @param structName The name of the struct
   * @param structFields The fields of the struct
   */
  constructor(
    public readonly structName: string,
    public readonly structFields: ABIStructField[],
  ) {
    super()
  }

  get name(): string {
    const tupleType = this.toABITupleType()
    return tupleType.name
  }

  get displayName(): string {
    return this.structName
  }

  equals(other: ABIType): boolean {
    if (!(other instanceof ABIStructType)) return false
    if (this.structName !== other.structName) return false
    if (this.structFields.length !== other.structFields.length) return false
    return this.structFields.every((f, i) => {
      const otherField = other.structFields[i]
      if (f.name !== otherField.name) return false
      if (Array.isArray(f.type) && Array.isArray(otherField.type)) {
        return JSON.stringify(f.type) === JSON.stringify(otherField.type)
      }
      if (f.type instanceof ABIType && otherField.type instanceof ABIType) {
        return f.type.equals(otherField.type)
      }
      return false
    })
  }

  isDynamic(): boolean {
    const tupleType = this.toABITupleType()
    return tupleType.isDynamic()
  }

  byteLen(): number {
    const tupleType = this.toABITupleType()
    return tupleType.byteLen()
  }

  /**
   * Converts this struct type to an equivalent tuple type.
   * @returns The equivalent tuple type
   */
  toABITupleType(): ABITupleType {
    const getABITupleTypeFromABIStructFields = (fields: ABIStructField[]): ABITupleType => {
      const childTypes = fields.map((field) =>
        Array.isArray(field.type)
          ? getABITupleTypeFromABIStructFields(field.type)
          : field.type instanceof ABIStructType
            ? field.type.toABITupleType()
            : field.type,
      )
      return new ABITupleType(childTypes)
    }

    return getABITupleTypeFromABIStructFields(this.structFields)
  }

  /**
   * Creates an ABIStructType from struct name and struct definitions.
   * @param structName The name of the struct
   * @param structs A record of struct definitions
   * @returns The struct type
   */
  static fromStruct(structName: string, structs: Record<string, StructField[]>): ABIStructType {
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
        return ABIStructType.fromStruct(structFieldType, structs)
      }

      // When the input in an ABI type name
      return ABIType.from(structFieldType)
    }

    if (!structs[structName]) throw new Error('Struct not found')

    const fields = structs[structName]
    return new ABIStructType(
      structName,
      fields.map((f) => ({
        name: f.name,
        type: getStructFieldType(f.type),
      })),
    )
  }

  encode(value: ABIValue): Uint8Array {
    if (value instanceof Uint8Array || value instanceof Address || typeof value !== 'object') {
      throw new Error(`Cannot encode value as ${this.name}: ${value}`)
    }

    const tupleType = this.toABITupleType()
    if (Array.isArray(value)) {
      return tupleType.encode(value)
    }

    const tupleValue = this.getTupleValueFromStructValue(value)
    return tupleType.encode(tupleValue)
  }

  decode(bytes: Uint8Array): ABIStructValue {
    const tupleType = this.toABITupleType()
    const tupleValue = tupleType.decode(bytes)
    return this.getStructValueFromTupleValue(tupleValue)
  }

  private getTupleValueFromStructValue(structValue: ABIStructValue): ABIValue[] {
    const getTupleValueFromStructFields = (structFields: ABIStructField[], values: ABIValue[]): ABIValue[] => {
      return structFields.map(({ type }, index) => {
        // if type is an array of fields, treat as unnamed struct
        if (Array.isArray(type)) {
          const value = values[index] as ABIStructValue
          return getTupleValueFromStructFields(type, Object.values(value))
        }
        // if type is struct, treat as struct
        if (type instanceof ABIStructType) {
          const value = values[index] as ABIStructValue
          return getTupleValueFromStructFields(type.structFields, Object.values(value))
        }
        return values[index]
      })
    }

    return getTupleValueFromStructFields(this.structFields, Object.values(structValue))
  }

  private getStructValueFromTupleValue(tupleValue: ABIValue[]): ABIStructValue {
    const getStructFieldValues = (structFields: ABIStructField[], values: ABIValue[]): ABIStructValue => {
      return Object.fromEntries(
        structFields.map(({ name, type }, index) => {
          // When the type is an array of fields, the value must be tuple
          if (Array.isArray(type)) {
            const value = values[index] as ABIValue[]
            return [name, getStructFieldValues(type, value)]
          }
          // When the type is a struct, the value must be tuple
          if (type instanceof ABIStructType) {
            const value = values[index] as ABIValue[]
            return [name, getStructFieldValues(type.structFields, value)]
          }
          return [name, values[index]]
        }),
      )
    }

    return getStructFieldValues(this.structFields, tupleValue)
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

function compressBools(values: ABIValue[]): number {
  if (values.length > 8) {
    throw new Error(`Expected no more than 8 bool values, received ${values.length}`)
  }

  let result = 0
  for (let i = 0; i < values.length; i++) {
    if (typeof values[i] !== 'boolean') {
      throw new Error('Expected all values to be boolean')
    }
    if (values[i]) {
      result |= 1 << (7 - i)
    }
  }

  return result
}

function findBoolSequenceEnd(abiTypes: ABIType[], currentIndex: number): number {
  let cursor = currentIndex
  while (cursor < abiTypes.length) {
    if (abiTypes[cursor] instanceof ABIBoolType) {
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

function extractValues(abiTypes: ABIType[], bytes: Uint8Array): Uint8Array[] {
  const dynamicSegments: Segment[] = []
  const valuePartitions: (Uint8Array | null)[] = []
  let bytesCursor = 0
  let abiTypesCursor = 0

  while (abiTypesCursor < abiTypes.length) {
    const childType = abiTypes[abiTypesCursor]

    if (childType.isDynamic()) {
      if (bytes.length - bytesCursor < LENGTH_ENCODE_BYTE_SIZE) {
        throw new Error('Byte array is too short to be decoded')
      }

      const dynamicIndex = (bytes[bytesCursor] << 8) | bytes[bytesCursor + 1]

      if (dynamicSegments.length > 0) {
        const lastSegment = dynamicSegments[dynamicSegments.length - 1]
        if (dynamicIndex < lastSegment.left) {
          throw new Error('Dynamic index segment miscalculation: left is greater than right index')
        }
        lastSegment.right = dynamicIndex
      }

      dynamicSegments.push({ left: dynamicIndex, right: 0 })
      valuePartitions.push(null)
      bytesCursor += LENGTH_ENCODE_BYTE_SIZE
    } else {
      if (childType instanceof ABIBoolType) {
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
        const childTypeSize = childType.byteLen()
        if (bytesCursor + childTypeSize > bytes.length) {
          throw new Error(
            `Index out of bounds, trying to access bytes[${bytesCursor}..${bytesCursor + childTypeSize}] but slice has length ${bytes.length}`,
          )
        }
        valuePartitions.push(bytes.slice(bytesCursor, bytesCursor + childTypeSize))
        bytesCursor += childTypeSize
      }
    }

    if (abiTypesCursor !== abiTypes.length - 1 && bytesCursor >= bytes.length) {
      throw new Error('Input bytes not enough to decode')
    }
    abiTypesCursor += 1
  }

  if (dynamicSegments.length > 0) {
    const lastSegment = dynamicSegments[dynamicSegments.length - 1]
    lastSegment.right = bytes.length
  } else if (bytesCursor < bytes.length) {
    throw new Error('Input bytes not fully consumed')
  }

  for (let i = 0; i < dynamicSegments.length; i++) {
    const segment = dynamicSegments[i]
    if (segment.left > segment.right) {
      throw new Error('Dynamic segment should display a [l, r] space with l <= r')
    }
    if (i !== dynamicSegments.length - 1 && segment.right !== dynamicSegments[i + 1].left) {
      throw new Error('Dynamic segments should be consecutive')
    }
  }

  let segmentIndex = 0
  for (let i = 0; i < abiTypes.length; i++) {
    const childType = abiTypes[i]
    if (childType.isDynamic()) {
      valuePartitions[i] = bytes.slice(dynamicSegments[segmentIndex].left, dynamicSegments[segmentIndex].right)
      segmentIndex += 1
    }
  }

  const result: Uint8Array[] = []
  for (let i = 0; i < valuePartitions.length; i++) {
    const partition = valuePartitions[i]
    if (partition === null) {
      throw new Error(`Value partition at index ${i} is None`)
    }
    result.push(partition)
  }

  return result
}

export function parseTupleContent(content: string): string[] {
  if (content === '') {
    return []
  }

  if (content.startsWith(',')) {
    throw new Error('The content should not start with comma')
  }
  if (content.endsWith(',')) {
    throw new Error('The content should not end with comma')
  }
  if (content.includes(',,')) {
    throw new Error('The content should not have consecutive commas')
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
    throw new Error('The content has mismatched parentheses')
  }

  return tupleStrings
}
