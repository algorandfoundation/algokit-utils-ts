import {
  decodeMsgpack,
  encodeMsgpack,
  ObjectModelCodec,
  stringifyJson,
  type EncodingFormat,
  type ObjectModelMetadata,
} from '@algorandfoundation/algokit-common'

export class AlgorandSerializer {
  static encode<T extends Record<string, unknown>>(value: T, meta: ObjectModelMetadata<T>, format: 'json'): string
  static encode<T extends Record<string, unknown>>(value: T, meta: ObjectModelMetadata<T>, format?: 'msgpack'): Uint8Array
  static encode<T extends Record<string, unknown>>(
    value: T,
    meta: ObjectModelMetadata<T>,
    format: EncodingFormat = 'msgpack',
  ): Uint8Array | string {
    const wire = new ObjectModelCodec(meta).encode(value, format)
    return format === 'msgpack' ? encodeMsgpack(wire) : stringifyJson(wire)
  }

  static decode<T extends Record<string, unknown>>(
    value: Uint8Array | Record<string, unknown>,
    meta: ObjectModelMetadata<T>,
    format: EncodingFormat = 'msgpack',
  ): T {
    const wire = value instanceof Uint8Array ? decodeMsgpack(value) : value
    return new ObjectModelCodec<T>(meta).decode(wire, format)
  }
}
