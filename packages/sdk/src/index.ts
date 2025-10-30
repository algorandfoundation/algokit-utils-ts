import * as convert from './convert'
import { Address } from './encoding/address'
import * as nacl from './nacl/naclWrappers'
import * as utils from './utils/utils'
// Import Transaction and SignedTransaction from algokit_transact
import type { SignedTransaction, Transaction, TransactionType } from '@algorandfoundation/algokit-transact'
import {
  assignFee,
  calculateFee,
  decodeSignedTransaction as decodeSignedTxn,
  decodeTransaction,
  encodeSignedTransaction,
  encodeTransaction,
  encodeTransactionRaw,
  getTransactionId,
  getTransactionIdRaw,
  groupTransactions,
} from '@algorandfoundation/algokit-transact'

const SIGN_BYTES_PREFIX = Uint8Array.from([77, 88]) // "MX"

// Errors
export const MULTISIG_BAD_SENDER_ERROR_MSG = 'The transaction sender address and multisig preimage do not match.'

/**
 * signTransaction takes an object with either payment or key registration fields and
 * a secret key and returns a signed blob.
 *
 * Payment transaction fields: from, to, amount, fee, firstValid, lastValid, genesisHash,
 * note(optional), GenesisID(optional), closeRemainderTo(optional)
 *
 * Key registration fields: fee, firstValid, lastValid, voteKey, selectionKey, voteFirst,
 * voteLast, voteKeyDilution, genesisHash, note(optional), GenesisID(optional)
 *
 * If flatFee is not set and the final calculated fee is lower than the protocol minimum fee, the fee will be increased to match the minimum.
 * @param txn - object with either payment or key registration fields
 * @param sk - Algorand Secret Key
 * @returns object contains the binary signed transaction and its txID
 */
export function signTransaction(txn: Transaction, sk: Uint8Array) {
  // Sign the transaction using nacl
  const bytesToSign = encodeTransaction(txn)
  const signature = nacl.sign(bytesToSign, sk)

  const signedTxn: SignedTransaction = {
    transaction: txn,
    signature,
  }

  return {
    txID: getTransactionId(txn),
    blob: encodeSignedTransaction(signedTxn),
  }
}

/**
 * signBytes takes arbitrary bytes and a secret key, prepends the bytes with "MX" for domain separation, signs the bytes
 * with the private key, and returns the signature.
 * @param bytes - Uint8array
 * @param sk - Algorand secret key
 * @returns binary signature
 */
export function signBytes(bytes: Uint8Array, sk: Uint8Array) {
  const toBeSigned = utils.concatArrays(SIGN_BYTES_PREFIX, bytes)
  const sig = nacl.sign(toBeSigned, sk)
  return sig
}

/**
 * verifyBytes takes array of bytes, an address, and a signature and verifies if the signature is correct for the public
 * key and the bytes (the bytes should have been signed with "MX" prepended for domain separation).
 * @param bytes - Uint8Array
 * @param signature - binary signature
 * @param addr - string address
 * @returns bool
 */
export function verifyBytes(bytes: Uint8Array, signature: Uint8Array, addr: string | Address) {
  const toBeVerified = utils.concatArrays(SIGN_BYTES_PREFIX, bytes)
  const addrObj = typeof addr === 'string' ? Address.fromString(addr) : addr
  return nacl.verify(toBeVerified, signature, addrObj.publicKey)
}

export const ERROR_MULTISIG_BAD_SENDER = new Error(MULTISIG_BAD_SENDER_ERROR_MSG)
export const ERROR_INVALID_MICROALGOS = new Error(convert.INVALID_MICROALGOS_ERROR_MSG)

export * from './abi/index'
export { default as generateAccount } from './account'
export * from './client'
// Export client classes with algosdk-compatible names
export { AlgodClient as Algodv2 } from '@algorandfoundation/algod-client'
export { KmdClient as Kmd } from './client/kmd'
export { IndexerClient as Indexer } from './client/v2/indexer/index'
export * as indexerModels from './client/v2/indexer/models/types'
export * from './composer'
export * from './convert'
export { Address, decodeAddress, encodeAddress, getApplicationAddress, isValidAddress } from './encoding/address'
export { bigIntToBytes, bytesToBigInt } from './encoding/bigint'
export { base64ToBytes, bytesToBase64, bytesToHex, bytesToString, coerceToBytes, hexToBytes } from './encoding/binarydata'
export * from './encoding/encoding'
export { decodeUint64, encodeUint64 } from './encoding/uint64'
export { assignGroupID, computeGroupID } from './group'
export * from './logic/sourcemap'
export * from './logicsig'
export * from './makeTxn'
export {
  masterDerivationKeyToMnemonic,
  mnemonicFromSeed,
  mnemonicToMasterDerivationKey,
  mnemonicToSecretKey,
  secretKeyToMnemonic,
  seedFromMnemonic,
} from './mnemonic/mnemonic'
export * from './multisig'
export {
  appendSignMultisigTransaction,
  appendSignRawMultisigSignature,
  createMultisigTransaction,
  mergeMultisigTransactions,
  signMultisigTransaction,
} from './multisigSigning'
// Re-export Transaction and SignedTransaction types and functions from algokit_transact
export {
  assignFee,
  calculateFee,
  decodeTransaction,
  encodeSignedTransaction,
  encodeTransaction,
  encodeTransactionRaw,
  getTransactionId,
  getTransactionIdRaw,
  groupTransactions,
}
export type { SignedTransaction, Transaction, TransactionType }
// Export decodeSignedTransaction with original name
export { decodeSignedTxn as decodeSignedTransaction }

// TODO: encodeUnsignedSimulateTransaction needs to be implemented or replaced
// For now, create a wrapper function
export function encodeUnsignedSimulateTransaction(txn: Transaction): Uint8Array {
  return encodeTransaction(txn)
}

export * from './signer'
export { signLogicSigTransaction, signLogicSigTransactionObject } from './signing'
export * from './stateproof'
// Re-export transaction-related types from algokit_transact
export type {
  AppCallTransactionFields as ApplicationTransactionFields,
  AssetConfigTransactionFields,
  AssetFreezeTransactionFields,
  AssetTransferTransactionFields,
  KeyRegistrationTransactionFields,
  PaymentTransactionFields,
} from '@algorandfoundation/algokit-transact'
export * from './types/account'
export type { default as Account } from './types/account'
// Block types are now provided by ../algod_client
// export * from './types/block'
export * from './types/intDecoding'
export { default as IntDecoding } from './types/intDecoding'
// StateDelta types depend on old block.ts encoding - use algod_client models instead
// export * from './types/statedelta'
export * from './types/transactions/index'
export * from './utils/utils'
export { waitForConfirmation } from './wait'
