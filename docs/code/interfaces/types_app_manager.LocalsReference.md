[@algorandfoundation/algokit-utils](../README.md) / [types/app-manager](../modules/types_app_manager.md) / LocalsReference

# Interface: LocalsReference

[types/app-manager](../modules/types_app_manager.md).LocalsReference

Defines a local state by referring to an Address and App it belongs to.

## Table of contents

### Properties

- [address](types_app_manager.LocalsReference.md#address)
- [appId](types_app_manager.LocalsReference.md#appid)

## Properties

### address

• **address**: `string` \| `Address`

Address in access list, or the sender of the transaction.

#### Defined in

[src/types/app-manager.ts:114](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L114)

___

### appId

• **appId**: `bigint`

Application ID for app in access list, or zero if referring to the called application.

#### Defined in

[src/types/app-manager.ts:112](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L112)
