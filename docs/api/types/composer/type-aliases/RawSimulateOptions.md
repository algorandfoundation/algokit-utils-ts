[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/composer](../README.md) / RawSimulateOptions

# Type Alias: RawSimulateOptions

> **RawSimulateOptions** = [`Expand`](../../expand/type-aliases/Expand.md)\<`Omit`\<[`SimulateRequest`](../../../Subpaths/algod-client/type-aliases/SimulateRequest.md), `"txnGroups"`\>\> & `object`

Defined in: [src/types/composer.ts:126](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L126)

The raw API options to control a simulate request.
See algod API docs for more information: https://dev.algorand.co/reference/rest-apis/algod/#simulatetransaction

## Type Declaration

### resultOnFailure?

> `optional` **resultOnFailure**: `boolean`

Whether or not to return the result on simulation failure instead of throwing an error
