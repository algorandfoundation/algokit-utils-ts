import { ABIType, ABITypeName, getABIType } from '../../abi-type'
import { ABIValue } from '../../abi-value'
import { StructField } from '../../arc56-contract'
import { ABITupleType, decodeTuple, encodeTuple, tupleToString } from './tuple'

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
  const tupleType = getABITupleTypeFromABIStructType(type)
  return encodeTuple(tupleType, value)
}

export function decodeStruct(type: ABIStructType, bytes: Uint8Array): ABIValue {
  const tupleType = getABITupleTypeFromABIStructType(type)
  return decodeTuple(tupleType, bytes)
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
