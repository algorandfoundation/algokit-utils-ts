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
export type WireObject<TValue = unknown> = Record<string, TValue> | Map<WireMapKey, TValue>

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
export type WireString = Uint8Array | string

function normalizeWireKey(key: string | WireMapKey): string {
  return key instanceof Uint8Array ? normalizeWireString(key) : key.toString()
}

export function normalizeWireString(value: WireString): string {
  return value instanceof Uint8Array ? Buffer.from(value).toString('utf-8') : value
}

export function normalizeWireObject(wireObject: WireObject): Record<string, unknown> {
  if (wireObject instanceof Map) {
    const normalized: Record<string, unknown> = {}
    for (const [key, value] of wireObject.entries()) {
      normalized[normalizeWireKey(key)] = value
    }
    return normalized
  }

  return wireObject
}
