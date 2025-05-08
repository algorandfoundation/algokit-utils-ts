[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/composer](../README.md) / AppMethodCallParams

# Type Alias: AppMethodCallParams

> **AppMethodCallParams** = [`CommonAppCallParams`](CommonAppCallParams.md) & `object`

Defined in: [src/types/composer.ts:407](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L407)

Common parameters to define an ABI method call transaction.

## Type declaration

### onComplete?

> `optional` **onComplete**: `Exclude`\<`algosdk.OnApplicationComplete`, `algosdk.OnApplicationComplete.UpdateApplicationOC` \| `algosdk.OnApplicationComplete.ClearStateOC`\>
