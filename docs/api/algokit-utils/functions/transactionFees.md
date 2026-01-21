[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algokit-utils](../README.md) / transactionFees

# Function: transactionFees()

> **transactionFees**(`numberOfTransactions`): [`AlgoAmount`](../../types/amount/classes/AlgoAmount.md)

Defined in: [src/amount.ts:108](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L108)

Returns an amount of µAlgo to cover standard fees for the given number of transactions using AlgoAmount

## Parameters

### numberOfTransactions

`number`

The of standard transaction fees to return the amount of Algo

## Returns

[`AlgoAmount`](../../types/amount/classes/AlgoAmount.md)

## Example

```ts
// Get the fee amount for a single transaction (1000 microAlgo)
const singleFee = transactionFees(1)

// Get the fee amount for multiple transactions
const multipleFees = transactionFees(10)

// Access the values
const singleFeeValue = singleFee.microAlgo // 1_000n
const multipleFeeValue = multipleFees.microAlgo // 10_000n
```

## See

[Full working example](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/amount.spec.ts)
