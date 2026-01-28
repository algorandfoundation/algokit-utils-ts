[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / AlgoAmount

# Class: AlgoAmount

[index](../modules/index.md).AlgoAmount

Wrapper class to ensure safe, explicit conversion between µAlgo, Algo and numbers

## Table of contents

### Constructors

- [constructor](index.AlgoAmount.md#constructor)

### Properties

- [amountInMicroAlgo](index.AlgoAmount.md#amountinmicroalgo)

### Accessors

- [algo](index.AlgoAmount.md#algo)
- [algos](index.AlgoAmount.md#algos)
- [microAlgo](index.AlgoAmount.md#microalgo)
- [microAlgos](index.AlgoAmount.md#microalgos)

### Methods

- [toString](index.AlgoAmount.md#tostring)
- [valueOf](index.AlgoAmount.md#valueof)
- [Algo](index.AlgoAmount.md#algo-1)
- [Algos](index.AlgoAmount.md#algos-1)
- [MicroAlgo](index.AlgoAmount.md#microalgo-1)
- [MicroAlgos](index.AlgoAmount.md#microalgos-1)

## Constructors

### constructor

• **new AlgoAmount**(`amount`): [`AlgoAmount`](index.AlgoAmount.md)

Create a new `AlgoAmount` instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | \{ `algos`: `number` \| `bigint`  } \| \{ `algo`: `number` \| `bigint`  } \| \{ `microAlgos`: `number` \| `bigint`  } \| \{ `microAlgo`: `number` \| `bigint`  } | An object specifying the amount in Algo or µALGO. Use the key 'algo' for Algo amounts and 'microAlgo' for µALGO. |

#### Returns

[`AlgoAmount`](index.AlgoAmount.md)

A new instance of `AlgoAmount` representing the specified amount.

**`Example`**

```typescript
const amount = new AlgoAmount({ algo: 5 });
```

#### Defined in

[src/amount.ts:35](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L35)

## Properties

### amountInMicroAlgo

• `Private` **amountInMicroAlgo**: `bigint`

#### Defined in

[src/amount.ts:3](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L3)

## Accessors

### algo

• `get` **algo**(): `number`

Return the amount as a number in Algo

#### Returns

`number`

#### Defined in

[src/amount.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L21)

___

### algos

• `get` **algos**(): `number`

Return the amount as a number in Algo

#### Returns

`number`

#### Defined in

[src/amount.ts:16](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L16)

___

### microAlgo

• `get` **microAlgo**(): `bigint`

Return the amount as a number in µAlgo

#### Returns

`bigint`

#### Defined in

[src/amount.ts:11](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L11)

___

### microAlgos

• `get` **microAlgos**(): `bigint`

Return the amount as a number in µAlgo

#### Returns

`bigint`

#### Defined in

[src/amount.ts:6](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L6)

## Methods

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Defined in

[src/amount.ts:48](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L48)

___

### valueOf

▸ **valueOf**(): `number`

valueOf allows you to use `AlgoAmount` in comparison operations such as `<` and `>=` etc.,
but it's not recommended to use this to convert to a number, it's much safer to explicitly call
the algos or microAlgos properties

#### Returns

`number`

#### Defined in

[src/amount.ts:56](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L56)

___

### Algo

▸ **Algo**(`amount`): [`AlgoAmount`](index.AlgoAmount.md)

Create a `AlgoAmount` object representing the given number of Algo

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `number` \| `bigint` |

#### Returns

[`AlgoAmount`](index.AlgoAmount.md)

#### Defined in

[src/amount.ts:66](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L66)

___

### Algos

▸ **Algos**(`amount`): [`AlgoAmount`](index.AlgoAmount.md)

Create a `AlgoAmount` object representing the given number of Algo

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `number` \| `bigint` |

#### Returns

[`AlgoAmount`](index.AlgoAmount.md)

#### Defined in

[src/amount.ts:61](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L61)

___

### MicroAlgo

▸ **MicroAlgo**(`amount`): [`AlgoAmount`](index.AlgoAmount.md)

Create a `AlgoAmount` object representing the given number of µAlgo

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `number` \| `bigint` |

#### Returns

[`AlgoAmount`](index.AlgoAmount.md)

#### Defined in

[src/amount.ts:76](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L76)

___

### MicroAlgos

▸ **MicroAlgos**(`amount`): [`AlgoAmount`](index.AlgoAmount.md)

Create a `AlgoAmount` object representing the given number of µAlgo

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `number` \| `bigint` |

#### Returns

[`AlgoAmount`](index.AlgoAmount.md)

#### Defined in

[src/amount.ts:71](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/amount.ts#L71)
