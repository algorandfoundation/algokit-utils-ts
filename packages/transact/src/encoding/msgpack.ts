import { decode as msgpackDecode, encode as msgpackEncode } from 'algorand-msgpack'
import { SignedTransactionDto } from './signed-transaction-dto'
import { TransactionDto } from './transaction-dto'

export function encodeMsgpack<T extends SignedTransactionDto | TransactionDto | { txlist: Uint8Array[] }>(data: T): Uint8Array {
  return new Uint8Array(msgpackEncode(data, { sortKeys: true, ignoreUndefined: true }))
}

export function decodeMsgpack<T extends SignedTransactionDto | TransactionDto>(encoded: Uint8Array): T {
  // The message pack needs to be decoded into map, so we support number, bigint and Uint8Array keys.
  // Additionally we need to use rawBinaryStrings for both keys and values to avoid incorrect utf-8 decoding.
  // After that, the map is converted to the targeted object
  const map = msgpackDecode(encoded, { useMap: true, rawBinaryStringKeys: true, rawBinaryStringValues: true }) as unknown
  return decodedMapToObject(map) as T
}

/**
 * Converts a decoded msgpack Map structure to a plain object structure.
 * Maps are converted to objects recursively, except for the special case
 * where the field name is "r" which remains as a Map.
 */
export function decodedMapToObject(value: unknown, fieldName?: string): unknown {
  // Convert Uint8Array to string for specific fields, otherwise preserve as-is
  if (value instanceof Uint8Array) {
    if (fieldName && ['type', 'gen', 'un', 'an', 'au'].includes(fieldName)) {
      return Buffer.from(value).toString('utf-8')
    }
    return value
  } else if (value instanceof Map) {
    // Special case: keep "r" field as Map
    if (fieldName === 'r') {
      const newMap = new Map()
      for (const [k, v] of value.entries()) {
        const normalisedKey = k instanceof Uint8Array ? Buffer.from(k).toString('utf-8') : k
        newMap.set(normalisedKey, decodedMapToObject(v, normalisedKey))
      }
      return newMap
    }

    // Convert Map to object
    const obj: Record<string, unknown> = {}
    for (const [k, v] of value.entries()) {
      const normalisedKey = k instanceof Uint8Array ? Buffer.from(k).toString('utf-8') : k
      obj[normalisedKey] = decodedMapToObject(v, normalisedKey)
    }
    return obj
  } else if (Array.isArray(value)) {
    return value.map((item) => decodedMapToObject(item, fieldName))
  }

  return value
}
