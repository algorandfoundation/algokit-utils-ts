[@algorandfoundation/algokit-utils](../README.md) / [types/appspec](../modules/types_appspec.md) / AppSpec

# Interface: AppSpec

[types/appspec](../modules/types_appspec.md).AppSpec

An ARC-0032 Application Specification

**`See`**

https://github.com/algorandfoundation/ARCs/pull/150

## Table of contents

### Properties

- [bare\_call\_config](types_appspec.AppSpec.md#bare_call_config)
- [contract](types_appspec.AppSpec.md#contract)
- [hints](types_appspec.AppSpec.md#hints)
- [schema](types_appspec.AppSpec.md#schema)
- [source](types_appspec.AppSpec.md#source)
- [state](types_appspec.AppSpec.md#state)

## Properties

### bare\_call\_config

• **bare\_call\_config**: `Object`

The config of all BARE calls (i.e. non ABI calls with no args)

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `clear_state?` | [`CallConfigValue`](../modules/types_appspec.md#callconfigvalue) | Clear state bare call config |
| `close_out?` | [`CallConfigValue`](../modules/types_appspec.md#callconfigvalue) | Close out bare call config |
| `delete_application?` | [`CallConfigValue`](../modules/types_appspec.md#callconfigvalue) | Delete bare call config |
| `no_op?` | [`CallConfigValue`](../modules/types_appspec.md#callconfigvalue) | NoOp bare call config |
| `opt_in?` | [`CallConfigValue`](../modules/types_appspec.md#callconfigvalue) | Opt-in bare call config |
| `update_application?` | [`CallConfigValue`](../modules/types_appspec.md#callconfigvalue) | Update bare call config |

#### Defined in

[src/types/appspec.ts:17](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/appspec.ts#L17)

___

### contract

• **contract**: `ABIContractParams`

The ABI-0004 contract definition

**`See`**

https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0004.md

#### Defined in

[src/types/appspec.ts:11](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/appspec.ts#L11)

___

### hints

• **hints**: [`HintSpec`](../modules/types_appspec.md#hintspec)

Method call hints

#### Defined in

[src/types/appspec.ts:7](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/appspec.ts#L7)

___

### schema

• **schema**: [`SchemaSpec`](types_appspec.SchemaSpec.md)

The values that make up the local and global state

#### Defined in

[src/types/appspec.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/appspec.ts#L13)

___

### source

• **source**: [`AppSources`](types_appspec.AppSources.md)

The TEAL source

#### Defined in

[src/types/appspec.ts:9](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/appspec.ts#L9)

___

### state

• **state**: [`StateSchemaSpec`](types_appspec.StateSchemaSpec.md)

The rolled-up schema allocation values for local and global state

#### Defined in

[src/types/appspec.ts:15](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/appspec.ts#L15)
