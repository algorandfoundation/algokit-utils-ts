import { ABIType, ABITypeName, getABIType } from '../../abi-type'
import { ABIStructValue, ABIValue } from '../../abi-value'
import { StructField } from '../../arc56-contract'
import { ABITupleType, ABITupleValue, decodeTuple, encodeTuple, tupleToString } from './tuple'

export type ABIStructType = {
  name: ABITypeName.Struct
  structName: string
  structFields: ABIStructField[]
}

export type ABIStructField = {
  name: string
  type: ABIType | ABIStructField[]
}

export type ABIStructValue = {
  type: ABITypeName.Struct
  data: {
    [key: string]: ABIValue
  }
}

export function encodeStruct(type: ABIStructType, value: ABIValue): Uint8Array {
  if (value.type !== ABITypeName.Struct) {
    throw new Error(`Encoding Error: value type must be Struct`)
  }

  const tupleType = getABITupleTypeFromABIStructType(type)
  const tupleValue = getABITupleValueFromABIStructValue(type, value.data)
  return encodeTuple(tupleType, tupleValue)
}

export function decodeStruct(type: ABIStructType, bytes: Uint8Array): ABIStructValue {
  const tupleType = getABITupleTypeFromABIStructType(type)
  const tupleValue = decodeTuple(tupleType, bytes)

  return getABIStructValueFromABITupleValue(type.structFields, tupleValue)
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

export function getABITupleTypeFromABIStructType(struct: ABIStructType): ABITupleType {
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

export function structToString(type: ABIStructType): string {
  const tupleType = getABITupleTypeFromABIStructType(type)
  return tupleToString(tupleType)
}

function getABITupleValueFromABIStructValue(structType: ABIStructType, structValue: ABIStructValue): ABITupleValue {
  function getABITupleValueFromABIStructFields(structFields: ABIStructField[], values: ABIValue[]): ABITupleValue {
    const tupleValues = structFields.map(({ type }, index) => {
      // if type is an array of field, this is a tuple
      if (Array.isArray(type)) {
        const valuesAtIndex = values[index] as ABITupleValue
        return getABITupleValueFromABIStructFields(type, valuesAtIndex.data)
      }
      // if type is struct, this is a struct
      if (type.name === ABITypeName.Struct) {
        const valuesAtIndex = values[index] as ABIStructValue
        return getABITupleValueFromABIStructValue(type, valuesAtIndex)
      }
      return values[index]
    })

    return { type: ABITypeName.Tuple, data: tupleValues }
  }

  return getABITupleValueFromABIStructFields(structType.structFields, Object.values(structValue.data))
}

function getABIStructValueFromABITupleValue(structFields: ABIStructField[], values: ABIValue[]): Record<string, ABIValue> {
  return Object.fromEntries(
    structFields.map(({ name, type }, index) => {
      if (Array.isArray(type)) {
        const valuesAtIndex = values[index] as ABIValue[]
        return [name, getABIStructValueFromABITupleValue(type, valuesAtIndex)]
      }
      if (type.name === ABITypeName.Struct) {
        const valuesAtIndex = values[index] as ABIValue[]
        return [name, getABIStructValueFromABITupleValue(type.structFields, valuesAtIndex)]
      }
      return [name, values[index]]
    }),
  )
}

// TODO: unit tests this, really just need to test that we can convert struct <-> tuple
