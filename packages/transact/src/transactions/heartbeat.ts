import { Address } from '@algorandfoundation/algokit-common'

/**
 * Heartbeat transaction specific fields
 */
export type HeartbeatTransactionFields = {
  /** Heartbeat address */
  address: Address

  /** Heartbeat proof */
  proof: HeartbeatProof

  /** Heartbeat seed */
  seed: Uint8Array

  /** Heartbeat vote ID */
  voteId: Uint8Array

  /** Heartbeat key dilution */
  keyDilution: bigint
}

/**
 * Heartbeat proof structure
 */
export type HeartbeatProof = {
  /** Signature (64 bytes) */
  sig: Uint8Array

  /** Public key (32 bytes) */
  pk: Uint8Array

  /** Public key 2 (32 bytes) */
  pk2: Uint8Array

  /** Public key 1 signature (64 bytes) */
  pk1Sig: Uint8Array

  /** Public key 2 signature (64 bytes) */
  pk2Sig: Uint8Array
}
