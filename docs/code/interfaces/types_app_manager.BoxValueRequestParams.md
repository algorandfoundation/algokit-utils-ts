[@algorandfoundation/algokit-utils](../README.md) / [types/app-manager](../modules/types_app_manager.md) / BoxValueRequestParams

# Interface: BoxValueRequestParams

[types/app-manager](../modules/types_app_manager.md).BoxValueRequestParams

Parameters to get and decode a box value as an ABI type.

## Table of contents

### Properties

- [appId](types_app_manager.BoxValueRequestParams.md#appid)
- [boxName](types_app_manager.BoxValueRequestParams.md#boxname)
- [type](types_app_manager.BoxValueRequestParams.md#type)

## Properties

### appId

• **appId**: `bigint`

The ID of the app return box names for

#### Defined in

[src/types/app-manager.ts:71](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L71)

___

### boxName

• **boxName**: [`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier)

The name of the box to return either as a string, binary array or `BoxName`

#### Defined in

[src/types/app-manager.ts:73](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L73)

___

### type

• **type**: `ABIType`

The ABI type to decode the value using

#### Defined in

[src/types/app-manager.ts:75](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L75)
