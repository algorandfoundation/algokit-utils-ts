import type { Transaction } from '@algorandfoundation/algokit-transact'
import type { SignMultisigTxnRequest } from './sign-multisig-txn-request'
import type { Expand } from '@algorandfoundation/algokit-common'

export type SignMultisigRequest = Expand<Omit<SignMultisigTxnRequest, 'transaction'> & { transaction: Transaction }>
