import { Codec } from './codec'
import { ModelSerializer, WireObject } from './model-serializer'
import type { ArrayModelMetadata, BodyFormat, ModelMetadata, ObjectModelMetadata, PassthroughModelMetadata } from './types'

export class ObjectModelCodec<T extends Record<string, unknown> = Record<string, unknown>> extends Codec<T, WireObject> {
  private resolvedMetadata: ObjectModelMetadata | undefined = undefined

  constructor(private readonly metadata: ObjectModelMetadata | (() => ObjectModelMetadata)) {
    super()
  }

  public getMetadata(): ObjectModelMetadata {
    if (!this.resolvedMetadata) {
      this.resolvedMetadata = typeof this.metadata === 'function' ? this.metadata() : this.metadata
    }
    return this.resolvedMetadata
  }

  public defaultValue(): T {
    return {} as T
  }

  public isDefaultValue(value: T): boolean {
    const metadata = this.getMetadata()

    // Check if all fields have their default values
    for (const field of metadata.fields) {
      const fieldValue = (value as Record<string, unknown>)[field.name]

      // If field is undefined/null then it's optional and also default
      if (fieldValue === undefined || fieldValue === null) {
        continue
      }

      // Check if the field value equals the codec's default value
      const defaultValue = field.codec.defaultValue()

      // For primitive types, use simple equality
      if (fieldValue !== defaultValue) {
        return false
      }
    }

    // All fields are either undefined or at their default values
    return true
  }

  // TODO: NC - Can we make these protected and just use encode/decode from the parent?
  public toEncoded(value: T, format: BodyFormat): Record<string, unknown> {
    const metadata = this.getMetadata()
    return ModelSerializer.encode<T>(value, metadata, format)
  }

  public fromEncoded(value: WireObject, format: BodyFormat): T {
    const metadata = this.getMetadata()
    return ModelSerializer.decode(value, metadata, format)
  }
}

export class ArrayModelCodec<T extends unknown[] = unknown[]> extends Codec<T, unknown[] | undefined> {
  private resolvedMetadata: ArrayModelMetadata | undefined = undefined

  constructor(private readonly metadata: ArrayModelMetadata | (() => ArrayModelMetadata)) {
    super()
  }

  public getMetadata(): ArrayModelMetadata {
    if (!this.resolvedMetadata) {
      this.resolvedMetadata = typeof this.metadata === 'function' ? this.metadata() : this.metadata
    }
    return this.resolvedMetadata
  }

  public defaultValue(): T {
    return [] as unknown as T
  }

  public isDefaultValue(value: T): boolean {
    return value.length === 0
  }

  public toEncoded(value: T, format: BodyFormat): unknown[] | undefined {
    const metadata = this.getMetadata()
    return metadata.codec.encode(value, format)
  }

  public fromEncoded(value: unknown[] | undefined, format: BodyFormat): T {
    const metadata = this.getMetadata()
    return metadata.codec.decode(value, format) as T
  }
}

export class PassthroughModelCodec<T = unknown, TWire = T> extends Codec<T, TWire> {
  private resolvedMetadata: PassthroughModelMetadata | undefined = undefined

  constructor(private readonly metadata: PassthroughModelMetadata | (() => PassthroughModelMetadata)) {
    super()
  }

  public getMetadata(): PassthroughModelMetadata {
    if (!this.resolvedMetadata) {
      this.resolvedMetadata = typeof this.metadata === 'function' ? this.metadata() : this.metadata
    }
    return this.resolvedMetadata
  }

  public defaultValue(): T {
    const metadata = this.getMetadata()
    return metadata.codec.defaultValue() as T
  }

  public isDefaultValue(value: T): boolean {
    const metadata = this.getMetadata()
    const codec = metadata.codec as unknown as { isDefaultValue(value: unknown): boolean }
    return codec.isDefaultValue(value)
  }

  public toEncoded(value: T, format: BodyFormat): TWire {
    const metadata = this.getMetadata()
    return metadata.codec.encode(value, format) as TWire
  }

  public fromEncoded(value: TWire, format: BodyFormat): T {
    const metadata = this.getMetadata()
    return metadata.codec.decode(value, format) as T
  }
}

type ModelCodecDelegate<T, TEncoded> =
  | ObjectModelCodec<T & Record<string, unknown>>
  | ArrayModelCodec<T & unknown[]>
  | PassthroughModelCodec<T, TEncoded>

export class ModelCodec<T = unknown, TEncoded = unknown> extends Codec<T, TEncoded> {
  private delegate: ModelCodecDelegate<T, TEncoded> | undefined

  constructor(private readonly metadata: ModelMetadata | (() => ModelMetadata)) {
    super()
  }

  private getDelegate(): ModelCodecDelegate<T, TEncoded> {
    if (!this.delegate) {
      const resolvedMetadata = typeof this.metadata === 'function' ? this.metadata() : this.metadata

      switch (resolvedMetadata.kind) {
        case 'object':
          this.delegate = new ObjectModelCodec(resolvedMetadata) as ModelCodecDelegate<T, TEncoded>
          break
        case 'array':
          this.delegate = new ArrayModelCodec(resolvedMetadata) as ModelCodecDelegate<T, TEncoded>
          break
        case 'passthrough':
          this.delegate = new PassthroughModelCodec(resolvedMetadata) as ModelCodecDelegate<T, TEncoded>
          break
        default:
          throw new Error(`Unknown model metadata kind: ${(resolvedMetadata as ModelMetadata).kind}`)
      }
    }

    return this.delegate
  }

  public defaultValue(): T {
    return this.getDelegate().defaultValue()
  }

  public isDefaultValue(value: T): boolean {
    return this.getDelegate().isDefaultValue(value as never)
  }

  protected toEncoded(value: T, format: BodyFormat): TEncoded {
    return this.getDelegate().toEncoded(value as never, format) as TEncoded
  }

  protected fromEncoded(value: TEncoded, format: BodyFormat): T {
    return this.getDelegate().fromEncoded(value as never, format) as T
  }

  public getMetadata(): ModelMetadata {
    return this.getDelegate().getMetadata()
  }
}
