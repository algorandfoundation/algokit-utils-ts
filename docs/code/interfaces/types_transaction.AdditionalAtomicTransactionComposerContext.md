[@algorandfoundation/algokit-utils](../README.md) / [types/transaction](../modules/types_transaction.md) / AdditionalAtomicTransactionComposerContext

# Interface: AdditionalAtomicTransactionComposerContext

[types/transaction](../modules/types_transaction.md).AdditionalAtomicTransactionComposerContext

Additional context about the `AtomicTransactionComposer`.

## Table of contents

### Properties

- [maxFees](types_transaction.AdditionalAtomicTransactionComposerContext.md#maxfees)
- [suggestedParams](types_transaction.AdditionalAtomicTransactionComposerContext.md#suggestedparams)

## Properties

### maxFees

• **maxFees**: `Map`\<`number`, [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)\>

A map of transaction index in the `AtomicTransactionComposer` to the max fee that can be calculated for a transaction in the group

#### Defined in

[src/types/transaction.ts:152](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L152)

___

### suggestedParams

• **suggestedParams**: `Pick`\<`SuggestedParams`, ``"fee"`` \| ``"minFee"``\>

#### Defined in

[src/types/transaction.ts:155](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L155)
