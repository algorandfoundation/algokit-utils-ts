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

[src/types/app-spec.ts:145](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L145)

___

### contract

• **contract**: `ABIContractParams`

The ABI-0004 contract definition see https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0004.md

#### Defined in

[src/types/app-spec.ts:139](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L139)

___

### hints

• **hints**: [`HintSpec`](../modules/types_app_spec.md#hintspec)

Method call hints

#### Defined in

[src/types/app-spec.ts:135](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L135)

___

### schema

• **schema**: [`SchemaSpec`](types_app_spec.SchemaSpec.md)

The values that make up the local and global state

#### Defined in

[src/types/app-spec.ts:141](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L141)

___

### source

• **source**: [`AppSources`](types_app_spec.AppSources.md)

The TEAL source

#### Defined in

[src/types/app-spec.ts:137](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L137)

___

### state

• **state**: [`StateSchemaSpec`](types_app_spec.StateSchemaSpec.md)

The rolled-up schema allocation values for local and global state

#### Defined in

[src/types/app-spec.ts:143](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L143)
