import { LENGTH_ENCODE_BYTE_SIZE } from 'algosdk'
import { BOOL_FALSE_BYTE, BOOL_TRUE_BYTE, PUBLIC_KEY_BYTE_LENGTH } from '../../../constants'
import { ABIType, ABITypeName, decodeABIValue, encodeABIValue, getABITypeName } from '../../abi-type'
import { ABIValue } from '../../abi-value'
import { getABITupleTypeFromABIStructType } from './struct'

/**
 * A tuple of other ABI types.
 */
export type ABITupleType = {
  name: ABITypeName.Tuple
  childTypes: ABIType[]
}

export type ABITupleValue = {
  type: ABITypeName.Tuple
  data: ABIValue[]
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
    if (values[i].type !== ABITypeName.Bool) {
      throw new Error('Encoding Error: Expected all values to be boolean')
    }
    if (values[i].data) {
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
  if (value.type !== ABITypeName.Tuple) {
    throw new Error(`Encoding Error: value type must be Tuple`)
  }

  const childTypes = type.childTypes
  const values = value.data

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

export function decodeTuple(type: ABITupleType, bytes: Uint8Array): ABITupleValue {
  const childTypes = type.childTypes
  const valuePartitions = extractValues(childTypes, bytes)
  const values: ABIValue[] = []

  for (let i = 0; i < childTypes.length; i++) {
    const childType = childTypes[i]
    const valuePartition = valuePartitions[i]
    const childValue = decodeABIValue(childType, valuePartition)
    values.push(childValue)
  }

  return {
    type: ABITypeName.Tuple,
    data: values,
  }
}

export function tupleToString(type: ABITupleType): string {
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
