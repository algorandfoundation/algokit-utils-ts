[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algokit-utils](../README.md) / algo

# Function: algo()

> **algo**(`algos`): [`AlgoAmount`](../../types/amount/classes/AlgoAmount.md)

Defined in: [src/amount.ts:77](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L77)

Returns an amount of Algo using AlgoAmount

## Parameters

### algos

The amount of Algo

`number` | `bigint`

## Returns

[`AlgoAmount`](../../types/amount/classes/AlgoAmount.md)

## Example

```ts
// Create an AlgoAmount using the Number.prototype extension
const amount = (100).algo()

// Access the value in Algo
const algoValue = amount.algo // 100
```

## See

[Full working example](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/amount.spec.ts)
