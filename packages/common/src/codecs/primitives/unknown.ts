import { Buffer } from 'buffer'
import { Codec } from '../codec'
import type { BodyFormat } from '../types'

/**
 * Unknown codec - passthrough for unknown/any types
 * Converts Maps with Uint8Array keys to objects with string keys recursively
 */
export class UnknownCodec extends Codec<unknown, unknown> {
  public defaultValue(): unknown {
    return undefined
  }

  protected toEncoded(value: unknown, _format: BodyFormat): unknown {
    return value
  }

  protected fromEncoded(value: unknown, _format: BodyFormat): unknown {
    return this.mapToObject(value)
  }

  /**
   * Recursively convert Maps with Uint8Array keys to objects with string keys
   */
  private mapToObject(value: unknown): unknown {
    if (value === null || value === undefined) return value
    if (value instanceof Uint8Array) return value
    if (typeof value === 'bigint') return value
    if (typeof value === 'number') return value
    if (typeof value === 'string') return value
    if (typeof value === 'boolean') return value

    if (Array.isArray(value)) {
      return value.map((item) => this.mapToObject(item))
    }

    if (value instanceof Map) {
      const result: Record<string, unknown> = {}
      for (const [k, v] of value.entries()) {
        const keyStr = k instanceof Uint8Array ? Buffer.from(k).toString('utf-8') : String(k)
        result[keyStr] = this.mapToObject(v)
      }
      return result
    }

    if (typeof value === 'object') {
      const result: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(value)) {
        result[k] = this.mapToObject(v)
      }
      return result
    }

    return value
  }
}

export const unknownCodec = new UnknownCodec()
