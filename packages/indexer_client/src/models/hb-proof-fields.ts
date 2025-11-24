import type { ModelMetadata } from '../core/model-runtime'

/**
 * \[hbprf\] HbProof is a signature using HeartbeatAddress's partkey, thereby showing it is online.
 */
export type HbProofFields = {
  /**
   * \[s\] Signature of the heartbeat message.
   */
  hbSig?: Uint8Array

  /**
   * \[p\] Public key of the heartbeat message.
   */
  hbPk?: Uint8Array

  /**
   * \[p2\] Key for new-style two-level ephemeral signature.
   */
  hbPk2?: Uint8Array

  /**
   * \[p1s\] Signature of OneTimeSignatureSubkeyOffsetID(PK, Batch, Offset) under the key PK2.
   */
  hbPk1sig?: Uint8Array

  /**
   * \[p2s\] Signature of OneTimeSignatureSubkeyBatchID(PK2, Batch) under the master key (OneTimeSignatureVerifier).
   */
  hbPk2sig?: Uint8Array
}

export const HbProofFieldsMeta: ModelMetadata = {
  name: 'HbProofFields',
  kind: 'object',
  fields: [
    {
      name: 'hbSig',
      wireKey: 'hb-sig',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'hbPk',
      wireKey: 'hb-pk',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'hbPk2',
      wireKey: 'hb-pk2',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'hbPk1sig',
      wireKey: 'hb-pk1sig',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'hbPk2sig',
      wireKey: 'hb-pk2sig',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
  ],
}
