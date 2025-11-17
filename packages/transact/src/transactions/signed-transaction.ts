import { ModelSerializer } from '@algorandfoundation/algokit-common'
import { decodeMsgpack, encodeMsgpack } from '../encoding/msgpack'
import { SignedTransactionMeta } from './signed-transaction-meta'
import { Transaction, validateTransaction } from './transaction'

/**
 * Represents a signed Algorand transaction
 */
export type SignedTransaction = {
  /**
   * The transaction that has been signed.
   */
  txn: Transaction

  /**
   * Optional Ed25519 signature authorizing the transaction.
   */
  signature?: Uint8Array

  /**
   * Optional multisignature signature for the transaction.
   */
  multiSignature?: MultisigSignature

  /**
   * Optional logic signature for the transaction.
   */
  logicSignature?: LogicSignature

  /**
   * Optional auth address applicable if the transaction sender is a rekeyed account.
   */
  authAddress?: string
}

/**
 * Represents a single subsignature in a multisignature transaction.
 *
 * Each subsignature contains the address of a participant and an optional signature.
 */
export type MultisigSubsignature = {
  /**
   * Address of a keypair account participant that is sub-signing a multisignature transaction.
   */
  address: string

  /**
   * Optional Ed25519 signature for the transaction.
   */
  signature?: Uint8Array
}

/**
 * Represents an Algorand multisignature signature.
 *
 * A multisignature signature is defined by a version, a threshold, and a list of participating addresses.
 * The version indicates the multisig protocol version, while the threshold specifies the minimum number of signatures required to authorize a transaction.
 * While technically this accepts `Address` types, it is expected that these will be the addresses of Ed25519 public keys.
 */
export type MultisigSignature = {
  /**
   * Multisig version.
   */
  version: number

  /**
   * Minimum number of signatures required.
   */
  threshold: number

  /**
   * Array of subsignatures
   */
  subsignatures: Array<MultisigSubsignature>
}

/**
 * Logic signature structure
 */
export type LogicSignature = {
  /**
   * Logic signature program
   */
  logic: Uint8Array

  /**
   * Logic signature arguments
   */
  args?: Uint8Array[]

  /**
   * Signature for delegated logic sig
   */
  signature?: Uint8Array

  /**
   * Legacy multisig for delegated logic sig
   */
  multiSignature?: MultisigSignature

  /**
   * Multisig for delegated logic sig
   */
  logicMultiSignature?: MultisigSignature
}

/**
 * Encode signed transactions to MsgPack for sending on the network.
 *
 * This method performs canonical encoding. No domain separation prefix is applicable.
 *
 * @param signedTransaction - The signed transaction to encode
 * @returns The MsgPack encoded bytes or an error if encoding fails.
 */
export function encodeSignedTransaction(signedTransaction: SignedTransaction): Uint8Array {
  validateSignedTransaction(signedTransaction)
  const encodingData = ModelSerializer.encode(signedTransaction, SignedTransactionMeta, 'msgpack')
  return encodeMsgpack(encodingData)
}

/**
 * Encode signed transactions to MsgPack for sending on the network.
 *
 *  This method performs canonical encoding. No domain separation prefix is applicable.
 *
 * @param signedTransactions - A collection of signed transactions to encode
 * @returns A collection of MsgPack encoded bytes or an error if encoding fails.
 */
export function encodeSignedTransactions(signedTransactions: SignedTransaction[]): Uint8Array[] {
  return signedTransactions.map((st) => encodeSignedTransaction(st))
}

/**
 * Decodes MsgPack bytes into a signed transaction.
 *
 * @param encodedSignedTransaction - The MsgPack encoded signed transaction bytes
 * @returns The decoded SignedTransaction or an error if decoding fails.
 */
export function decodeSignedTransaction(encodedSignedTransaction: Uint8Array): SignedTransaction {
  const decodedData = decodeMsgpack(encodedSignedTransaction)
  return ModelSerializer.decode<SignedTransaction>(decodedData, SignedTransactionMeta, 'msgpack')
}

/**
 * Decodes a collection of MsgPack bytes into a signed transaction collection.
 *
 * @param encodedSignedTransactions - A collection of MsgPack encoded bytes, each representing a signed transaction.
 * @returns A collection of decoded signed transactions or an error if decoding fails.
 */
export function decodeSignedTransactions(encodedSignedTransactions: Uint8Array[]): SignedTransaction[] {
  return encodedSignedTransactions.map((est) => decodeSignedTransaction(est))
}

/**
 * Validate a signed transaction structure
 */
function validateSignedTransaction(signedTransaction: SignedTransaction): void {
  validateTransaction(signedTransaction.txn)

  // Validate that only one signature type is set
  const sigTypes = [signedTransaction.signature, signedTransaction.multiSignature, signedTransaction.logicSignature]
  const setSigCount = sigTypes.filter((sig) => sig !== undefined).length

  if (setSigCount > 1) {
    throw new Error(`Only one signature type can be set, found ${setSigCount}`)
  }

  // Validate signature lengths
  if (signedTransaction.signature && signedTransaction.signature.length !== 64) {
    throw new Error('Signature must be 64 bytes')
  }
}
