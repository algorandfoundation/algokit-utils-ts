[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algokit-utils](../README.md) / BuiltTransactions

# Interface: BuiltTransactions

Defined in: [src/composer.ts:214](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/composer.ts#L214)

Set of transactions built by `TransactionComposer`.

## Properties

### methodCalls

> **methodCalls**: `Map`\<`number`, [`ABIMethod`](../../Subpaths/abi/classes/ABIMethod.md)\>

Defined in: [src/composer.ts:218](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/composer.ts#L218)

Any `ABIMethod` objects associated with any of the transactions in a map keyed by transaction index.

***

### signers

> **signers**: `Map`\<`number`, [`TransactionSigner`](../../Subpaths/transact/type-aliases/TransactionSigner.md)\>

Defined in: [src/composer.ts:220](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/composer.ts#L220)

Any `TransactionSigner` objects associated with any of the transactions in a map keyed by transaction index.

***

### transactions

> **transactions**: [`Transaction`](../../Subpaths/transact/classes/Transaction.md)[]

Defined in: [src/composer.ts:216](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/composer.ts#L216)

The built transactions
