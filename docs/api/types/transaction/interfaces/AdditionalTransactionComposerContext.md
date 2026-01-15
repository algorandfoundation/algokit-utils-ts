[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/transaction](../README.md) / AdditionalTransactionComposerContext

# Interface: AdditionalTransactionComposerContext

Defined in: [src/types/transaction.ts:136](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L136)

Additional context about the `TransactionComposer`.

## Properties

### maxFees

> **maxFees**: `Map`\<`number`, [`AlgoAmount`](../../amount/classes/AlgoAmount.md)\>

Defined in: [src/types/transaction.ts:138](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L138)

A map of transaction index in the `TransactionComposer` to the max fee that can be calculated for a transaction in the group
