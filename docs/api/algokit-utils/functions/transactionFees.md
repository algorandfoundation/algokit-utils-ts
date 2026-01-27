[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algokit-utils](../README.md) / transactionFees

# Function: transactionFees()

> **transactionFees**(`numberOfTransactions`): [`AlgoAmount`](../classes/AlgoAmount.md)

Defined in: [src/amount.ts:204](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L204)

Returns an amount of µAlgo to cover standard fees for the given number of transactions using AlgoAmount

## Parameters

### numberOfTransactions

`number`

The of standard transaction fees to return the amount of Algo

## Returns

[`AlgoAmount`](../classes/AlgoAmount.md)

## Example

```ts
const fee = transactionFees(1)
```
