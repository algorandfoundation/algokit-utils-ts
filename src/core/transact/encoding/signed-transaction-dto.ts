import { TransactionDto } from './transaction-dto'

/**
 * Represents the encodeable data structure for an Algorand signed transaction
 * that can be msgpack encoded and decoded.
 */
export interface SignedTransactionDto {
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
export interface MultisigSignatureDto {
  /** Version */
  v?: number

  /** Threshold */
  thr?: number

  /** Subsignatures */
  subsig?: MultisigSubsignatureSto[]
}

/**
 * Encodeable multisig subsignature structure
 */
export interface MultisigSubsignatureSto {
  /** Public key */
  pk?: Uint8Array

  /** Signature (optional) */
  s?: Uint8Array
}

/**
 * Encodeable logic signature structure
 */
export interface LogicSignatureDto {
  /** Logic signature program */
  l?: Uint8Array

  /** Arguments (optional) */
  arg?: Uint8Array[]

  /** Signature for delegated logic sig (optional) */
  sig?: Uint8Array

  /** Multisig for delegated logic sig (optional) */
  msig?: MultisigSignatureDto
}
