import {
  addressFromPublicKey,
  decodedTransactionMapToObject,
  fromSignedTransactionDto,
  toSignedTransactionDto,
  type SignedTransaction,
} from '@algorandfoundation/algokit-transact'
import { Buffer } from 'buffer'
import { ApiData, decodeMsgPack, encodeMsgPack } from './codecs'

export type BodyFormat = 'json' | 'msgpack' | 'map'

export interface ScalarFieldType {
  readonly kind: 'scalar'
  // TODO: NC - Make this a type field
  readonly isBytes?: boolean
  readonly isBigint?: boolean
  readonly isAddress?: boolean
}

// TODO: NC - Needs to be renamed
export interface CodecFieldType {
  readonly kind: 'codec'
  readonly codecKey: string
}

export interface ModelFieldType {
  readonly kind: 'model'
  readonly meta: ModelMetadata | (() => ModelMetadata)
}

export interface ArrayFieldType {
  readonly kind: 'array'
  readonly item: FieldType
}

export interface RecordFieldType {
  readonly kind: 'record'
  readonly value: FieldType
}

export interface MapFieldType {
  readonly kind: 'map'
  readonly keyType: 'number' | 'bigint' | 'bytes'
  readonly value: FieldType
}

export type FieldType = ScalarFieldType | CodecFieldType | ModelFieldType | ArrayFieldType | RecordFieldType | MapFieldType

export interface FieldMetadata {
  readonly name: string
  readonly wireKey?: string
  readonly optional: boolean
  readonly nullable: boolean
  readonly type: FieldType
  /**
   * If true and the field is a SignedTransaction codec, its encoded map entries
   * are merged into the parent object (no own wire key).
   */
  readonly flattened?: boolean
}

export type ModelKind = 'object' | 'array' | 'passthrough'

export interface ModelMetadata {
  readonly name: string
  readonly kind: ModelKind
  readonly fields?: readonly FieldMetadata[]
  readonly arrayItems?: FieldType
  readonly codecKey?: string
  readonly additionalProperties?: FieldType
  readonly passThrough?: FieldType
}

// Registry for model metadata to avoid direct circular imports between model files
const modelMetaRegistry = new Map<string, ModelMetadata>()

export function registerModelMeta(name: string, meta: ModelMetadata): void {
  modelMetaRegistry.set(name, meta)
}

export function getModelMeta(name: string): ModelMetadata {
  const meta = modelMetaRegistry.get(name)
  if (!meta) throw new Error(`Model metadata not registered: ${name}`)
  return meta
}

export interface EncodeableTypeConverter<T extends Record<string, unknown>> {
  beforeEncoding(value: T, format: BodyFormat): Record<string, unknown>
  afterDecoding(decoded: Record<string, unknown> | Map<number | bigint | Uint8Array, unknown>, format: BodyFormat): T
}

const encodeableTypeConverterRegistry = new Map<string, EncodeableTypeConverter<Record<string, unknown>>>()

export function registerEncodeableTypeConverter(key: string, codec: EncodeableTypeConverter<Record<string, unknown>>): void {
  encodeableTypeConverterRegistry.set(key, codec)
}

export class AlgorandSerializer {
  static encode(value: Record<string, unknown>, meta: ModelMetadata, format: 'map'): Map<string, unknown>
  static encode(value: Record<string, unknown>, meta: ModelMetadata, format: 'json'): string
  static encode(value: Record<string, unknown>, meta: ModelMetadata, format?: 'msgpack'): Uint8Array
  static encode(
    value: Record<string, unknown>,
    meta: ModelMetadata,
    format: BodyFormat = 'msgpack',
  ): Uint8Array | string | Map<string, unknown> {
    if (format === 'map') {
      // For map format, use msgpack transformation to preserve types like bigint, then convert to nested Maps
      const wire = this.transform(value, meta, { direction: 'encode', format: 'msgpack' })
      return this.convertToNestedMaps(wire) as Map<string, unknown>
    }

    const wire = this.transform(value, meta, { direction: 'encode', format })
    if (format === 'msgpack') {
      return wire instanceof Uint8Array ? wire : encodeMsgPack(wire)
    }
    return typeof wire === 'string' ? wire : JSON.stringify(wire)
  }

  static decode<T>(value: Uint8Array | string, meta: ModelMetadata, format: BodyFormat = 'msgpack'): T {
    let wire: ApiData = value
    if (format === 'msgpack') {
      if (value instanceof Uint8Array) {
        wire = decodeMsgPack(value)
      }
    } else if (typeof value === 'string') {
      wire = JSON.parse(value)
    }
    return this.transform(wire, meta, { direction: 'decode', format }) as T
  }

