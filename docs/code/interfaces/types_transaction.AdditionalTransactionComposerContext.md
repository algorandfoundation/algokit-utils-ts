[@algorandfoundation/algokit-utils](../README.md) / [types/transaction](../modules/types_transaction.md) / AdditionalTransactionComposerContext

# Interface: AdditionalTransactionComposerContext

[types/transaction](../modules/types_transaction.md).AdditionalTransactionComposerContext

Additional context about the `TransactionComposer`.

## Table of contents

### Properties

- [maxFees](types_transaction.AdditionalTransactionComposerContext.md#maxfees)

## Properties

### maxFees

• **maxFees**: `Map`\<`number`, [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)\>

A map of transaction index in the `TransactionComposer` to the max fee that can be calculated for a transaction in the group

#### Defined in

[src/types/transaction.ts:138](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/transaction.ts#L138)
