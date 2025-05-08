[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/composer](../README.md) / BuiltTransactions

# Interface: BuiltTransactions

Defined in: [src/types/composer.ts:537](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L537)

Set of transactions built by `TransactionComposer`.

## Properties

### methodCalls

> **methodCalls**: `Map`\<`number`, `ABIMethod`\>

Defined in: [src/types/composer.ts:541](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L541)

Any `ABIMethod` objects associated with any of the transactions in a map keyed by transaction index.

***

### signers

> **signers**: `Map`\<`number`, `TransactionSigner`\>

Defined in: [src/types/composer.ts:543](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L543)

Any `TransactionSigner` objects associated with any of the transactions in a map keyed by transaction index.

***

### transactions

> **transactions**: `Transaction`[]

Defined in: [src/types/composer.ts:539](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L539)

The built transactions
