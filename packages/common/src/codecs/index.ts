export type { ArrayModelMetadata, EncodingFormat, FieldMetadata, ObjectModelMetadata, PrimitiveModelMetadata } from './types'

export { Codec } from './codec'

export { addressCodec } from './primitives/address'
export { bigIntCodec } from './primitives/bigint'
export { booleanCodec } from './primitives/boolean'
export { bytesCodec } from './primitives/bytes'
export { bytesBase64Codec } from './primitives/bytes-base64'
export { fixedBytes1793Codec, fixedBytes32Codec, fixedBytes64Codec } from './primitives/fixed-bytes'
export { numberCodec } from './primitives/number'
export { stringCodec } from './primitives/string'
export { unknownCodec } from './primitives/unknown'

export {
  addressArrayCodec,
  ArrayCodec,
  bigIntArrayCodec,
  booleanArrayCodec,
  bytesArrayCodec,
  numberArrayCodec,
  stringArrayCodec,
} from './composite/array'
export { MapCodec } from './composite/map'
export { RecordCodec } from './composite/record'

export { ArrayModelCodec } from './models/array-model'
export { ObjectModelCodec } from './models/object-model'
export { PrimitiveModelCodec } from './models/primitive-model'

export { normalizeWireObject, normalizeWireString } from './wire'
export type { WireBigInt, WireMapKey, WireObject, WireString } from './wire'
