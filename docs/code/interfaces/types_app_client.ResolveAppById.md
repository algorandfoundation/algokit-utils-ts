[@algorandfoundation/algokit-utils](../README.md) / [types/app-client](../modules/types_app_client.md) / ResolveAppById

# Interface: ResolveAppById

[types/app-client](../modules/types_app_client.md).ResolveAppById

Configuration to resolve app by ID

## Hierarchy

- [`ResolveAppByIdBase`](types_app_client.ResolveAppByIdBase.md)

  ↳ **`ResolveAppById`**

## Table of contents

### Properties

- [id](types_app_client.ResolveAppById.md#id)
- [name](types_app_client.ResolveAppById.md#name)
- [resolveBy](types_app_client.ResolveAppById.md#resolveby)

## Properties

### id

• **id**: `number` \| `bigint`

The id of an existing app to call using this client, or 0 if the app hasn't been created yet

#### Inherited from

[ResolveAppByIdBase](types_app_client.ResolveAppByIdBase.md).[id](types_app_client.ResolveAppByIdBase.md#id)

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:110](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L110)
=======
[src/types/app-client.ts:97](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L97)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:111](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L111)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:109](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L109)
>>>>>>> de5873b (chore: draft tests)

___

### name

• `Optional` **name**: `string`

The optional name to use to mark the app when deploying `ApplicationClient.deploy` (default: uses the name in the ABI contract)

#### Inherited from

[ResolveAppByIdBase](types_app_client.ResolveAppByIdBase.md).[name](types_app_client.ResolveAppByIdBase.md#name)

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:112](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L112)
=======
[src/types/app-client.ts:99](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L99)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:113](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L113)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:111](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L111)
>>>>>>> de5873b (chore: draft tests)

___

### resolveBy

• **resolveBy**: ``"id"``

How the app ID is resolved, either by `'id'` or `'creatorAndName'`; must be `'creatorAndName'` if you want to use `deploy`

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-client.ts:117](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L117)
=======
[src/types/app-client.ts:104](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L104)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-client.ts:118](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L118)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
=======
[src/types/app-client.ts:116](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L116)
>>>>>>> de5873b (chore: draft tests)
