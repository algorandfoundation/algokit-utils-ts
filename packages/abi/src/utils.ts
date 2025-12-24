import type { ABIStructField, ABIStructType, ABIType } from './abi-type'
import type { ABIStructValue, ABIValue } from './abi-value'

/**
 * Checks if a type is an ABIStructType by checking for the structFields property.
 */
function isABIStructType(type: ABIType | ABIStructField[]): type is ABIStructType {
  return !Array.isArray(type) && 'structFields' in type
}

/**
 * Converts a struct value (object with named fields) to a tuple value (array).
 * @param structType The struct type definition
 * @param structValue The struct value to convert
 * @returns The equivalent tuple value
 */
export function getTupleValueFromStructValue(structType: ABIStructType, structValue: ABIStructValue): ABIValue[] {
  const getTupleValueFromStructFields = (structFields: ABIStructField[], values: ABIValue[]): ABIValue[] => {
    return structFields.map(({ type }, index) => {
      // if type is an array of fields, treat as unnamed struct
      if (Array.isArray(type)) {
        const value = values[index] as ABIStructValue
        return getTupleValueFromStructFields(type, Object.values(value))
      }
      // if type is struct, treat as struct
      if (isABIStructType(type)) {
        const value = values[index] as ABIStructValue
        return getTupleValueFromStructFields(type.structFields, Object.values(value))
      }
      return values[index]
    })
  }

  return getTupleValueFromStructFields(structType.structFields, Object.values(structValue))
}

/**
 * Converts a tuple value (array) to a struct value (object with named fields).
 * @param structType The struct type definition
 * @param tupleValue The tuple value to convert
 * @returns The equivalent struct value
 */
export function getStructValueFromTupleValue(structType: ABIStructType, tupleValue: ABIValue[]): ABIStructValue {
  const getStructFieldValues = (structFields: ABIStructField[], values: ABIValue[]): ABIStructValue => {
    return Object.fromEntries(
      structFields.map(({ name, type }, index) => {
        // When the type is an array of fields, the value must be tuple
        if (Array.isArray(type)) {
          const value = values[index] as ABIValue[]
          return [name, getStructFieldValues(type, value)]
        }
        // When the type is a struct, the value must be tuple
        if (isABIStructType(type)) {
          const value = values[index] as ABIValue[]
          return [name, getStructFieldValues(type.structFields, value)]
        }
        return [name, values[index]]
      }),
    )
  }

  return getStructFieldValues(structType.structFields, tupleValue)
}
