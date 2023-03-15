[@algorandfoundation/algokit-utils](../README.md) / app

# Module: app

## Table of contents

### Interfaces

- [ABIAppCallArgs](../interfaces/app.ABIAppCallArgs.md)
- [AppCallParams](../interfaces/app.AppCallParams.md)
- [AppCallTransactionResult](../interfaces/app.AppCallTransactionResult.md)
- [AppReference](../interfaces/app.AppReference.md)
- [AppStorageSchema](../interfaces/app.AppStorageSchema.md)
- [BoxReference](../interfaces/app.BoxReference.md)
- [CompiledTeal](../interfaces/app.CompiledTeal.md)
- [CreateAppParams](../interfaces/app.CreateAppParams.md)
- [RawAppCallArgs](../interfaces/app.RawAppCallArgs.md)
- [UpdateAppParams](../interfaces/app.UpdateAppParams.md)

### Type Aliases

- [ABIReturn](app.md#abireturn)
- [AppCallArgs](app.md#appcallargs)

### Variables

- [ABI\_RETURN\_PREFIX](app.md#abi_return_prefix)
- [APP\_PAGE\_MAX\_SIZE](app.md#app_page_max_size)

### Functions

- [callApp](app.md#callapp)
- [compileTeal](app.md#compileteal)
- [createApp](app.md#createapp)
- [getABIReturn](app.md#getabireturn)
- [getAppArgsForTransaction](app.md#getappargsfortransaction)
- [getAppByIndex](app.md#getappbyindex)
- [updateApp](app.md#updateapp)

## Type Aliases

### ABIReturn

Ƭ **ABIReturn**: { `decodeError`: `undefined` ; `rawReturnValue`: `Uint8Array` ; `returnValue`: `ABIValue`  } \| { `decodeError`: `Error` ; `rawReturnValue`: `undefined` ; `returnValue`: `undefined`  }

The return value of an ABI method call

#### Defined in

[app.ts:169](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/app.ts#L169)

___

### AppCallArgs

Ƭ **AppCallArgs**: [`RawAppCallArgs`](../interfaces/app.RawAppCallArgs.md) \| [`ABIAppCallArgs`](../interfaces/app.ABIAppCallArgs.md)

Arguments to pass to an app call either:
  * The raw app call values to pass through into the transaction (after processing); or
  * An ABI method definition (method and args)

#### Defined in

[app.ts:91](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/app.ts#L91)

## Variables

### ABI\_RETURN\_PREFIX

• `Const` **ABI\_RETURN\_PREFIX**: `Uint8Array`

First 4 bytes of SHA-512/256 hash of "return"

#### Defined in

[app.ts:31](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/app.ts#L31)

___

### APP\_PAGE\_MAX\_SIZE

• `Const` **APP\_PAGE\_MAX\_SIZE**: ``2048``

The maximum number of bytes in an app code page

#### Defined in

[app.ts:29](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/app.ts#L29)

## Functions

### callApp

▸ **callApp**(`call`, `algod`): `Promise`<[`AppCallTransactionResult`](../interfaces/app.AppCallTransactionResult.md)\>

Issues a call to a given app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | [`AppCallParams`](../interfaces/app.AppCallParams.md) | The call details. |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/app.AppCallTransactionResult.md)\>

The result of the call

#### Defined in

[app.ts:263](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/app.ts#L263)

___

### compileTeal

▸ **compileTeal**(`tealCode`, `algod`): `Promise`<[`CompiledTeal`](../interfaces/app.CompiledTeal.md)\>

Compiles the given TEAL using algod and returns the result.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tealCode` | `string` | The TEAL code |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<[`CompiledTeal`](../interfaces/app.CompiledTeal.md)\>

The information about the compiled file

#### Defined in

[app.ts:412](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/app.ts#L412)

___

### createApp

▸ **createApp**(`create`, `algod`): `Promise`<[`AppCallTransactionResult`](../interfaces/app.AppCallTransactionResult.md) & [`AppReference`](../interfaces/app.AppReference.md)\>

Creates a smart contract app, returns the details of the created app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `create` | [`CreateAppParams`](../interfaces/app.CreateAppParams.md) | The parameters to create the app with |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/app.AppCallTransactionResult.md) & [`AppReference`](../interfaces/app.AppReference.md)\>

The details of the created app, or the transaction to create it if `skipSending`

#### Defined in

[app.ts:183](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/app.ts#L183)

___

### getABIReturn

▸ **getABIReturn**(`args?`, `confirmation?`): [`ABIReturn`](app.md#abireturn) \| `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `args?` | [`AppCallArgs`](app.md#appcallargs) |
| `confirmation?` | [`PendingTransactionResponse`](../interfaces/types_algod.PendingTransactionResponse.md) |

#### Returns

[`ABIReturn`](app.md#abireturn) \| `undefined`

#### Defined in

[app.ts:302](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/app.ts#L302)

___

### getAppArgsForTransaction

▸ **getAppArgsForTransaction**(`args?`): `undefined` \| { `accounts`: `undefined` \| `string`[] ; `appArgs`: `undefined` \| `Uint8Array`[] ; `boxes`: `undefined` \| `BoxReference`[] ; `foreignApps`: `undefined` \| `number`[] = actualArgs.apps; `foreignAssets`: `undefined` \| `number`[] = actualArgs.assets; `lease`: `undefined` \| `Uint8Array`  }

Returns the app args ready to load onto an app

**`See`**

object

#### Parameters

| Name | Type |
| :------ | :------ |
| `args?` | [`AppCallArgs`](app.md#appcallargs) |

#### Returns

`undefined` \| { `accounts`: `undefined` \| `string`[] ; `appArgs`: `undefined` \| `Uint8Array`[] ; `boxes`: `undefined` \| `BoxReference`[] ; `foreignApps`: `undefined` \| `number`[] = actualArgs.apps; `foreignAssets`: `undefined` \| `number`[] = actualArgs.assets; `lease`: `undefined` \| `Uint8Array`  }

#### Defined in

[app.ts:334](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/app.ts#L334)

___

### getAppByIndex

▸ **getAppByIndex**(`appIndex`, `algod`): `Promise`<[`ApplicationResponse`](../interfaces/types_algod.ApplicationResponse.md)\>

Gets the current data for the given app from algod.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appIndex` | `number` | The index of the app |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<[`ApplicationResponse`](../interfaces/types_algod.ApplicationResponse.md)\>

The data about the app

#### Defined in

[app.ts:401](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/app.ts#L401)

___

### updateApp

▸ **updateApp**(`update`, `algod`): `Promise`<[`AppCallTransactionResult`](../interfaces/app.AppCallTransactionResult.md)\>

Updates a smart contract app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `update` | [`UpdateAppParams`](../interfaces/app.UpdateAppParams.md) | The parameters to update the app with |
| `algod` | `default` | An algod client |

#### Returns

`Promise`<[`AppCallTransactionResult`](../interfaces/app.AppCallTransactionResult.md)\>

The transaction

#### Defined in

[app.ts:230](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/app.ts#L230)
