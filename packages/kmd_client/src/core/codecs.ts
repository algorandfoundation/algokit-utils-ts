import { decode as msgpackDecode, encode as msgpackEncode } from 'algorand-msgpack'

export function encodeMsgPack<T>(data: T): Uint8Array {
  return new Uint8Array(msgpackEncode(data, { sortKeys: true, ignoreUndefined: true }))
}

export function decodeMsgPack<T = unknown>(buffer: Uint8Array): T {
  const map = msgpackDecode(buffer, { useMap: true }) as unknown
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
