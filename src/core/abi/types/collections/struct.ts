import { ABIType, ABITypeName, getABIType } from '../../abi-type'
import { ABIStructValue, ABIValue } from '../../abi-value'
import { StructField } from '../../arc56-contract'
import { ABITupleType, decodeTuple, encodeTuple } from './tuple'

export type ABIStructType = {
  name: ABITypeName.Struct
  structName: string
  structFields: ABIStructField[]
}

export type ABIStructField = {
  name: string
  type: ABIType | ABIStructField[]
}

export function encodeStruct(type: ABIStructType, value: ABIValue): Uint8Array {
  if (typeof value !== 'object' || Array.isArray(value) || value instanceof Uint8Array) {
    throw new Error(`Cannot encode value as ${structToString(type)}: ${value}`)
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
