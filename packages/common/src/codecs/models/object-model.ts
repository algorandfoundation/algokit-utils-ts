import { Codec } from '../codec'
import { ModelSerializer, WireObject } from '../model-serializer'
import type { EncodingFormat, ObjectModelMetadata } from '../types'

export class ObjectModelCodec<T extends Record<string, unknown> = Record<string, unknown>> extends Codec<T, WireObject> {
  private resolvedMetadata: ObjectModelMetadata | undefined = undefined
  private resolveDefaultValue: T | undefined = undefined

  constructor(private readonly metadata: ObjectModelMetadata | (() => ObjectModelMetadata)) {
    super()
  }

  private getMetadata(): ObjectModelMetadata {
    if (!this.resolvedMetadata) {
      this.resolvedMetadata = typeof this.metadata === 'function' ? this.metadata() : this.metadata
    }
    return this.resolvedMetadata
  }

  public defaultValue(): T {
    if (this.resolveDefaultValue === undefined) {
      const metadata = this.getMetadata()
      const result: Record<string, unknown> = {}

      // Populate all required fields with their default values
      for (const field of metadata.fields) {
        if (!field.optional) {
          result[field.name] = field.codec.defaultValue()
        }
      }
      this.resolveDefaultValue = result as T
    }
    return this.resolveDefaultValue
  }

  // TODO: NC - This can probably be cached or simplified
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

  protected toEncoded(value: T, format: EncodingFormat): Record<string, unknown> {
    const metadata = this.getMetadata()
    return ModelSerializer.encode<T>(value, metadata, format)
  }

  protected fromEncoded(value: WireObject, format: EncodingFormat): T {
    const metadata = this.getMetadata()
    return ModelSerializer.decode(value, metadata, format)
  }
}
