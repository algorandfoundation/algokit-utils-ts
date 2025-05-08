[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-client](../README.md) / ResolveAppByCreatorAndName

# Type Alias: ResolveAppByCreatorAndName

> **ResolveAppByCreatorAndName** = [`ResolveAppByCreatorAndNameBase`](ResolveAppByCreatorAndNameBase.md) & `object`

Defined in: [src/types/app-client.ts:104](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L104)

Configuration to resolve app by creator and name `getCreatorAppsByName`

## Type declaration

### resolveBy

> **resolveBy**: `"creatorAndName"`

How the app ID is resolved, either by `'id'` or `'creatorAndName'`; must be `'creatorAndName'` if you want to use `deploy`
