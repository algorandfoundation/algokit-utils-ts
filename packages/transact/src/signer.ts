import { Address, Addressable, ReadableAddress } from '@algorandfoundation/algokit-common'
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

export type AddressWithSigners = Addressable & AddressWithTransactionSigner & AddressWithDelegatedLsigSigner & AddressWithProgramDataSigner

/** Generate type-safe domain-separated signer callbacks given an ed25519 pubkey and a signing callback */
export function generateAddressWithSigners(
  ed25519Pubkey: Uint8Array,
  rawEd25519Signer: (bytesToSign: Uint8Array) => Promise<Uint8Array>,
): AddressWithSigners {
  const addr = new Address(ed25519Pubkey)

  const signer: TransactionSigner = async (txnGroup: Transaction[], indexesToSign: number[]) => {
    const stxns: SignedTransaction[] = []
    for (const index of indexesToSign) {
      const txn = txnGroup[index]
      const bytesToSign = encodeTransaction(txn)
      const signature = await rawEd25519Signer(bytesToSign)
      const stxn: SignedTransaction = {
        txn,
        signature,
      }

      if (!txn.sender.equals(addr)) {
        stxn.authAddress = addr
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
    const toBeSigned = lsig.programDataToSign(data)
    return await rawEd25519Signer(toBeSigned)
  }

  return { addr, signer, lsigSigner, programDataSigner }
}
