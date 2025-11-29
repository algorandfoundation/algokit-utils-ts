import { Addressable, ReadableAddress } from '@algorandfoundation/algokit-common'
import { Transaction } from './transactions/transaction'

export type TransactionSigner = (txnGroup: Transaction[], indexesToSign: number[]) => Promise<Uint8Array[]>

export interface AddressWithSigner extends Addressable {
  signer: TransactionSigner
}
export type SendingAddress = ReadableAddress | AddressWithSigner
