[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/transact](../README.md) / LogicSigSignature

# Type Alias: LogicSigSignature

> **LogicSigSignature** = `object`

Defined in: [packages/transact/src/transactions/signed-transaction.ts:80](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/transact/src/transactions/signed-transaction.ts#L80)

LogicSig signature structure

## Properties

### args?

> `optional` **args**: `Uint8Array`[]

Defined in: [packages/transact/src/transactions/signed-transaction.ts:89](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/transact/src/transactions/signed-transaction.ts#L89)

Logic signature arguments

***

### lmsig?

> `optional` **lmsig**: [`MultisigSignature`](MultisigSignature.md)

Defined in: [packages/transact/src/transactions/signed-transaction.ts:104](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/transact/src/transactions/signed-transaction.ts#L104)

Multisig for delegated logic sig

***

### logic

> **logic**: `Uint8Array`

Defined in: [packages/transact/src/transactions/signed-transaction.ts:84](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/transact/src/transactions/signed-transaction.ts#L84)

Logic signature program

***

### msig?

> `optional` **msig**: [`MultisigSignature`](MultisigSignature.md)

Defined in: [packages/transact/src/transactions/signed-transaction.ts:99](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/transact/src/transactions/signed-transaction.ts#L99)

Legacy multisig for delegated logic sig

***

### sig?

> `optional` **sig**: `Uint8Array`

Defined in: [packages/transact/src/transactions/signed-transaction.ts:94](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/transact/src/transactions/signed-transaction.ts#L94)

Signature for delegated logic sig
