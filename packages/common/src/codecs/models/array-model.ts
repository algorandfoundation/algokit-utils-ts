import { Codec } from '../codec'
import type { ArrayModelMetadata, EncodingFormat } from '../types'

export class ArrayModelCodec<T extends unknown[] = unknown[]> extends Codec<T, unknown[] | undefined> {
  private resolvedMetadata: ArrayModelMetadata | undefined = undefined

  constructor(private readonly metadata: ArrayModelMetadata | (() => ArrayModelMetadata)) {
    super()
  }

  private getMetadata(): ArrayModelMetadata {
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
    return metadata.codec.isDefaultValue(value)
  }

  public encode(value: T | undefined | null, format: EncodingFormat): unknown[] | undefined {
    const metadata = this.getMetadata()
    return metadata.codec.encode(value, format)
  }

  public encodeOptional(value: T | undefined | null, format: EncodingFormat): unknown[] | undefined {
    const metadata = this.getMetadata()
    return metadata.codec.encodeOptional(value, format)
  }

  public decode(value: unknown[] | undefined | null, format: EncodingFormat): T {
    const metadata = this.getMetadata()
    return metadata.codec.decode(value, format) as T
  }

  public decodeOptional(value: unknown[] | undefined | null, format: EncodingFormat): T | undefined {
    const metadata = this.getMetadata()
    return metadata.codec.decodeOptional(value, format) as T | undefined
  }
}
