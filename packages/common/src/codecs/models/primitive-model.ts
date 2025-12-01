import { Codec } from '../codec'
import type { EncodingFormat, PrimitiveModelMetadata } from '../types'

export class PrimitiveModelCodec<T = unknown, TWire = T> extends Codec<T, TWire> {
  private resolvedMetadata: PrimitiveModelMetadata | undefined = undefined

  constructor(private readonly metadata: PrimitiveModelMetadata | (() => PrimitiveModelMetadata)) {
    super()
  }

  private getMetadata(): PrimitiveModelMetadata {
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

  public encode(value: T | undefined | null, format: EncodingFormat): TWire {
    const metadata = this.getMetadata()
    return metadata.codec.encode(value, format) as TWire
  }

  public encodeOptional(value: T | undefined | null, format: EncodingFormat): TWire | undefined {
    const metadata = this.getMetadata()
    return metadata.codec.encodeOptional(value, format) as TWire | undefined
  }

  public decode(value: TWire | undefined | null, format: EncodingFormat): T {
    const metadata = this.getMetadata()
    return metadata.codec.decode(value, format) as T
  }

  public decodeOptional(value: TWire | undefined | null, format: EncodingFormat): T | undefined {
    const metadata = this.getMetadata()
    return metadata.codec.decodeOptional(value, format) as T | undefined
  }
}
