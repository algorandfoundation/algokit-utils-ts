[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algokit-utils](../README.md) / TransactionToSign

# Interface: TransactionToSign

Defined in: [src/transaction/types.ts:101](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/transaction/types.ts#L101)

Defines an unsigned transaction that will appear in a group of transactions along with its signing information

## Properties

### signer

> **signer**: [`AddressWithTransactionSigner`](../../Subpaths/transact/interfaces/AddressWithTransactionSigner.md) \| [`TransactionSigner`](../../Subpaths/transact/type-aliases/TransactionSigner.md)

Defined in: [src/transaction/types.ts:105](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/transaction/types.ts#L105)

The account to use to sign the transaction, either an account (with private key loaded) or a logic signature account

***

### transaction

> **transaction**: [`Transaction`](../../Subpaths/transact/classes/Transaction.md)

Defined in: [src/transaction/types.ts:103](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/transaction/types.ts#L103)

The unsigned transaction to sign and send
