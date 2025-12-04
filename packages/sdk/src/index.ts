import type { SignedTransaction, Transaction } from '@algorandfoundation/algokit-transact'
import { encodeSignedTransaction, encodeTransaction } from '@algorandfoundation/algokit-transact'
import * as convert from './convert'
import * as nacl from './nacl/naclWrappers'
import * as utils from './utils/utils'

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
    txn: txn,
    signature,
  }

  return {
    txID: txn.txID(),
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

export const ERROR_MULTISIG_BAD_SENDER = new Error(MULTISIG_BAD_SENDER_ERROR_MSG)
export const ERROR_INVALID_MICROALGOS = new Error(convert.INVALID_MICROALGOS_ERROR_MSG)

export { default as generateAccount } from './account'
// Export client classes with algosdk-compatible names
export * from './convert'
export { base64ToBytes, bytesToBase64, bytesToHex, bytesToString, coerceToBytes, hexToBytes } from './encoding/binarydata'
export * from './encoding/encoding'
export { decodeUint64, encodeUint64 } from './encoding/uint64'
export * from './logic/sourcemap'
export * from './logicsig'
export {
  masterDerivationKeyToMnemonic,
  mnemonicFromSeed,
  mnemonicToMasterDerivationKey,
  mnemonicToSecretKey,
  secretKeyToMnemonic,
  seedFromMnemonic,
} from './mnemonic/mnemonic'
export * from './multisig'
export * from './signer'
export { signLogicSigTransaction, signLogicSigTransactionObject } from './signing'
export * from './types/account'
export type { default as Account } from './types/account'
export * from './types/intDecoding'
export { default as IntDecoding } from './types/intDecoding'
export * from './types/transactions/index'
export * from './utils/utils'