  private static transform(value: ApiData, meta: ModelMetadata, ctx: TransformContext): ApiData {
    if (value === undefined || value === null) {
      return value
    }

    if (meta.codecKey) {
      return this.applyEncodeableTypeConversion(value, meta.codecKey, ctx)
    }

    switch (meta.kind) {
      case 'object':
        return this.transformObject(value, meta, ctx)
      case 'array':
        return this.transformType(value, { kind: 'array', item: meta.arrayItems ?? { kind: 'scalar' } }, ctx)
      case 'passthrough':
      default:
        return this.transformType(value, meta.passThrough ?? { kind: 'scalar' }, ctx)
    }
  }

  private static transformObject(value: ApiData, meta: ModelMetadata, ctx: TransformContext): ApiData {
    const fields = meta.fields ?? []
    const hasFlattenedCodecField = fields.some((f) => f.flattened && f.type.kind === 'codec')
    if (ctx.direction === 'encode') {
      const src = value as Record<string, ApiData>
      const out: Record<string, ApiData> = {}
      for (const field of fields) {
        const fieldValue = src[field.name]
        if (fieldValue === undefined) continue
        const encoded = this.transformType(fieldValue, field.type, ctx)
        if (encoded === undefined && fieldValue === undefined) continue
        if (field.flattened && field.type.kind === 'codec') {
          // Merge code flattened field into parent
          const mapValue = encoded as Record<string, ApiData>
          for (const [k, v] of Object.entries(mapValue ?? {})) out[k] = v
          continue
        }
        if (field.wireKey) out[field.wireKey] = encoded
      }
      if (meta.additionalProperties) {
        for (const [key, val] of Object.entries(src)) {
          if (fields.some((f) => f.name === key)) continue
          out[key] = this.transformType(val, meta.additionalProperties, ctx)
        }
      }
      return out
    }

    const out: Record<string, ApiData> = {}
    const fieldByWire = new Map(fields.filter((f) => !!f.wireKey).map((field) => [field.wireKey as string, field]))

    const entries = value instanceof Map ? Array.from(value.entries()) : Object.entries(value as Record<string, ApiData>)
    for (const [key, wireValue] of entries) {
      const wireKey = key instanceof Uint8Array ? Buffer.from(key).toString('utf-8') : key
      const isStringKey = typeof wireKey === 'string'
      const field = isStringKey ? fieldByWire.get(wireKey) : undefined
      if (field) {
        const decoded = this.transformType(wireValue, field.type, ctx)
        out[field.name] = decoded
        continue
      }
      if (isStringKey && meta.additionalProperties) {
        out[wireKey] = this.transformType(wireValue, meta.additionalProperties, ctx)
        continue
      }
      // If we have a flattened code field, then don't map
      if (isStringKey && !hasFlattenedCodecField) {
        out[wireKey] = wireValue
      }
    }

    // If there are flattened fields, attempt to reconstruct them from remaining keys by decoding
    if (hasFlattenedCodecField) {
      for (const field of fields) {
        if (out[field.name] !== undefined) continue
        if (field.flattened && field.type.kind === 'codec') {
          // Reconstruct from entire object map
          out[field.name] = this.applyEncodeableTypeConversion(value, field.type.codecKey, ctx)
        }
      }
    }

    return out
  }

  private static transformType(value: ApiData, type: FieldType, ctx: TransformContext): ApiData {
    if (value === undefined || value === null) return value

    switch (type.kind) {
      case 'scalar':
        return this.transformScalar(value, type, ctx)
      case 'codec':
        return this.applyEncodeableTypeConversion(value, type.codecKey, ctx)
      case 'model':
        return this.transform(value, typeof type.meta === 'function' ? type.meta() : type.meta, ctx)
      case 'array':
        if (!Array.isArray(value)) return value
        return value.map((item) => this.transformType(item, type.item, ctx))
      case 'record': {
        if ((!(value instanceof Map) && typeof value !== 'object') || value === null) return value
        const entries = value instanceof Map ? Array.from(value.entries()) : Object.entries(value as Record<string, ApiData>)
        return Object.fromEntries(
          entries.map(([k, v]) => {
            const key = k instanceof Uint8Array ? Buffer.from(k).toString('utf-8') : k
            return [key, this.transformType(v, type.value, ctx)]
          }),
        )
      }
      case 'map':
        return this.transformMap(value, type, ctx)
      default:
        return value
    }
  }

