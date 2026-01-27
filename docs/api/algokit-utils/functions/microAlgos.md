[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algokit-utils](../README.md) / microAlgos

# Function: microAlgos()

> **microAlgos**(`microAlgos`): [`AlgoAmount`](../../types/amount/classes/AlgoAmount.md)

<<<<<<< HEAD
Defined in: [src/amount.ts:77](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L77)
=======
Defined in: [src/amount.ts:88](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L88)
>>>>>>> docs/fix-reference-warnings

Returns an amount of µAlgo using AlgoAmount

## Parameters

### microAlgos

The amount of µAlgo

`number` | `bigint`

## Returns

[`AlgoAmount`](../../types/amount/classes/AlgoAmount.md)

<<<<<<< HEAD
## See

[algos](algos.md) for Algo denomination
=======
## Example

```ts
// Create an amount of 100 microAlgo
const amount = microAlgos(100)

// Access the value in microAlgo
const microAlgoValue = amount.microAlgo // 100n

// Access the value in Algo
const algoValue = amount.algo // 0.0001
```

## See

 - [Full working example](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/amount.spec.ts)
 - [algos](algos.md) for Algo denomination
>>>>>>> docs/fix-reference-warnings
