[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-spec](../README.md) / AppSpec

# Interface: AppSpec

Defined in: [src/types/app-spec.ts:174](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L174)

An ARC-0032 Application Specification see https://github.com/algorandfoundation/ARCs/pull/150

## Properties

### bare\_call\_config

> **bare\_call\_config**: [`CallConfig`](CallConfig.md)

Defined in: [src/types/app-spec.ts:186](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L186)

The config of all BARE calls (i.e. non ABI calls with no args)

***

### contract

> **contract**: `ABIContractParams`

Defined in: [src/types/app-spec.ts:180](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L180)

The ABI-0004 contract definition see https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0004.md

***

### hints

> **hints**: [`HintSpec`](../type-aliases/HintSpec.md)

Defined in: [src/types/app-spec.ts:176](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L176)

Method call hints

***

### schema

> **schema**: [`SchemaSpec`](SchemaSpec.md)

Defined in: [src/types/app-spec.ts:182](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L182)

The values that make up the local and global state

***

### source

> **source**: [`AppSources`](AppSources.md)

Defined in: [src/types/app-spec.ts:178](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L178)

The TEAL source

***

### state

> **state**: [`StateSchemaSpec`](StateSchemaSpec.md)

Defined in: [src/types/app-spec.ts:184](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L184)

The rolled-up schema allocation values for local and global state