  private static transformScalar(value: ApiData, meta: ScalarFieldType, ctx: TransformContext): ApiData {
    if (ctx.direction === 'encode') {
      if (meta.isBytes && ctx.format === 'json') {
        if (value instanceof Uint8Array) return Buffer.from(value).toString('base64')
      }
      if (meta.isBigint && ctx.format === 'json') {
        if (typeof value === 'bigint') return value.toString()
        if (typeof value === 'number') return Math.trunc(value).toString()
        if (typeof value === 'string') return value
      }
      return value
    }

    if (meta.isBytes && ctx.format === 'json' && typeof value === 'string') {
      return new Uint8Array(Buffer.from(value, 'base64'))
    }

    if (value instanceof Uint8Array) {
      if (meta.isAddress) {
        // TODO: NC - Fix all the address models to have this on it.
        return addressFromPublicKey(value)
      } else if (!meta.isBytes) {
        return Buffer.from(value).toString('utf-8')
      }
      return value
    }

    if (meta.isBigint) {
      if (typeof value === 'string') {
        try {
          return BigInt(value)
        } catch {
          return value
        }
      }
      if (typeof value === 'number' && Number.isInteger(value)) {
        return BigInt(value)
      }
    }

    if (value instanceof Map) {
      const out: Record<string, ApiData> = {}
      for (const [k, v] of value.entries()) {
        const key = k instanceof Uint8Array ? Buffer.from(k).toString('utf-8') : k.toString()
        out[key] = this.transformType(v, { kind: 'scalar', isBytes: v instanceof Uint8Array }, ctx)
      }
      return out
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.transformType(item, { kind: 'scalar', isBytes: item instanceof Uint8Array }, ctx))
    }

    return value
  }

  private static applyEncodeableTypeConversion(value: ApiData, typeKey: string, ctx: TransformContext): ApiData {
    const codec = encodeableTypeConverterRegistry.get(typeKey)
    if (!codec) {
      throw new Error(`Type converter for "${typeKey}" is not registered`)
    }

    // TODO: NC - Need to properly guard against these conditions
    if (ctx.direction === 'encode') {
      if (value instanceof Map) {
        throw new Error(`Cannot encode Map with type converter "${typeKey}"`)
      }
      return codec.beforeEncoding(value as Parameters<typeof codec.beforeEncoding>[0], ctx.format)
    }

    return codec.afterDecoding(value as Parameters<typeof codec.afterDecoding>[0], ctx.format)
  }

  private static transformMap(value: ApiData, meta: MapFieldType, ctx: TransformContext): ApiData {
    if (ctx.direction === 'encode') {
      if (!(value instanceof Map)) return value
      const result = new Map()
      for (const [k, v] of value.entries()) {
        const transformedValue = this.transformType(v, meta.value, ctx)
        result.set(k, transformedValue)
      }
      return result
    }
    // Decoding
    if ((!(value instanceof Map) && typeof value !== 'object') || value === null) return value
    const entries = value instanceof Map ? Array.from(value.entries()) : Object.entries(value as Record<string, ApiData>)
    const result = new Map()
    for (const [k, v] of entries) {
      const transformedValue = this.transformType(v, meta.value, ctx)
      result.set(k, transformedValue)
    }
    return result
  }

  private static convertToNestedMaps(value: ApiData): Map<string, ApiData> | ApiData[] | ApiData {
    if (value === null || value === undefined) {
      return value
    }

    if (Array.isArray(value)) {
      // Keep arrays as arrays but recursively convert nested objects to Maps
      return value.map((item) => {
        if (typeof item === 'object' && item !== null && !Array.isArray(item) && !(item instanceof Uint8Array)) {
          return this.convertToNestedMaps(item)
        } else if (Array.isArray(item)) {
          return this.convertToNestedMaps(item)
        }
        return item
      })
    }

    if (typeof value === 'object' && value !== null && !(value instanceof Uint8Array)) {
      const map = new Map<string, ApiData>()
      Object.entries(value as Record<string, ApiData>).forEach(([key, val]) => {
        map.set(key, this.convertToNestedMaps(val))
      })
      return map
    }

    // For primitive values and Uint8Array, return them directly
    return value
  }
}

type TransformDirection = 'encode' | 'decode'

interface TransformContext {
  readonly direction: TransformDirection
  readonly format: BodyFormat
}

class SignedTransactionConverter implements EncodeableTypeConverter<SignedTransaction> {
  beforeEncoding(value: SignedTransaction, format: BodyFormat): Record<string, unknown> {
    if (format === 'json') {
      throw new Error('JSON format not supported for SignedTransaction encoding')
    }
    return toSignedTransactionDto(value)
  }
  afterDecoding(value: Record<string, unknown> | Map<number | bigint | Uint8Array, unknown>, format: BodyFormat): SignedTransaction {
    if (format === 'json' || !(value instanceof Map)) {
      throw new Error('JSON format not supported for SignedTransaction decoding')
    }
    if (!(value instanceof Map)) {
      throw new Error('Invalid decoded msgpack format for SignedTransaction')
    }
    const stxnDto = decodedTransactionMapToObject(value) as Parameters<typeof fromSignedTransactionDto>[0]
    return fromSignedTransactionDto(stxnDto)
  }
}

registerEncodeableTypeConverter('SignedTransaction', new SignedTransactionConverter())
