import type { ModelMetadata } from '../core/model-runtime'

/**
 * MasterDerivationKey is used to derive ed25519 keys for use in wallets
 */
export type MasterDerivationKey = number[]

export const MasterDerivationKeyMeta: ModelMetadata = {
  name: 'MasterDerivationKey',
  kind: 'array',
  arrayItems: { kind: 'scalar' },
}
