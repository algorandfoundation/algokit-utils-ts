[@algorandfoundation/algokit-utils](../README.md) / [types/app-spec](../modules/types_app_spec.md) / Hint

# Interface: Hint

[types/app-spec](../modules/types_app_spec.md).Hint

Hint information for a given method call to allow client generation

## Table of contents

### Properties

- [call\_config](types_app_spec.Hint.md#call_config)
- [default\_arguments](types_app_spec.Hint.md#default_arguments)
- [readonly](types_app_spec.Hint.md#readonly)
- [structs](types_app_spec.Hint.md#structs)

## Properties

### call\_config

• **call\_config**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `clear_state?` | [`CallConfigValue`](../modules/types_app_spec.md#callconfigvalue) |
| `close_out?` | [`CallConfigValue`](../modules/types_app_spec.md#callconfigvalue) |
| `delete_application?` | [`CallConfigValue`](../modules/types_app_spec.md#callconfigvalue) |
| `no_op?` | [`CallConfigValue`](../modules/types_app_spec.md#callconfigvalue) |
| `opt_in?` | [`CallConfigValue`](../modules/types_app_spec.md#callconfigvalue) |
| `update_application?` | [`CallConfigValue`](../modules/types_app_spec.md#callconfigvalue) |

#### Defined in

[src/types/app-spec.ts:58](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L58)

___

### default\_arguments

• **default\_arguments**: `Record`<`string`, [`DefaultArgument`](types_app_spec.DefaultArgument.md)\>

#### Defined in

[src/types/app-spec.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L57)

___

### readonly

• **readonly**: `boolean`

#### Defined in

[src/types/app-spec.ts:56](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L56)

___

### structs

• **structs**: `Record`<`string`, [`Struct`](types_app_spec.Struct.md)\>

Any user-defined struct/tuple types used in the method call, keyed by parameter name or `output` for return type

#### Defined in

[src/types/app-spec.ts:55](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L55)
