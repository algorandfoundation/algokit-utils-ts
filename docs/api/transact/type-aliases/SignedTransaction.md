[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [transact](../README.md) / SignedTransaction

# Type Alias: SignedTransaction

> **SignedTransaction** = `object`

Defined in: [packages/transact/src/transactions/signed-transaction.ts:9](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/signed-transaction.ts#L9)

Represents a signed Algorand transaction

## Properties

### authAddress?

> `optional` **authAddress**: [`Address`](../../index/classes/Address.md)

Defined in: [packages/transact/src/transactions/signed-transaction.ts:33](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/signed-transaction.ts#L33)

Optional auth address applicable if the transaction sender is a rekeyed account.

***

### lsig?

> `optional` **lsig**: [`LogicSigSignature`](LogicSigSignature.md)

Defined in: [packages/transact/src/transactions/signed-transaction.ts:28](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/signed-transaction.ts#L28)

Optional logic signature for the transaction.

***

### msig?

> `optional` **msig**: [`MultisigSignature`](MultisigSignature.md)

Defined in: [packages/transact/src/transactions/signed-transaction.ts:23](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/signed-transaction.ts#L23)

Optional multisignature signature for the transaction.

***

### sig?

> `optional` **sig**: `Uint8Array`

Defined in: [packages/transact/src/transactions/signed-transaction.ts:18](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/signed-transaction.ts#L18)

Optional Ed25519 signature authorizing the transaction.

***

### txn

> **txn**: [`Transaction`](../classes/Transaction.md)

Defined in: [packages/transact/src/transactions/signed-transaction.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/signed-transaction.ts#L13)

The transaction that has been signed.
