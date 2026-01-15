[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-client](../README.md) / ResolveAppByCreatorAndNameBase

# Type Alias: ResolveAppByCreatorAndNameBase

> **ResolveAppByCreatorAndNameBase** = `object`

Defined in: [src/types/app-client.ts:75](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L75)

Configuration to resolve app by creator and name `getCreatorAppsByName`

## Properties

### creatorAddress

> **creatorAddress**: [`ReadableAddress`](../../../Algokit-Utils-API/type-aliases/ReadableAddress.md)

Defined in: [src/types/app-client.ts:77](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L77)

The address of the app creator account to resolve the app by

***

### findExistingUsing

> **findExistingUsing**: [`IndexerClient`](../../../Packages/Indexer-Client/classes/IndexerClient.md) \| [`AppLookup`](../../app/interfaces/AppLookup.md)

Defined in: [src/types/app-client.ts:84](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L84)

The mechanism to find an existing app instance metadata for the given creator and name; either:
 * An indexer instance to search the creator account apps; or
 * The cached value of the existing apps for the given creator from `getCreatorAppsByName`

***

### name?

> `optional` **name**: `string`

Defined in: [src/types/app-client.ts:79](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L79)

The optional name override to resolve the app by within the creator account (default: uses the name in the ABI contract)
