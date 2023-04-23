[@algorandfoundation/algokit-utils](../README.md) / [types/app-spec](../modules/types_app_spec.md) / DefaultArgument

# Interface: DefaultArgument

[types/app-spec](../modules/types_app_spec.md).DefaultArgument

Any default argument specifications for the given parameter

## Table of contents

### Properties

- [data](types_app_spec.DefaultArgument.md#data)
- [source](types_app_spec.DefaultArgument.md#source)

## Properties

### data

• **data**: `string` \| `number` \| `bigint`

The name or value corresponding to the source

#### Defined in

[src/types/app-spec.ts:95](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L95)

___

### source

• **source**: ``"global-state"`` \| ``"local-state"`` \| ``"abi-method"`` \| ``"constant"``

The source of the default argument value:
 * `global-state`: Global state; `data` is the name of the global state variable
 * `local-state`: Local state; `data` is the name of the local state variable
 * `abi-method`: ABI method call; `data` is the method spec of the ABI method to call
 * `constant`: A constant value; `data` is the value to use

#### Defined in

[src/types/app-spec.ts:93](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L93)
