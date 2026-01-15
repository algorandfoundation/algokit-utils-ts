[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/transaction](../README.md) / TransactionToSign

# Interface: TransactionToSign

Defined in: [src/types/transaction.ts:101](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L101)

Defines an unsigned transaction that will appear in a group of transactions along with its signing information

## Properties

### signer

> **signer**: [`AddressWithTransactionSigner`](../../../Packages/Transact/interfaces/AddressWithTransactionSigner.md) \| [`TransactionSigner`](../../../Packages/Transact/type-aliases/TransactionSigner.md)

Defined in: [src/types/transaction.ts:105](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L105)

The account to use to sign the transaction, either an account (with private key loaded) or a logic signature account

***

### transaction

> **transaction**: [`Transaction`](../../../Packages/Transact/classes/Transaction.md)

Defined in: [src/types/transaction.ts:103](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L103)

The unsigned transaction to sign and send
