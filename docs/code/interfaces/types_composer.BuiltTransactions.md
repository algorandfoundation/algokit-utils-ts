[@algorandfoundation/algokit-utils](../README.md) / [types/composer](../modules/types_composer.md) / BuiltTransactions

# Interface: BuiltTransactions

[types/composer](../modules/types_composer.md).BuiltTransactions

Set of transactions built by `TransactionComposer`.

## Table of contents

### Properties

- [methodCalls](types_composer.BuiltTransactions.md#methodcalls)
- [signers](types_composer.BuiltTransactions.md#signers)
- [transactions](types_composer.BuiltTransactions.md#transactions)

## Properties

### methodCalls

• **methodCalls**: `Map`\<`number`, `ABIMethod`\>

Any `ABIMethod` objects associated with any of the transactions in a map keyed by transaction index.

#### Defined in

[src/types/composer.ts:541](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L541)

___

### signers

• **signers**: `Map`\<`number`, `TransactionSigner`\>

Any `TransactionSigner` objects associated with any of the transactions in a map keyed by transaction index.

#### Defined in

[src/types/composer.ts:543](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L543)

___

### transactions

• **transactions**: `Transaction`[]

The built transactions

#### Defined in

[src/types/composer.ts:539](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L539)
