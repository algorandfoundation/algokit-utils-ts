[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/composer](../README.md) / AppMethodCallParams

# Type Alias: AppMethodCallParams

> **AppMethodCallParams** = [`CommonAppCallParams`](CommonAppCallParams.md) & `object`

Defined in: [src/transactions/app-call.ts:92](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/app-call.ts#L92)

Common parameters to define an ABI method call transaction.

## Type Declaration

### onComplete?

> `optional` **onComplete**: `Exclude`\<[`OnApplicationComplete`](../../../Subpaths/transact/enumerations/OnApplicationComplete.md), [`UpdateApplication`](../../../Subpaths/transact/enumerations/OnApplicationComplete.md#updateapplication) \| [`ClearState`](../../../Subpaths/transact/enumerations/OnApplicationComplete.md#clearstate)\>
