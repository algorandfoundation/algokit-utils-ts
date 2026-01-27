[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algokit-utils](../README.md) / microAlgo

# Function: microAlgo()

> **microAlgo**(`microAlgos`): [`AlgoAmount`](../../types/amount/classes/AlgoAmount.md)

<<<<<<< HEAD
Defined in: [src/amount.ts:84](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L84)
=======
Defined in: [src/amount.ts:98](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L98)
>>>>>>> docs/fix-reference-warnings

Returns an amount of µAlgo using AlgoAmount

## Parameters

### microAlgos

The amount of µAlgo

`number` | `bigint`

## Returns

[`AlgoAmount`](../../types/amount/classes/AlgoAmount.md)

## Example

```ts
// Create an AlgoAmount using the Number.prototype extension
const amount = (100).microAlgo()

// Access the value in microAlgo
const microAlgoValue = amount.microAlgo // 100n
```

## See

[Full working example](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/amount.spec.ts)
