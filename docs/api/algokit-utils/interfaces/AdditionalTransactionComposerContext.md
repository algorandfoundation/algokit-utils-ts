[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algokit-utils](../README.md) / AdditionalTransactionComposerContext

# Interface: AdditionalTransactionComposerContext

Defined in: [src/transaction/types.ts:136](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/transaction/types.ts#L136)

Additional context about the `TransactionComposer`.

## Properties

### maxFees

> **maxFees**: `Map`\<`number`, [`AlgoAmount`](../classes/AlgoAmount.md)\>

Defined in: [src/transaction/types.ts:138](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/transaction/types.ts#L138)

A map of transaction index in the `TransactionComposer` to the max fee that can be calculated for a transaction in the group
