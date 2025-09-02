import { ABIType, ABITypeName, getABIType } from '../../abi-type'
import { ABIValue } from '../../abi-value'
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
    // TODO: standardise error messages
    throw new Error(`Encoding Error: value type must be Struct, received ${value.type}`)
  }

  const tupleType = getABITupleTypeFromABIStructType(type)
  const tupleValue = getTupleValueFromStructValue(type, value)
  return encodeTuple(tupleType, tupleValue)
}

export function decodeStruct(type: ABIStructType, bytes: Uint8Array): ABIStructValue {
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

function getTupleValueFromStructValue(structType: ABIStructType, structValue: ABIStructValue): ABITupleValue {
  function getTupleValueFromStructFields(structFields: ABIStructField[], values: ABIValue[]): ABITupleValue {
    const tupleValues = structFields.map(({ type }, index) => {
      // if type is an array of fields, the value must be tuple
      if (Array.isArray(type)) {
        const value = values[index]
        if (value.type !== ABITypeName.Tuple) {
          throw new Error(`Encoding Error: value type must be Tuple, received ${value.type}`)
        }
        return getTupleValueFromStructFields(type, value.data)
      }
      // if type is struct, , the value must be struct
      if (type.name === ABITypeName.Struct) {
        const value = values[index]
        if (value.type !== ABITypeName.Struct) {
          throw new Error(`Encoding Error: value type must be Struct, received ${value.type}`)
        }
        return getTupleValueFromStructFields(type.structFields, Object.values(value.data))
      }
      return values[index]
    })

    return { type: ABITypeName.Tuple, data: tupleValues }
  }

  return getTupleValueFromStructFields(structType.structFields, Object.values(structValue.data))
}

function getStructValueFromTupleValue(structType: ABIStructType, tupleValue: ABITupleValue): ABIStructValue {
  function getStructFieldValues(structFields: ABIStructField[], values: ABIValue[]): Record<string, ABIValue> {
    return Object.fromEntries(
      structFields.map(({ name, type }, index) => {
        // When the type is an array of fields, the value must be tuple
        if (Array.isArray(type)) {
          const value = values[index]
          if (value.type !== ABITypeName.Tuple) {
            throw new Error(`Decoding Error: value type must be Tuple, received ${value.type}`)
          }
          return [name, getStructFieldValues(type, value.data)]
        }
        // When the type is a struct, the value must be tuple
        if (type.name === ABITypeName.Struct) {
          const value = values[index]
          if (value.type !== ABITypeName.Tuple) {
            throw new Error(`Decoding Error: value type must be Tuple, received ${value.type}`)
          }
          return [name, getStructFieldValues(type.structFields, value.data)]
        }
        return [name, values[index]]
      }),
    )
  }

  return {
    type: ABITypeName.Struct,
    data: getStructFieldValues(structType.structFields, tupleValue.data),
  }
}

// TODO: unit tests this, really just need to test that we can convert struct <-> tuple
