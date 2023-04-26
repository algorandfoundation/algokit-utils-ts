[@algorandfoundation/algokit-utils](../README.md) / [types/app-spec](../modules/types_app_spec.md) / AppSpec

# Interface: AppSpec

[types/app-spec](../modules/types_app_spec.md).AppSpec

An ARC-0032 Application Specification

**`See`**

https://github.com/algorandfoundation/ARCs/pull/150

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

• **bare\_call\_config**: `Object`

The config of all BARE calls (i.e. non ABI calls with no args)

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `clear_state?` | [`CallConfigValue`](../modules/types_app_spec.md#callconfigvalue) | Clear state bare call config |
| `close_out?` | [`CallConfigValue`](../modules/types_app_spec.md#callconfigvalue) | Close out bare call config |
| `delete_application?` | [`CallConfigValue`](../modules/types_app_spec.md#callconfigvalue) | Delete bare call config |
| `no_op?` | [`CallConfigValue`](../modules/types_app_spec.md#callconfigvalue) | NoOp bare call config |
| `opt_in?` | [`CallConfigValue`](../modules/types_app_spec.md#callconfigvalue) | Opt-in bare call config |
| `update_application?` | [`CallConfigValue`](../modules/types_app_spec.md#callconfigvalue) | Update bare call config |

#### Defined in

[src/types/app-spec.ts:17](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L17)

___

### contract

• **contract**: `ABIContractParams`

The ABI-0004 contract definition

**`See`**

https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0004.md

#### Defined in

[src/types/app-spec.ts:11](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L11)

___

### hints

• **hints**: [`HintSpec`](../modules/types_app_spec.md#hintspec)

Method call hints

#### Defined in

[src/types/app-spec.ts:7](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L7)

___

### schema

• **schema**: [`SchemaSpec`](types_app_spec.SchemaSpec.md)

The values that make up the local and global state

#### Defined in

[src/types/app-spec.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L13)

___

### source

• **source**: [`AppSources`](types_app_spec.AppSources.md)

The TEAL source

#### Defined in

[src/types/app-spec.ts:9](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L9)

___

### state

• **state**: [`StateSchemaSpec`](types_app_spec.StateSchemaSpec.md)

The rolled-up schema allocation values for local and global state

#### Defined in

[src/types/app-spec.ts:15](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L15)