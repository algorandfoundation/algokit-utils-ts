import type { ModelMetadata } from '../core/model-runtime'

/**
 * The type of hash function used to create the proof, must be one of:
 * * sha512_256
 * * sha256
 */
export type Hashtype = 'sha512_256' | 'sha256'

export const HashtypeMeta: ModelMetadata = {
  name: 'Hashtype',
  kind: 'passthrough',
  passThrough: { kind: 'scalar' },
}
