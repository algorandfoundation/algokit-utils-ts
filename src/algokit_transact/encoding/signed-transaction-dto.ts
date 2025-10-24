import { TransactionDto } from './transaction-dto'

/**
 * Represents the encodeable data structure for an Algorand signed transaction
 * that can be msgpack encoded and decoded.
 */
export type SignedTransactionDto = {
  /** The transaction */
  txn: TransactionDto

  /** Ed25519 signature (optional) */
  sig?: Uint8Array

  /** Multisignature (optional) */
  msig?: MultisigSignatureDto

  /** Logic signature (optional) */
  lsig?: LogicSignatureDto

  /** Auth address for rekeyed accounts (optional) */
  sgnr?: Uint8Array
}

/**
 * Encodeable multisignature structure
 */
export type MultisigSignatureDto = {
  /** Version */
  v?: number

  /** Threshold */
  thr?: number

  /** Subsignatures */
  subsig?: MultisigSubsignatureDto[]
}

/**
 * Encodeable multisig subsignature structure
 */
export type MultisigSubsignatureDto = {
  /** Public key */
  pk?: Uint8Array

  /** Signature (optional) */
  s?: Uint8Array
}

/**
 * Encodeable logic signature structure
 */
export type LogicSignatureDto = {
  /** Logic signature program */
  l?: Uint8Array

  /** Arguments (optional) */
  arg?: Uint8Array[]

  /** Signature for delegated logic sig (optional) */
  sig?: Uint8Array

  /** Multisig for delegated logic sig (optional) */
  msig?: MultisigSignatureDto
}
