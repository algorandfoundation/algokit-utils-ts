[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-client](../README.md) / ResolveAppByCreatorAndName

# Type Alias: ResolveAppByCreatorAndName

> **ResolveAppByCreatorAndName** = [`ResolveAppByCreatorAndNameBase`](ResolveAppByCreatorAndNameBase.md) & `object`

Defined in: [src/types/app-client.ts:88](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-client.ts#L88)

Configuration to resolve app by creator and name `getCreatorAppsByName`

## Type Declaration

### resolveBy

> **resolveBy**: `"creatorAndName"`

How the app ID is resolved, either by `'id'` or `'creatorAndName'`; must be `'creatorAndName'` if you want to use `deploy`
