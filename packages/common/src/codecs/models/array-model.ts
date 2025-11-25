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
    return [] as unknown as T
  }

  protected isDefaultValue(value: T): boolean {
    return value.length === 0
  }

  protected toEncoded(value: T, format: EncodingFormat): unknown[] | undefined {
    const metadata = this.getMetadata()
    return metadata.codec.encodeOptional(value, format)
  }

  protected fromEncoded(value: unknown[] | undefined, format: EncodingFormat): T {
    const metadata = this.getMetadata()
    return metadata.codec.decode(value, format) as T
  }
}
