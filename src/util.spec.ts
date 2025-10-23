import { convertAbiByteArrays as convertAbiByteArrays } from './util'

import { describe, it, expect } from 'vitest'
import { ABIValue, ABIByteType, ABIArrayStaticType, ABIArrayDynamicType, ABITupleType, ABIBoolType, ABIUintType } from './sdk' // Adjust this import path

describe('convertAbiByteArrays', () => {
  describe('Basic byte arrays', () => {
    it('should convert a simple byte array to Uint8Array', () => {
      // Create a static array of bytes: byte[4]
      const byteType = new ABIByteType()
      const arrayType = new ABIArrayStaticType(byteType, 4)

      const value = [1, 2, 3, 4]
      const result = convertAbiByteArrays(value, arrayType)

      expect(result).toBeInstanceOf(Uint8Array)
      expect(Array.from(result as Uint8Array)).toEqual([1, 2, 3, 4])
    })

    it('should handle dynamic byte arrays', () => {
      // Create a dynamic array of bytes: byte[]
      const byteType = new ABIByteType()
      const arrayType = new ABIArrayDynamicType(byteType)

      const value = [10, 20, 30, 40, 50]
      const result = convertAbiByteArrays(value, arrayType)

      expect(result).toBeInstanceOf(Uint8Array)
      expect(Array.from(result as Uint8Array)).toEqual([10, 20, 30, 40, 50])
    })

    it('should return existing Uint8Array as is', () => {
      const byteType = new ABIByteType()
      const arrayType = new ABIArrayStaticType(byteType, 3)

      const value = new Uint8Array([5, 6, 7])
      const result = convertAbiByteArrays(value, arrayType)

      expect(result).toBe(value) // Should be the same instance
    })
  })

  describe('Nested arrays', () => {
    it('should convert byte arrays inside arrays', () => {
      // Create byte[2][]
      const byteType = new ABIByteType()
      const innerArrayType = new ABIArrayStaticType(byteType, 2)
      const outerArrayType = new ABIArrayDynamicType(innerArrayType)

      const value = [
        [1, 2],
        [3, 4],
        [5, 6],
      ]
      const result = convertAbiByteArrays(value, outerArrayType) as ABIValue[]

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(3)

      result.forEach((item) => {
        expect(item).toBeInstanceOf(Uint8Array)
      })

      expect(Array.from(result[0] as Uint8Array)).toEqual([1, 2])
      expect(Array.from(result[1] as Uint8Array)).toEqual([3, 4])
      expect(Array.from(result[2] as Uint8Array)).toEqual([5, 6])
    })

    it('should not convert non-byte arrays', () => {
      // Create uint8[3]
      const uintType = new ABIUintType(8)
      const arrayType = new ABIArrayStaticType(uintType, 3)

      const value = [1, 2, 3]
      const result = convertAbiByteArrays(value, arrayType)

      expect(Array.isArray(result)).toBe(true)
      expect(result).toEqual([1, 2, 3])
    })
  })

  describe('Tuple tests', () => {
    it('should handle tuples with byte arrays', () => {
      // Create (byte[2],bool,byte[3])
      const byteType = new ABIByteType()
      const byteArray2Type = new ABIArrayStaticType(byteType, 2)
      const byteArray3Type = new ABIArrayStaticType(byteType, 3)
      const boolType = new ABIBoolType()

      const tupleType = new ABITupleType([byteArray2Type, boolType, byteArray3Type])

      const value = [[1, 2], true, [3, 4, 5]]
      const result = convertAbiByteArrays(value, tupleType) as ABIValue[]

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(3)

      expect(result[0]).toBeInstanceOf(Uint8Array)
      expect(result[1]).toBe(true)
      expect(result[2]).toBeInstanceOf(Uint8Array)

      expect(Array.from(result[0] as Uint8Array)).toEqual([1, 2])
      expect(Array.from(result[2] as Uint8Array)).toEqual([3, 4, 5])
    })

    it('should handle nested tuples with byte arrays', () => {
      // Create (byte[2],(byte[1],bool))
      const byteType = new ABIByteType()
      const byteArray2Type = new ABIArrayStaticType(byteType, 2)
      const byteArray1Type = new ABIArrayStaticType(byteType, 1)
      const boolType = new ABIBoolType()

      const innerTupleType = new ABITupleType([byteArray1Type, boolType])
      const outerTupleType = new ABITupleType([byteArray2Type, innerTupleType])

      const value = [
        [1, 2],
        [[3], true],
      ]
      const result = convertAbiByteArrays(value, outerTupleType) as ABIValue[]

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(2)

      expect(result[0]).toBeInstanceOf(Uint8Array)
      expect(Array.from(result[0] as Uint8Array)).toEqual([1, 2])

      const nestedTuple = result[1] as ABIValue[]
      expect(Array.isArray(nestedTuple)).toBe(true)
      expect(nestedTuple.length).toBe(2)
      expect(nestedTuple[0]).toBeInstanceOf(Uint8Array)
      expect(Array.from(nestedTuple[0] as Uint8Array)).toEqual([3])
      expect(nestedTuple[1]).toBe(true)
    })
  })

  describe('Complex mixed structures', () => {
    it('should handle complex nested structures', () => {
      // Create (byte[2][],uint8,(bool,byte[3]))
      const byteType = new ABIByteType()
      const byteArray2Type = new ABIArrayStaticType(byteType, 2)
      const byteArrayDynType = new ABIArrayDynamicType(byteArray2Type)
      const uintType = new ABIUintType(8)
      const boolType = new ABIBoolType()
      const byteArray3Type = new ABIArrayStaticType(byteType, 3)

      const innerTupleType = new ABITupleType([boolType, byteArray3Type])
      const outerTupleType = new ABITupleType([byteArrayDynType, uintType, innerTupleType])

      const value = [
        [
          [1, 2],
          [3, 4],
          [5, 6],
        ], // byte[2][]
        123, // uint8
        [true, [7, 8, 9]], // (bool,byte[3])
      ]

      const result = convertAbiByteArrays(value, outerTupleType) as ABIValue[]

      // Check first element (byte[2][])
      const byteArrays = result[0] as ABIValue[]
      expect(Array.isArray(byteArrays)).toBe(true)
      expect(byteArrays.length).toBe(3)
      byteArrays.forEach((item) => {
        expect(item).toBeInstanceOf(Uint8Array)
      })

      // Check second element (uint8)
      expect(result[1]).toBe(123)

      // Check third element (bool,byte[3])
      const tuple = result[2] as ABIValue[]
      expect(tuple[0]).toBe(true)
      expect(tuple[1]).toBeInstanceOf(Uint8Array)
      expect(Array.from(tuple[1] as Uint8Array)).toEqual([7, 8, 9])
    })
  })

  describe('Edge cases', () => {
    it('should handle empty byte arrays', () => {
      const byteType = new ABIByteType()
      const arrayType = new ABIArrayStaticType(byteType, 0)

      const value: number[] = []
      const result = convertAbiByteArrays(value, arrayType)

      expect(result).toBeInstanceOf(Uint8Array)
      expect((result as Uint8Array).length).toBe(0)
    })
  })
})
