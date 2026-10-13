import algosdk from 'algosdk'
import { describe, expect, test } from 'vitest'
import { getABIEncodedValue, getABITupleFromABIStruct, getStructFieldsForAbiType } from './app-arc56'

/** Mirrors algokit-utils-ts#574: ARC-56 Message { suite: byte[6], encapsulatedKey: byte[], ciphertext: byte[] } */
const messageStructs = {
  Message: [
    { name: 'suite', type: 'byte[6]' },
    { name: 'encapsulatedKey', type: 'byte[]' },
    { name: 'ciphertext', type: 'byte[]' },
  ],
}

const suite = new Uint8Array([1, 2, 3, 4, 5, 6])
const encapsulatedKey = new Uint8Array(32).fill(9)
const ciphertext = new Uint8Array(28).fill(7)

describe('ARC56 struct ABI order', () => {
  test('getABITupleFromABIStruct follows struct field order, not object insertion order', () => {
    const shuffled = { ciphertext, suite, encapsulatedKey }
    const tuple = getABITupleFromABIStruct(shuffled, messageStructs.Message, messageStructs)

    expect(tuple).toEqual([suite, encapsulatedKey, ciphertext])
  })

  test('getABIEncodedValue is stable when encoding a named struct with shuffled keys', () => {
    const inOrder = getABIEncodedValue({ suite, encapsulatedKey, ciphertext }, 'Message', messageStructs)
    const shuffled = getABIEncodedValue({ ciphertext, suite, encapsulatedKey }, 'Message', messageStructs)

    expect(shuffled).toEqual(inOrder)
  })

  test('getABIEncodedValue is stable when the type is the ABI tuple string (not the struct name)', () => {
    const tupleType = '(byte[6],byte[],byte[])'
    const inOrder = getABIEncodedValue({ suite, encapsulatedKey, ciphertext }, tupleType, messageStructs)
    const shuffled = getABIEncodedValue({ ciphertext, suite, encapsulatedKey }, tupleType, messageStructs)

    expect(shuffled).toEqual(inOrder)
    expect(getStructFieldsForAbiType(tupleType, messageStructs)).toEqual(messageStructs.Message)
  })

  test('algosdk cannot encode a POJO as a tuple; Object.values insertion order hits the static-array length error', () => {
    const tupleType = algosdk.ABIType.from('(byte[6],byte[],byte[])')
    const shuffled = { ciphertext, suite, encapsulatedKey }

    expect(() => tupleType.encode(shuffled as unknown as algosdk.ABIValue[])).toThrow(/Cannot encode value/)
    expect(() => tupleType.encode(Object.values(shuffled) as algosdk.ABIValue[])).toThrow(/Expected 6, got 28/)
  })

  test('getABIEncodedValue returns the encoded bytes when the value is already a tuple array', () => {
    const encoded = getABIEncodedValue([suite, encapsulatedKey, ciphertext], 'Message', messageStructs)
    const fromStruct = getABIEncodedValue({ suite, encapsulatedKey, ciphertext }, 'Message', messageStructs)

    expect(encoded).toEqual(fromStruct)
    expect(encoded.byteLength).toBeGreaterThan(0)
  })
})
