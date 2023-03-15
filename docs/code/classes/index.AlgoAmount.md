[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / AlgoAmount

# Class: AlgoAmount

[index](../modules/index.md).AlgoAmount

Wrapper class to ensure safe, explicit conversion between µAlgos, Algos and numbers

## Table of contents

### Constructors

- [constructor](index.AlgoAmount.md#constructor)

### Properties

- [amountInMicroAlgos](index.AlgoAmount.md#amountinmicroalgos)

### Accessors

- [algos](index.AlgoAmount.md#algos)
- [microAlgos](index.AlgoAmount.md#microalgos)

### Methods

- [Algos](index.AlgoAmount.md#algos-1)
- [MicroAlgos](index.AlgoAmount.md#microalgos-1)

## Constructors

### constructor

• **new AlgoAmount**(`amount`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | { `algos`: `number`  } \| { `microAlgos`: `number`  } |

#### Defined in

[algo-amount.ts:17](https://github.com/algorandfoundation/algokit-utils-ts/blob/88a7c0f/src/algo-amount.ts#L17)

## Properties

### amountInMicroAlgos

• `Private` **amountInMicroAlgos**: `number`

#### Defined in

[algo-amount.ts:5](https://github.com/algorandfoundation/algokit-utils-ts/blob/88a7c0f/src/algo-amount.ts#L5)

## Accessors

### algos

• `get` **algos**(): `number`

Return the amount as a number in Algos

#### Returns

`number`

#### Defined in

[algo-amount.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/88a7c0f/src/algo-amount.ts#L13)

___

### microAlgos

• `get` **microAlgos**(): `number`

Return the amount as a number in µAlgos

#### Returns

`number`

#### Defined in

[algo-amount.ts:8](https://github.com/algorandfoundation/algokit-utils-ts/blob/88a7c0f/src/algo-amount.ts#L8)

## Methods

### Algos

▸ `Static` **Algos**(`amount`): [`AlgoAmount`](index.AlgoAmount.md)

Create a

**`See`**

object representing the given number of Algos

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `number` |

#### Returns

[`AlgoAmount`](index.AlgoAmount.md)

#### Defined in

[algo-amount.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/88a7c0f/src/algo-amount.ts#L22)

___

### MicroAlgos

▸ `Static` **MicroAlgos**(`amount`): [`AlgoAmount`](index.AlgoAmount.md)

Create a

**`See`**

object representing the given number of µAlgos

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `number` |

#### Returns

[`AlgoAmount`](index.AlgoAmount.md)

#### Defined in

[algo-amount.ts:27](https://github.com/algorandfoundation/algokit-utils-ts/blob/88a7c0f/src/algo-amount.ts#L27)
