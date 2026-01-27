[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algokit-utils](../README.md) / algos

# Function: algos()

> **algos**(`algos`): [`AlgoAmount`](../../types/amount/classes/AlgoAmount.md)

<<<<<<< HEAD
Defined in: [src/amount.ts:62](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L62)
=======
Defined in: [src/amount.ts:67](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L67)
>>>>>>> docs/fix-reference-warnings

Returns an amount of Algo using AlgoAmount

## Parameters

### algos

The amount of Algo

`number` | `bigint`

## Returns

[`AlgoAmount`](../../types/amount/classes/AlgoAmount.md)

<<<<<<< HEAD
## See

[AlgoAmount](../../types/amount/classes/AlgoAmount.md)
=======
## Example

```ts
// Create an amount of 100 Algo
const amount = algos(100)

// Access the value in microAlgo (100 * 1_000_000)
const microAlgoValue = amount.microAlgo // 100_000_000n

// Access the value in Algo
const algoValue = amount.algo // 100
```

## See

 - [Full working example](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/amount.spec.ts)
 - [AlgoAmount](../../types/amount/classes/AlgoAmount.md)
>>>>>>> docs/fix-reference-warnings
