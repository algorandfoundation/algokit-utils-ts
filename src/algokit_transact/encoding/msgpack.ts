import { encode as msgpackEncode, decode as msgpackDecode } from 'algorand-msgpack'

export function encodeMsgpack<T>(data: T): Uint8Array {
  return new Uint8Array(msgpackEncode(data, { sortKeys: true, ignoreUndefined: true }))
}

export function decodeMsgpack<T>(encoded: Uint8Array): T {
  // The message pack needs to be decoded into map first to support Maps with bigint as key
  // After that, the map is converted to the targeted object
  const map = msgpackDecode(encoded, { useMap: true }) as unknown
  return mapToObject(map) as T
}

/**
 * Converts a Map structure from msgpack decoding to a plain object structure.
 * Maps are converted to objects recursively, except for the special case
 * where the field name is "r" which remains as a Map.
 */
export function mapToObject(value: unknown, fieldName?: string): unknown {
  // Preserve Uint8Array as-is
  if (value instanceof Uint8Array) {
    return value
  } else if (value instanceof Map) {
    // Special case: keep "r" field as Map
    if (fieldName === 'r') {
      const newMap = new Map()
      for (const [k, v] of value.entries()) {
        newMap.set(k, mapToObject(v))
      }
      return newMap
    }

    // Convert Map to object
    const obj: Record<string, unknown> = {}
    for (const [k, v] of value.entries()) {
      obj[k] = mapToObject(v, k)
    }
    return obj
  } else if (Array.isArray(value)) {
    return value.map((item) => mapToObject(item))
  }

  return value
}
