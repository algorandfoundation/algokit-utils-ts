[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-client](../README.md) / ResolveAppByCreatorAndNameBase

# Type Alias: ResolveAppByCreatorAndNameBase

> **ResolveAppByCreatorAndNameBase** = `object`

Defined in: [src/types/app-client.ts:76](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L76)

Configuration to resolve app by creator and name `getCreatorAppsByName`

## Properties

### creatorAddress

> **creatorAddress**: [`ReadableAddress`](../../../algokit-utils/type-aliases/ReadableAddress.md)

Defined in: [src/types/app-client.ts:78](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L78)

The address of the app creator account to resolve the app by

***

### findExistingUsing

> **findExistingUsing**: [`IndexerClient`](../../../Subpaths/indexer-client/classes/IndexerClient.md) \| [`AppLookup`](../../app/interfaces/AppLookup.md)

Defined in: [src/types/app-client.ts:85](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L85)

The mechanism to find an existing app instance metadata for the given creator and name; either:
 * An indexer instance to search the creator account apps; or
 * The cached value of the existing apps for the given creator from `getCreatorAppsByName`

***

### name?

> `optional` **name**: `string`

Defined in: [src/types/app-client.ts:80](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L80)

The optional name override to resolve the app by within the creator account (default: uses the name in the ABI contract)
