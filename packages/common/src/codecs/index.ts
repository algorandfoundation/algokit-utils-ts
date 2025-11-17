// Types
export type { BodyFormat, FieldMetadata, ModelKind, ModelMetadata } from './types'

// Base codec
export { Codec } from './codec'
export { ContextualCodec } from './contextual-codec'

// Primitive codecs
export {
  AddressCodec,
  addressCodec,
  BigIntCodec,
  bigIntCodec,
  BooleanCodec,
  booleanCodec,
  BytesCodec,
  bytesCodec,
  fixedBytes1793Codec,
  fixedBytes32Codec,
  fixedBytes64Codec,
  FixedBytesCodec,
  NumberCodec,
  numberCodec,
  StringCodec,
  // Singleton instances
  stringCodec,
  UnknownCodec,
  unknownCodec,
} from './primitives'

// Composite codecs
export {
  addressArrayCodec,
  ArrayCodec,
  bigIntArrayCodec,
  // Array codec instances
  bytesArrayCodec,
  MapCodec,
  NullableCodec,
  OmitEmptyObjectCodec,
  OptionalCodec,
  RecordCodec,
} from './composite'

// Model codec
export { ModelCodec } from './model'

// Model serializer
export { ModelSerializer } from './model-serializer'
