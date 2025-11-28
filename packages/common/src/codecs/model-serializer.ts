import { Buffer } from 'buffer'
/**
 * Represents a map key coming off the wire.
 */
export type WireMapKey = Uint8Array | number | bigint

/**
 * Represents object data coming off the wire.
 *
 * When from msgpack it's a Map. Both bytes and string keys are represented as Uint8Array.
 * When from JSON it's a plain object with string keys.
 */
export type WireObject = Record<string, unknown> | Map<WireMapKey, unknown>

/**
 * Represents a bigint value coming off the wire.
 *
 * When from msgpack it could be a number or bigint, depending on size.
 * When from JSON it could be a number or bigint (because of how we configure JSONbig), depending on size.
 */
export type WireBigInt = number | bigint

/**
 * Represents either a bytes or string value coming off the wire.
 *
 * When from msgpack it's a Uint8Array for both bytes or string values.
 * When from JSON it's a base64-encoded bytes string or regular string.
 */
export type WireStringOrBytes = Uint8Array | string

export function normalizeKey(key: string | WireMapKey): string {
  return key instanceof Uint8Array ? Buffer.from(key).toString('utf-8') : typeof key === 'string' ? key : String(key)
}

/**
 * Type-safe helper to get a value from either a Map or object
 */
export function getWireValue<T = unknown>(value: WireObject, key: string | WireMapKey): T | undefined {
  if (value instanceof Map) {
    const decodedKey = normalizeKey(key)
    // Try direct key lookup
    if (typeof decodedKey !== 'string' && value.has(decodedKey)) {
      return value.get(decodedKey) as T | undefined
    }
    // Search for Uint8Array key that matches when decoded to string
    for (const [k, v] of value.entries()) {
      if (k instanceof Uint8Array) {
        const keyStr = Buffer.from(k).toString('utf-8')
        if (keyStr === decodedKey) {
          return v as T | undefined
        }
      }
    }
    return undefined
  }
  if (typeof key === 'string' && typeof value === 'object') {
    return value[key] as T | undefined
  }
  return undefined
}

// TODO: NC - Move everything here elsewhere
