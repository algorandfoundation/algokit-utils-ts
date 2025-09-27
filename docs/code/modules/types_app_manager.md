[@algorandfoundation/algokit-utils](../README.md) / types/app-manager

# Module: types/app-manager

## Table of contents

### Classes

- [AppManager](../classes/types_app_manager.AppManager.md)

### Interfaces

- [AccessReference](../interfaces/types_app_manager.AccessReference.md)
- [AppInformation](../interfaces/types_app_manager.AppInformation.md)
- [BoxReference](../interfaces/types_app_manager.BoxReference.md)
- [BoxValueRequestParams](../interfaces/types_app_manager.BoxValueRequestParams.md)
- [BoxValuesRequestParams](../interfaces/types_app_manager.BoxValuesRequestParams.md)
- [HoldingReference](../interfaces/types_app_manager.HoldingReference.md)
- [LocalsReference](../interfaces/types_app_manager.LocalsReference.md)

### Type Aliases

- [BoxIdentifier](types_app_manager.md#boxidentifier)

### Functions

- [getAccessReference](types_app_manager.md#getaccessreference)

## Type Aliases

### BoxIdentifier

Ƭ **BoxIdentifier**: `string` \| `Uint8Array` \| [`TransactionSignerAccount`](../interfaces/types_account.TransactionSignerAccount.md)

Something that identifies an app box name - either a:
 * `Uint8Array` (the actual binary of the box name)
 * `string` (that will be encoded to a `Uint8Array`)
 * `TransactionSignerAccount` (that will be encoded into the
   public key address of the corresponding account)

#### Defined in

[src/types/app-manager.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L57)

## Functions

### getAccessReference

▸ **getAccessReference**(`accessReference`): `algosdk.TransactionResourceReference`

Returns an `algosdk.TransactionResourceReference` given a `AccessReference`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `accessReference` | [`AccessReference`](../interfaces/types_app_manager.AccessReference.md) |

#### Returns

`algosdk.TransactionResourceReference`

#### Defined in

[src/types/app-manager.ts:593](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L593)
