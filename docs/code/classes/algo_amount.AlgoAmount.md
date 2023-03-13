[algotstest](../README.md) / [algo-amount](../modules/algo_amount.md) / AlgoAmount

# Class: AlgoAmount

[algo-amount](../modules/algo_amount.md).AlgoAmount

Wrapper class to ensure safe, explicit conversion between µAlgos, Algos and numbers

## Table of contents

### Constructors

- [constructor](algo_amount.AlgoAmount.md#constructor)

### Properties

- [amountInMicroAlgos](algo_amount.AlgoAmount.md#amountinmicroalgos)

### Accessors

- [algos](algo_amount.AlgoAmount.md#algos)
- [microAlgos](algo_amount.AlgoAmount.md#microalgos)

### Methods

- [Algos](algo_amount.AlgoAmount.md#algos-1)
- [MicroAlgos](algo_amount.AlgoAmount.md#microalgos-1)

## Constructors

### constructor

• **new AlgoAmount**(`amount`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | { `algos`: `number`  } \| { `microAlgos`: `number`  } |

#### Defined in

[algo-amount.ts:17](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/algo-amount.ts#L17)

## Properties

### amountInMicroAlgos

• `Private` **amountInMicroAlgos**: `number`

#### Defined in

[algo-amount.ts:5](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/algo-amount.ts#L5)

## Accessors

### algos

• `get` **algos**(): `number`

Return the amount as a number in Algos

#### Returns

`number`

#### Defined in

[algo-amount.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/algo-amount.ts#L13)

___

### microAlgos

• `get` **microAlgos**(): `number`

Return the amount as a number in µAlgos

#### Returns

`number`

#### Defined in

[algo-amount.ts:8](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/algo-amount.ts#L8)

## Methods

### Algos

▸ `Static` **Algos**(`amount`): [`AlgoAmount`](algo_amount.AlgoAmount.md)

Create a

**`See`**

object representing the given number of Algos

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `number` |

#### Returns

[`AlgoAmount`](algo_amount.AlgoAmount.md)

#### Defined in

[algo-amount.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/algo-amount.ts#L22)

___

### MicroAlgos

▸ `Static` **MicroAlgos**(`amount`): [`AlgoAmount`](algo_amount.AlgoAmount.md)

Create a

**`See`**

object representing the given number of µAlgos

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `number` |

#### Returns

[`AlgoAmount`](algo_amount.AlgoAmount.md)

#### Defined in

[algo-amount.ts:27](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/algo-amount.ts#L27)
