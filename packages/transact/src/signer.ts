import { Address, Addressable, concatArrays, Expand, ReadableAddress } from '@algorandfoundation/algokit-common'
import { encodeTransaction, Transaction } from './transactions/transaction'
import { DelegatedLsigSigner, ProgramDataSigner } from './logicsig'
import { encodeSignedTransaction, SignedTransaction } from './transactions/signed-transaction'

/** Function for signing a group of transactions */
export type TransactionSigner = (txnGroup: Transaction[], indexesToSign: number[]) => Promise<Uint8Array[]>

/** A transaction signer attached to an address */
export interface AddressWithTransactionSigner extends Addressable {
  signer: TransactionSigner
}

/** An address that can be used to send transactions that may or may not have a signer */
export type SendingAddress = ReadableAddress | AddressWithTransactionSigner

/** A delegated logic signature signer attached to an address */
export interface AddressWithDelegatedLsigSigner extends Addressable {
  lsigSigner: DelegatedLsigSigner
}

export interface AddressWithProgramDataSigner extends Addressable {
  programDataSigner: ProgramDataSigner
}

export type MxBytesSigner = (bytesToSign: Uint8Array) => Promise<Uint8Array>

export interface AddressWithMxBytesSigner extends Addressable {
  mxBytesSigner: MxBytesSigner
}

export type AddressWithSigners = Expand<
  Addressable & AddressWithTransactionSigner & AddressWithDelegatedLsigSigner & AddressWithProgramDataSigner & AddressWithMxBytesSigner
>

const SIGN_BYTES_PREFIX = Uint8Array.from([77, 88]) // "MX"

/**
 * Generate type-safe domain-separated signer callbacks given an ed25519 pubkey and a signing callback
 * @param args - The arguments for generating signers
 * @param args.ed25519Pubkey - The ed25519 public key used for signing
 * @param args.sendingAddress - The address that will be used as the sender of transactions. If not provided, defaults to the address derived from the ed25519 public key. This is useful when signing for a rekeyed account where the sending address differs from the auth address.
 * @param args.rawEd25519Signer - A callback function that signs raw bytes using the ed25519 private key
 * @returns An object containing the sending address and various signer functions
 */
export function generateAddressWithSigners(args: {
  ed25519Pubkey: Uint8Array
  sendingAddress?: Address
  rawEd25519Signer: (bytesToSign: Uint8Array) => Promise<Uint8Array>
}): AddressWithSigners {
  const { ed25519Pubkey, rawEd25519Signer } = args
  const authAddr = new Address(ed25519Pubkey)
  const sendingAddress = args.sendingAddress ?? authAddr

  const signer: TransactionSigner = async (txnGroup: Transaction[], indexesToSign: number[]) => {
    const stxns: SignedTransaction[] = []
    for (const index of indexesToSign) {
      const txn = txnGroup[index]
      const bytesToSign = encodeTransaction(txn)
      const signature = await rawEd25519Signer(bytesToSign)
      const stxn: SignedTransaction = {
        txn,
        sig: signature,
      }

      if (!txn.sender.equals(sendingAddress)) {
        stxn.authAddress = authAddr
      }

      stxns.push(stxn)
    }

    return stxns.map(encodeSignedTransaction)
  }

  const lsigSigner: DelegatedLsigSigner = async (lsig, msig) => {
    const bytesToSign = lsig.bytesToSignForDelegation(msig)
    return await rawEd25519Signer(bytesToSign)
  }

  const programDataSigner: ProgramDataSigner = async (data, lsig) => {
    const bytesToSign = lsig.programDataToSign(data)
    return await rawEd25519Signer(bytesToSign)
  }

  const mxBytesSigner: MxBytesSigner = async (bytes: Uint8Array) => {
    const bytesToSign = concatArrays(SIGN_BYTES_PREFIX, bytes)
    return await rawEd25519Signer(bytesToSign)
  }

  return { addr: sendingAddress, signer, lsigSigner, programDataSigner, mxBytesSigner }
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
        sig: new Uint8Array(64).fill(0),
      }
      unsigned.push(encodeSignedTransaction(stxn))
    }

    return Promise.resolve(unsigned)
  }
}
