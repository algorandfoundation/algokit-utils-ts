import type { SignedTransaction, Transaction, TransactionSigner } from '@algorandfoundation/algokit-transact'
import { encodeSignedTransaction, encodeTransaction } from '@algorandfoundation/algokit-transact'
import { LogicSigAccount } from './logicsig.js'
import { MultisigMetadata } from './multisig.js'
import { mergeMultisigTransactions, signMultisigTransaction } from './multisigSigning.js'
import * as nacl from './nacl/naclWrappers.js'
import { signLogicSigTransactionObject } from './signing.js'
import Account from './types/account.js'

/**
 * Create a TransactionSigner that can sign transactions for the provided basic Account.
 */
export function makeBasicAccountTransactionSigner(account: Account): TransactionSigner {
  return (txnGroup: Transaction[], indexesToSign: number[]) => {
    const signed: Uint8Array[] = []

    for (const index of indexesToSign) {
      const txn = txnGroup[index]
      const authAddress = account.addr

      // Sign transaction using nacl
      const bytesToSign = encodeTransaction(txn)
      const signature = nacl.sign(bytesToSign, account.sk)

      const signedTxn: SignedTransaction = {
        txn: txn,
        signature,
        authAddress: !authAddress.equals(txn.sender) ? authAddress : undefined,
      }

      signed.push(encodeSignedTransaction(signedTxn))
    }

    return Promise.resolve(signed)
  }
}

/**
 * Create a TransactionSigner that can sign transactions for the provided LogicSigAccount.
 */
export function makeLogicSigAccountTransactionSigner(account: LogicSigAccount): TransactionSigner {
  return (txnGroup: Transaction[], indexesToSign: number[]) => {
    const signed: Uint8Array[] = []

    for (const index of indexesToSign) {
      const { blob } = signLogicSigTransactionObject(txnGroup[index], account)
      signed.push(blob)
    }

    return Promise.resolve(signed)
  }
}

/**
 * Create a TransactionSigner that can sign transactions for the provided Multisig account.
 * @param msig - The Multisig account metadata
 * @param sks - An array of private keys belonging to the msig which should sign the transactions.
 */
export function makeMultiSigAccountTransactionSigner(msig: MultisigMetadata, sks: Uint8Array[]): TransactionSigner {
  return (txnGroup: Transaction[], indexesToSign: number[]) => {
    const signed: Uint8Array[] = []

    for (const index of indexesToSign) {
      const txn = txnGroup[index]
      const partialSigs: Uint8Array[] = []

      for (const sk of sks) {
        const { blob } = signMultisigTransaction(txn, msig, sk)
        partialSigs.push(blob)
      }

      if (partialSigs.length > 1) {
        signed.push(mergeMultisigTransactions(partialSigs))
      } else {
        signed.push(partialSigs[0])
      }
    }

    return Promise.resolve(signed)
  }
}

/**
 * Create a makeEmptyTransactionSigner that does not specify any signer or
 * signing capabilities. This should only be used to simulate transactions.
 */
export function makeEmptyTransactionSigner(): TransactionSigner {
  return (txnGroup: Transaction[], indexesToSign: number[]) => {
    const unsigned: Uint8Array[] = []

    for (const index of indexesToSign) {
      const stxn: SignedTransaction = {
        txn: txnGroup[index],
        signature: new Uint8Array(64),
      }
      unsigned.push(encodeSignedTransaction(stxn))
    }

    return Promise.resolve(unsigned)
  }
}
