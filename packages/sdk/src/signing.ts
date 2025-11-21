import type { LogicSignature, SignedTransaction, Transaction } from '@algorandfoundation/algokit-transact'
import { encodeSignedTransaction, getTransactionId } from '@algorandfoundation/algokit-transact'
import { Address } from './encoding/address.js'
import { LogicSig, LogicSigAccount } from './logicsig.js'
import { addressFromMultisigPreImg } from './multisig.js'

function signLogicSigTransactionWithAddress(txn: Transaction, lsig: LogicSig, lsigAddress: Address) {
  if (!lsig.verify(lsigAddress.publicKey)) {
    throw new Error('Logic signature verification failed. Ensure the program and signature are valid.')
  }

  // Convert Address to string for comparison
  let authAddress: Address | undefined
  if (lsigAddress.equals(txn.sender)) {
    authAddress = lsigAddress
  }

  // Create LogicSignature from LogicSig
  const logicSignature: LogicSignature = {
    logic: lsig.logic,
    args: lsig.args,
    signature: lsig.sig,
    multiSignature: lsig.lmsig
      ? {
          version: lsig.lmsig.v,
          threshold: lsig.lmsig.thr,
          subsignatures: lsig.lmsig.subsig.map((subsig) => ({
            address: new Address(subsig.pk),
            signature: subsig.s,
          })),
        }
      : undefined,
  }

  const signedTxn: SignedTransaction = {
    txn: txn,
    logicSignature,
    authAddress,
  }

  return {
    txID: getTransactionId(txn),
    blob: encodeSignedTransaction(signedTxn),
  }
}

/**
 * signLogicSigTransactionObject takes a transaction and a LogicSig object and
 * returns a signed transaction.
 *
 * @param txn - The transaction to sign.
 * @param lsigObject - The LogicSig object that will sign the transaction.
 *
 * @returns Object containing txID and blob representing signed transaction.
 */
export function signLogicSigTransactionObject(txn: Transaction, lsigObject: LogicSig | LogicSigAccount) {
  let lsig: LogicSig
  let lsigAddress: Address

  if (lsigObject instanceof LogicSigAccount) {
    lsig = lsigObject.lsig
    lsigAddress = lsigObject.address()
  } else {
    lsig = lsigObject

    if (lsig.sig) {
      // For a LogicSig with a non-multisig delegating account, we cannot derive
      // the address of that account from only its signature, so assume the
      // delegating account is the sender. If that's not the case, the signing
      // will fail.
      // Convert sender string to Address
      lsigAddress = txn.sender
    } else if (lsig.lmsig) {
      const msigMetadata = {
        version: lsig.lmsig.v,
        threshold: lsig.lmsig.thr,
        pks: lsig.lmsig.subsig.map((subsig) => subsig.pk),
      }
      lsigAddress = addressFromMultisigPreImg(msigMetadata)
    } else {
      lsigAddress = lsig.address()
    }
  }

  return signLogicSigTransactionWithAddress(txn, lsig, lsigAddress)
}

/**
 * signLogicSigTransaction takes a transaction and a LogicSig object and returns
 * a signed transaction.
 *
 * @param txn - The transaction to sign.
 * @param lsigObject - The LogicSig object that will sign the transaction.
 *
 * @returns Object containing txID and blob representing signed transaction.
 * @throws error on failure
 */
export function signLogicSigTransaction(txn: Transaction, lsigObject: LogicSig | LogicSigAccount) {
  return signLogicSigTransactionObject(txn, lsigObject)
}
