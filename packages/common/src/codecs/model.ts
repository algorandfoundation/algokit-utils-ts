import { Codec } from './codec'
import { ModelSerializer } from './model-serializer'
import type { BodyFormat, ModelMetadata } from './types'

// TODO: NC - Break circular dependency

/**
 * Model codec - handles nested model encoding/decoding
 */
export class ModelCodec<T extends object> extends Codec<T, Record<string, unknown> | unknown[]> {
  constructor(private readonly metadata: ModelMetadata | (() => ModelMetadata)) {
    super()
  }

  public defaultValue(): T {
    return {} as T
  }

  protected toEncoded(value: T, format: BodyFormat): Record<string, unknown> | unknown[] {
    const metadata = this.getMetadata()

    // Handle array types
    if (metadata.kind === 'array' && metadata.arrayCodec) {
      const encoded = metadata.arrayCodec.encode(value as unknown[], format)
      return (encoded ?? []) as unknown[]
    }

    // Handle passthrough types
    if (metadata.kind === 'passthrough' && metadata.codec) {
      const encoded = metadata.codec.encode(value, format)
      return encoded as Record<string, unknown>
    }

    // Handle object types
    return ModelSerializer.encode(value, metadata, format)
  }

  protected fromEncoded(value: Record<string, unknown> | unknown[], format: BodyFormat): T {
    const metadata = this.getMetadata()

    // Handle array types
    if (metadata.kind === 'array' && metadata.arrayCodec) {
      return metadata.arrayCodec.decode(value, format) as T
    }

    // Handle passthrough types
    if (metadata.kind === 'passthrough' && metadata.codec) {
      return metadata.codec.decode(value, format) as T
    }

    // Handle object types
    return ModelSerializer.decode(value, metadata, format)
  }

  /**
   * Get the metadata for this model (resolves lazy functions)
   */
  public getMetadata(): ModelMetadata {
    return typeof this.metadata === 'function' ? this.metadata() : this.metadata
  }
}
