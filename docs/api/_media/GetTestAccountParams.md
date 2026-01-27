[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/testing](../README.md) / GetTestAccountParams

# Interface: GetTestAccountParams

Defined in: [src/types/testing.ts:45](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L45)

Parameters for the `getTestAccount` function.

## Properties

### accountGetter()?

> `optional` **accountGetter**: (`algorand`) => `Promise`\<[`Address`](../../../algokit-utils/classes/Address.md) & `object`\>

Defined in: [src/types/testing.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L51)

Optional override for how to get a test account; this allows you to retrieve accounts from a known or cached list of accounts.

#### Parameters

##### algorand

[`AlgorandClient`](../../algorand-client/classes/AlgorandClient.md)

#### Returns

`Promise`\<[`Address`](../../../algokit-utils/classes/Address.md) & `object`\>

***

### initialFunds

> **initialFunds**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/types/testing.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L47)

Initial funds to ensure the account has

***

### suppressLog?

> `optional` **suppressLog**: `boolean`

Defined in: [src/types/testing.ts:49](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L49)

Whether to suppress the log (which includes a mnemonic) or not (default: do not suppress the log)
