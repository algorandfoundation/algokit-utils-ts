import { Addressable, ReadableAddress } from '@algorandfoundation/algokit-common'
import { Transaction } from './transactions/transaction'

export type TransactionSigner = (txnGroup: Transaction[], indexesToSign: number[]) => Promise<Uint8Array[]>

export interface AddressWithTransactionSigner extends Addressable {
  signer: TransactionSigner
}
export type SendingAddress = ReadableAddress | AddressWithTransactionSigner
