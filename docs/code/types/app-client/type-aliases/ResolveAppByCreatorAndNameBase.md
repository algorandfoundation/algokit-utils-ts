[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-client](../README.md) / ResolveAppByCreatorAndNameBase

# Type Alias: ResolveAppByCreatorAndNameBase

> **ResolveAppByCreatorAndNameBase** = `object`

Defined in: [src/types/app-client.ts:91](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L91)

Configuration to resolve app by creator and name `getCreatorAppsByName`

## Properties

### creatorAddress

> **creatorAddress**: `Address` \| `string`

Defined in: [src/types/app-client.ts:93](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L93)

The address of the app creator account to resolve the app by

***

### findExistingUsing

> **findExistingUsing**: `Indexer` \| [`AppLookup`](../../app/interfaces/AppLookup.md)

Defined in: [src/types/app-client.ts:100](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L100)

The mechanism to find an existing app instance metadata for the given creator and name; either:
 * An indexer instance to search the creator account apps; or
 * The cached value of the existing apps for the given creator from `getCreatorAppsByName`

***

### name?

> `optional` **name**: `string`

Defined in: [src/types/app-client.ts:95](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L95)

The optional name override to resolve the app by within the creator account (default: uses the name in the ABI contract)
