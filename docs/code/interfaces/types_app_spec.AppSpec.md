[@algorandfoundation/algokit-utils](../README.md) / [types/app-spec](../modules/types_app_spec.md) / AppSpec

# Interface: AppSpec

[types/app-spec](../modules/types_app_spec.md).AppSpec

An ARC-0032 Application Specification see https://github.com/algorandfoundation/ARCs/pull/150

## Table of contents

### Properties

- [bare\_call\_config](types_app_spec.AppSpec.md#bare_call_config)
- [contract](types_app_spec.AppSpec.md#contract)
- [hints](types_app_spec.AppSpec.md#hints)
- [schema](types_app_spec.AppSpec.md#schema)
- [source](types_app_spec.AppSpec.md#source)
- [state](types_app_spec.AppSpec.md#state)

## Properties

### bare\_call\_config

• **bare\_call\_config**: [`CallConfig`](types_app_spec.CallConfig.md)

The config of all BARE calls (i.e. non ABI calls with no args)

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-spec.ts:138](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L138)
=======
[src/types/app-spec.ts:134](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L134)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-spec.ts:140](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L140)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)

___

### contract

• **contract**: `ABIContractParams`

The ABI-0004 contract definition see https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0004.md

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-spec.ts:132](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L132)
=======
[src/types/app-spec.ts:128](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L128)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-spec.ts:134](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L134)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)

___

### hints

• **hints**: [`HintSpec`](../modules/types_app_spec.md#hintspec)

Method call hints

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-spec.ts:128](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L128)
=======
[src/types/app-spec.ts:124](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L124)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-spec.ts:130](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L130)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)

___

### schema

• **schema**: [`SchemaSpec`](types_app_spec.SchemaSpec.md)

The values that make up the local and global state

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-spec.ts:134](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L134)
=======
[src/types/app-spec.ts:130](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L130)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-spec.ts:136](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L136)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)

___

### source

• **source**: [`AppSources`](types_app_spec.AppSources.md)

The TEAL source

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-spec.ts:130](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L130)
=======
[src/types/app-spec.ts:126](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L126)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-spec.ts:132](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L132)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)

___

### state

• **state**: [`StateSchemaSpec`](types_app_spec.StateSchemaSpec.md)

The rolled-up schema allocation values for local and global state

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-spec.ts:136](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L136)
=======
[src/types/app-spec.ts:132](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L132)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-spec.ts:138](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L138)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
