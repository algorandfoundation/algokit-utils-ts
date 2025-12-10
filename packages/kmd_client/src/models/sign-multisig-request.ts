import type { Expand } from '@algorandfoundation/algokit-common'
import type { Transaction } from '@algorandfoundation/algokit-transact'
import type { SignMultisigTxnRequest } from './sign-multisig-txn-request'

export type SignMultisigRequest = Expand<Omit<SignMultisigTxnRequest, 'transaction'> & { transaction: Transaction }>
