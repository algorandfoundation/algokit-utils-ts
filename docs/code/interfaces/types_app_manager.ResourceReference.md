[@algorandfoundation/algokit-utils](../README.md) / [types/app-manager](../modules/types_app_manager.md) / ResourceReference

# Interface: ResourceReference

[types/app-manager](../modules/types_app_manager.md).ResourceReference

Names a single resource reference. Only one of the fields should be set.

## Table of contents

### Properties

- [address](types_app_manager.ResourceReference.md#address)
- [appId](types_app_manager.ResourceReference.md#appid)
- [assetId](types_app_manager.ResourceReference.md#assetid)
- [box](types_app_manager.ResourceReference.md#box)
- [holding](types_app_manager.ResourceReference.md#holding)
- [locals](types_app_manager.ResourceReference.md#locals)

## Properties

### address

• `Optional` **address**: `string` \| `Address`

Any account addresses whose balance record is accessible by the executing ApprovalProgram or ClearStateProgram.

#### Defined in

[src/types/app-manager.ts:122](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L122)

___

### appId

• `Optional` **appId**: `bigint`

Application ID whose GlobalState may be read by the executing ApprovalProgram or ClearStateProgram.

#### Defined in

[src/types/app-manager.ts:124](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L124)

___

### assetId

• `Optional` **assetId**: `bigint`

Asset ID whose AssetParams may be read by the executing ApprovalProgram or ClearStateProgram.

#### Defined in

[src/types/app-manager.ts:126](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L126)

___

### box

• `Optional` **box**: [`BoxReference`](types_app_manager.BoxReference.md)

Defines a box by its name and the application ID it belongs to.

#### Defined in

[src/types/app-manager.ts:132](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L132)

___

### holding

• `Optional` **holding**: [`HoldingReference`](types_app_manager.HoldingReference.md)

Defines a holding by referring to an Address and Asset it belongs to.

#### Defined in

[src/types/app-manager.ts:128](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L128)

___

### locals

• `Optional` **locals**: [`LocalsReference`](types_app_manager.LocalsReference.md)

Defines a local state by referring to an Address and App it belongs to.

#### Defined in

[src/types/app-manager.ts:130](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L130)
