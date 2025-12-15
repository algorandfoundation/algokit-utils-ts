[@algorandfoundation/algokit-utils](../README.md) / types/app-manager

# Module: types/app-manager

## Table of contents

### Classes

- [AppManager](../classes/types_app_manager.AppManager.md)

### Interfaces

- [AppInformation](../interfaces/types_app_manager.AppInformation.md)
- [BoxReference](../interfaces/types_app_manager.BoxReference.md)
- [BoxValueRequestParams](../interfaces/types_app_manager.BoxValueRequestParams.md)
- [BoxValuesRequestParams](../interfaces/types_app_manager.BoxValuesRequestParams.md)

### Type Aliases

- [BoxIdentifier](types_app_manager.md#boxidentifier)
- [HoldingReference](types_app_manager.md#holdingreference)
- [LocalsReference](types_app_manager.md#localsreference)
- [ResourceReference](types_app_manager.md#resourcereference)

## Type Aliases

### BoxIdentifier

Ƭ **BoxIdentifier**: `string` \| `Uint8Array` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md)

Something that identifies an app box name - either a:
 * `Uint8Array` (the actual binary of the box name)
 * `string` (that will be encoded to a `Uint8Array`)
 * `TransactionSignerAccount` (that will be encoded into the
   public key address of the corresponding account)

#### Defined in

[src/types/app-manager.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L59)

___

### HoldingReference

Ƭ **HoldingReference**: `Object`

Defines a holding by referring to an Address and Asset it belongs to.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` \| `Address` | Address in access list, or the sender of the transaction. |
| `assetId` | `bigint` | Asset ID for asset in access list. |

#### Defined in

[src/types/app-manager.ts:102](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L102)

___

### LocalsReference

Ƭ **LocalsReference**: `Object`

Defines a local state by referring to an Address and App it belongs to.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` \| `Address` | Address in access list, or the sender of the transaction. |
| `appId` | `bigint` | Application ID for app in access list, or zero if referring to the called application. |

#### Defined in

[src/types/app-manager.ts:112](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L112)

___

### ResourceReference

Ƭ **ResourceReference**: `Object`

Names a single resource reference. Only one of the fields should be set.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `address?` | `string` \| `Address` | Any account addresses whose balance record is accessible by the executing ApprovalProgram or ClearStateProgram. |
| `appId?` | `bigint` | Application ID whose GlobalState may be read by the executing ApprovalProgram or ClearStateProgram. |
| `assetId?` | `bigint` | Asset ID whose AssetParams may be read by the executing ApprovalProgram or ClearStateProgram. |
| `box?` | [`BoxReference`](../interfaces/types_app_manager.BoxReference.md) | Defines a box by its name and the application ID it belongs to. |
| `holding?` | [`HoldingReference`](types_app_manager.md#holdingreference) | Defines a holding by referring to an Address and Asset it belongs to. |
| `locals?` | [`LocalsReference`](types_app_manager.md#localsreference) | Defines a local state by referring to an Address and App it belongs to. |

#### Defined in

[src/types/app-manager.ts:122](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L122)
