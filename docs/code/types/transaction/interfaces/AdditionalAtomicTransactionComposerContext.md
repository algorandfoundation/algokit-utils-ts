[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/transaction](../README.md) / AdditionalAtomicTransactionComposerContext

# Interface: AdditionalAtomicTransactionComposerContext

Defined in: [src/types/transaction.ts:146](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L146)

Additional context about the `AtomicTransactionComposer`.

## Properties

### maxFees

> **maxFees**: `Map`\<`number`, [`AlgoAmount`](../../amount/classes/AlgoAmount.md)\>

Defined in: [src/types/transaction.ts:148](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L148)

A map of transaction index in the `AtomicTransactionComposer` to the max fee that can be calculated for a transaction in the group

***

### suggestedParams

> **suggestedParams**: `Pick`\<`SuggestedParams`, `"fee"` \| `"minFee"`\>

Defined in: [src/types/transaction.ts:151](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L151)
